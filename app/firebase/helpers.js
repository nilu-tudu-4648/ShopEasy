// firebase/helpers.js
import { db } from './firebaseConfig';
import { 
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc
} from 'firebase/firestore';

// User helpers
export const updateUserSchedulePreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'schedulePreferences': preferences,
      'updatedAt': Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating schedule preferences:', error);
    throw error;
  }
};

export const createBooking = async (userId, bookingData) => {
  try {
    const bookingRef = collection(db, 'bookings');
    
    // Validate booking duration
    const duration = (bookingData.endTime - bookingData.startTime) / (60 * 1000); // minutes
    if (duration < 240 || duration > 480) { // 4-8 hours
      throw new Error('Booking duration must be between 4 and 8 hours');
    }

    const newBooking = {
      userId,
      ...bookingData,
      status: 'scheduled',
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(bookingRef, newBooking);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId, status = 'scheduled') => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      where('status', '==', status)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

export const checkInUser = async (userId, bookingId, tableId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const userRef = doc(db, 'users', userId);
    
    const now = Timestamp.now();
    
    // Update booking
    await updateDoc(bookingRef, {
      status: 'active',
      checkInTime: now,
      tableId
    });
    
    // Update user
    await updateDoc(userRef, {
      'currentSchedule': {
        isCheckedIn: true,
        checkInTime: now,
        tableId,
        bookingId
      },
      'visits': increment(1)
    });
    
    return true;
  } catch (error) {
    console.error('Error checking in user:', error);
    throw error;
  }
};

export const checkOutUser = async (userId, bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const userRef = doc(db, 'users', userId);
    
    const now = Timestamp.now();
    
    // Get booking data to calculate duration
    const bookingDoc = await getDoc(bookingRef);
    const booking = bookingDoc.data();
    
    const actualDuration = Math.floor(
      (now.toMillis() - booking.checkInTime.toMillis()) / (60 * 1000)
    );
    
    // Update booking
    await updateDoc(bookingRef, {
      status: 'completed',
      checkOutTime: now,
      actualDuration
    });
    
    // Update user
    await updateDoc(userRef, {
      'currentSchedule': null,
      'totalStudyTime': increment(actualDuration)
    });
    
    return actualDuration;
  } catch (error) {
    console.error('Error checking out user:', error);
    throw error;
  }
};

// Utility function to get available time slots
export const getAvailableTimeSlots = async (date, tableId) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const q = query(
      bookingsRef,
      where('tableId', '==', tableId),
      where('date', '>=', Timestamp.fromDate(dayStart)),
      where('date', '<=', Timestamp.fromDate(dayEnd)),
      where('status', 'in', ['scheduled', 'active'])
    );
    
    const querySnapshot = await getDocs(q);
    const existingBookings = querySnapshot.docs.map(doc => doc.data());
    
    // Calculate available slots (considering 4-8 hour blocks)
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    
    for (let hour = startHour; hour <= endHour - 4; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = booking.startTime.toDate();
        const bookingEnd = booking.endTime.toDate();
        return !(slotStart >= bookingEnd || 
                (new Date(slotStart.getTime() + 4 * 60 * 60 * 1000)) <= bookingStart);
      });
      
      if (!hasConflict) {
        slots.push({
          startTime: slotStart,
          maxEndTime: new Date(Math.min(
            slotStart.getTime() + 8 * 60 * 60 * 1000, // 8 hours max
            new Date(date).setHours(endHour, 0, 0, 0) // or end of day
          ))
        });
      }
    }
    
    return slots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
};