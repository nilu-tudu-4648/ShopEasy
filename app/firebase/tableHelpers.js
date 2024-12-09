// firebase/tableHelpers.js
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    getDoc,
    doc,
    updateDoc,
    Timestamp,
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from './firebaseConfig';
  
  // Check if table is currently reserved
  export const isTableReserved = async (tableId) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const now = Timestamp.now();
  
      const q = query(
        bookingsRef,
        where('tableId', '==', tableId),
        where('status', 'in', ['scheduled', 'active']),
        where('startTime', '<=', now),
        where('endTime', '>=', now)
      );
  
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking table reservation:', error);
      throw error;
    }
  };
  
  // Check table availability for a specific time slot
  export const checkTableAvailability = async (tableId, startTime, endTime) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const queryStartTime = Timestamp.fromDate(new Date(startTime));
      const queryEndTime = Timestamp.fromDate(new Date(endTime));
  
      // Check for overlapping bookings
      const q = query(
        bookingsRef,
        where('tableId', '==', tableId),
        where('status', 'in', ['scheduled', 'active']),
        where('startTime', '<=', queryEndTime)
      );
  
      const snapshot = await getDocs(q);
      
      // Check if any existing booking overlaps with the requested time slot
      const hasConflict = snapshot.docs.some(doc => {
        const booking = doc.data();
        return booking.endTime.toDate() >= queryStartTime.toDate();
      });
  
      return {
        available: !hasConflict,
        conflictingBookings: hasConflict ? 
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) : []
      };
    } catch (error) {
      console.error('Error checking table availability:', error);
      throw error;
    }
  };
  
  // Get all available tables for a specific time slot
  export const getAvailableTables = async (startTime, endTime) => {
    try {
      // First, get all tables
      const tablesRef = collection(db, 'tables');
      const tablesSnapshot = await getDocs(tablesRef);
      const allTables = tablesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Then check availability for each table
      const availabilityPromises = allTables.map(async table => {
        const { available } = await checkTableAvailability(
          table.id,
          startTime,
          endTime
        );
        return {
          ...table,
          available
        };
      });
  
      const tablesWithAvailability = await Promise.all(availabilityPromises);
      return tablesWithAvailability;
    } catch (error) {
      console.error('Error getting available tables:', error);
      throw error;
    }
  };
  
  // Reserve a table
  export const reserveTable = async (userId, tableId, startTime, endTime) => {
    try {
      // Check if table is available
      const { available } = await checkTableAvailability(tableId, startTime, endTime);
      
      if (!available) {
        throw new Error('Table is not available for the selected time slot');
      }
  
      // Create booking
      const bookingsRef = collection(db, 'bookings');
      const booking = {
        userId,
        tableId,
        startTime: Timestamp.fromDate(new Date(startTime)),
        endTime: Timestamp.fromDate(new Date(endTime)),
        status: 'scheduled',
        createdAt: serverTimestamp(),
        duration: Math.floor((new Date(endTime) - new Date(startTime)) / (60 * 1000)) // in minutes
      };
  
      const bookingDoc = await addDoc(bookingsRef, booking);
  
      // Update table status
      const tableRef = doc(db, 'tables', tableId);
      await updateDoc(tableRef, {
        lastBookingId: bookingDoc.id,
        lastBookedBy: userId,
        lastBookedAt: serverTimestamp()
      });
  
      return bookingDoc.id;
    } catch (error) {
      console.error('Error reserving table:', error);
      throw error;
    }
  };
  
  // Get table current status
  export const getTableStatus = async (tableId) => {
    try {
      const tableRef = doc(db, 'tables', tableId);
      const tableDoc = await getDoc(tableRef);
  
      if (!tableDoc.exists()) {
        throw new Error('Table not found');
      }
  
      const table = tableDoc.data();
  
      // Get current booking if exists
      const now = Timestamp.now();
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('tableId', '==', tableId),
        where('status', 'in', ['scheduled', 'active']),
        where('startTime', '<=', now),
        where('endTime', '>=', now)
      );
  
      const bookingSnapshot = await getDocs(q);
      const currentBooking = bookingSnapshot.empty ? null : {
        id: bookingSnapshot.docs[0].id,
        ...bookingSnapshot.docs[0].data()
      };
  
      return {
        ...table,
        currentBooking,
        isOccupied: !bookingSnapshot.empty,
        currentStatus: currentBooking?.status || 'available'
      };
    } catch (error) {
      console.error('Error getting table status:', error);
      throw error;
    }
  };
  
  // Get upcoming bookings for a table
  export const getTableUpcomingBookings = async (tableId) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const now = Timestamp.now();
  
      const q = query(
        bookingsRef,
        where('tableId', '==', tableId),
        where('status', 'in', ['scheduled', 'active']),
        where('startTime', '>=', now),
        orderBy('startTime', 'asc')
      );
  
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting upcoming bookings:', error);
      throw error;
    }
  };
  
  // Check if user can check in to a table
  export const canCheckInToTable = async (userId, tableId) => {
    try {
      const now = Timestamp.now();
      const bookingsRef = collection(db, 'bookings');
  
      // Check if user has a booking for this table now
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        where('tableId', '==', tableId),
        where('status', '==', 'scheduled'),
        where('startTime', '<=', now),
        where('endTime', '>=', now)
      );
  
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return {
          canCheckIn: false,
          reason: 'No active booking found for this table'
        };
      }
  
      const booking = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
  
      // Check if it's within allowed check-in time (e.g., 15 minutes before booking)
      const bookingStart = booking.startTime.toDate();
      const earliestCheckIn = new Date(bookingStart.getTime() - 15 * 60 * 1000);
      
      return {
        canCheckIn: now.toDate() >= earliestCheckIn,
        booking,
        reason: now.toDate() < earliestCheckIn ? 
          'Too early to check in' : 
          'Ready to check in'
      };
    } catch (error) {
      console.error('Error checking check-in availability:', error);
      throw error;
    }
  };