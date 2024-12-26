// firebase/helpers.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppToast from "../../components/AppToast";
import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import { setMyVehicles, setUserBookings, setVehicles } from "../../store/reducers/bookingReducer";

// User helpers

export const createBooking = async (userId, bookingData, dispatch) => {
  try {
    // Validate userId exists
    if (!userId) {
      throw new Error("userId is required");
    }

    const bookingRef = collection(db, "userBookings");

    // Validate booking duration
    const duration =
      (bookingData.endTime - bookingData.startTime) / (1000 * 60 * 60); // hours
    if (duration < 8) {
      AppToast.show("Booking duration cannot less than 8 hours");
      return;
    }

    // Convert dates to Firestore Timestamps
    const newBooking = {
      userId,
      ...bookingData,
      startTime: Timestamp.fromDate(new Date(bookingData.startTime)),
      endTime: Timestamp.fromDate(new Date(bookingData.endTime)),
      status: "scheduled",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(bookingRef, newBooking);
    AppToast.show("Booking created successfully");
    getUserBookings(userId, "scheduled").then((bookings) => {
      dispatch(setUserBookings(bookings))
    })
  } catch (error) {
    console.error("Error creating booking:", error);
   
  }
};

export const cancelBooking = async (userId, bookingId, dispatch) => {
  try {
    // Validate userId exists
    if (!userId) {
      throw new Error("userId is required");
    }

    // Validate bookingId exists
    if (!bookingId) {
      throw new Error("bookingId is required");
    }

    const bookingRef = doc(db, "userBookings", bookingId);

    // Get booking to verify ownership
    const bookingDoc = await getDoc(bookingRef);
    if (!bookingDoc.exists()) {
      throw new Error("Booking not found");
    }

    const bookingData = bookingDoc.data();
    if (bookingData.userId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }

    // Update booking status to cancelled
    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelledAt: Timestamp.now(),
    });

    AppToast.show("Booking cancelled successfully");
  } catch (error) {
    console.error("Error cancelling booking:", error);
  } finally {
    getUserBookings(userId, "scheduled").then((bookings) => {
      dispatch(setUserBookings(bookings))
    })
  }
};

export const getAllVehicles = async (dispatch) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const querySnapshot = await getDocs(vehiclesRef);
    
    const vehicles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    dispatch(setVehicles(vehicles));
  } catch (error) {
    console.error("Error getting vehicles:", error);
    throw error;
  }
};

export const getMyVehicles = async (userId, dispatch) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const q = query(vehiclesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const vehicles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    dispatch(setMyVehicles(vehicles));
  } catch (error) {
    console.error("Error getting user vehicles:", error);
    throw error;
  }
};

export const createVehicle = async (vehicleData,func) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    
    // Add timestamps
    const newVehicle = {
      ...vehicleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(vehiclesRef, newVehicle);
    
    // Update with Firebase-generated ID
    await updateDoc(docRef, {
      id: docRef.id
    });

    AppToast.show("Vehicle created successfully");

  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  } finally {
    func();
  }
};

export const updateVehicle = async (vehicleId, updateData) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    
    // Add updated timestamp
    const updates = {
      ...updateData,
      updatedAt: Timestamp.now()
    };

    await updateDoc(vehicleRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId, dispatch) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    await deleteDoc(vehicleRef);
    AppToast.show("Vehicle deleted successfully");
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  } finally {
    getAllVehicles(dispatch);
  }
};

export const getVehicleById = async (vehicleId) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleDoc = await getDoc(vehicleRef);
    
    if (!vehicleDoc.exists()) {
      throw new Error("Vehicle not found");
    }

    return {
      id: vehicleDoc.id,
      ...vehicleDoc.data()
    };
  } catch (error) {
    console.error("Error getting vehicle:", error);
    throw error;
  }
};

export const getUserBookings = async (userId, status = "scheduled") => {
  try {
    const bookingsRef = collection(db, "userBookings");
    const q = query(
      bookingsRef,
      where("userId", "==", userId),
      where("status", "==", status)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user bookings:", error);
    throw error;
  }
};

export const saveBulkVehicles = async (data) => {
  try {
    const batch = writeBatch(db);
    
    data.forEach((vehicle) => {
      const docRef = doc(collection(db, "vehicles")); // Auto-generate ID
      batch.set(docRef, {
        ...vehicle,
        id: docRef.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    });

    await batch.commit();
    console.log('Bulk vehicles data saved successfully');
  } catch (error) {
    console.error('Error saving bulk vehicles data:', error);
  }
};

export const logoutUser = async (router, dispatch) => {
  try {
    await AsyncStorage.removeItem("user");
    dispatch({ type: "RESET" });
    router.push("/(auth)/LoginScreen");
  } catch (error) {
    console.log(error);
  }
};
