// // Firebase configuration and initialization
// import { initializeApp } from 'firebase/app';
// import { 
//   getFirestore, 
//   collection, 
//   doc, 
//   setDoc, 
//   getDoc, 
//   updateDoc, 
//   query, 
//   where, 
//   getDocs,
//   deleteDoc 
// } from 'firebase/firestore';
// import { 
//   getAuth, 
//   updateProfile 
// } from 'firebase/auth';

// // Initialize Firebase (replace with your config)
// const firebaseConfig = {
//   // Your Firebase configuration object
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// // Vehicle Management Operations
// export const vehicleOperations = {
//   // Register a new vehicle
//   async registerVehicle(vehicleData) {
//     try {
//       const userId = auth.currentUser.uid;
//       const vehicleRef = doc(collection(db, 'vehicles'));
      
//       await setDoc(vehicleRef, {
//         ...vehicleData,
//         ownerId: userId,
//         createdAt: new Date(),
//         status: 'active'
//       });

//       return {
//         success: true,
//         vehicleId: vehicleRef.id,
//         message: 'Vehicle registered successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },

//   // Edit vehicle details
//   async editVehicle(vehicleId, updateData) {
//     try {
//       const vehicleRef = doc(db, 'vehicles', vehicleId);
//       const vehicleSnap = await getDoc(vehicleRef);

//       if (!vehicleSnap.exists()) {
//         throw new Error('Vehicle not found');
//       }

//       if (vehicleSnap.data().ownerId !== auth.currentUser.uid) {
//         throw new Error('Unauthorized to edit this vehicle');
//       }

//       await updateDoc(vehicleRef, {
//         ...updateData,
//         updatedAt: new Date()
//       });

//       return {
//         success: true,
//         message: 'Vehicle updated successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },

//   // Get user's vehicles list
//   async getMyVehicles() {
//     try {
//       const userId = auth.currentUser.uid;
//       const vehiclesQuery = query(
//         collection(db, 'vehicles'),
//         where('ownerId', '==', userId)
//       );

//       const querySnapshot = await getDocs(vehiclesQuery);
//       const vehicles = [];
      
//       querySnapshot.forEach((doc) => {
//         vehicles.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });

//       return {
//         success: true,
//         vehicles
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }
// };

// // Booking System Operations
// export const bookingOperations = {
//   // Search available vehicles
//   async searchVehicles(searchParams) {
//     try {
//       let vehiclesQuery = query(collection(db, 'vehicles'));

//       // Add search filters based on params
//       if (searchParams.type) {
//         vehiclesQuery = query(vehiclesQuery, where('type', '==', searchParams.type));
//       }
//       if (searchParams.location) {
//         vehiclesQuery = query(vehiclesQuery, where('location', '==', searchParams.location));
//       }

//       const querySnapshot = await getDocs(vehiclesQuery);
//       const vehicles = [];

//       querySnapshot.forEach((doc) => {
//         vehicles.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });

//       return {
//         success: true,
//         vehicles
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },

//   // Create a booking
//   async createBooking(vehicleId, bookingDetails) {
//     try {
//       const userId = auth.currentUser.uid;
//       const bookingRef = doc(collection(db, 'bookings'));

//       await setDoc(bookingRef, {
//         vehicleId,
//         userId,
//         ...bookingDetails,
//         status: 'pending',
//         createdAt: new Date()
//       });

//       return {
//         success: true,
//         bookingId: bookingRef.id,
//         message: 'Booking created successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },

//   // Get user's bookings
//   async getMyBookings() {
//     try {
//       const userId = auth.currentUser.uid;
//       const bookingsQuery = query(
//         collection(db, 'bookings'),
//         where('userId', '==', userId)
//       );

//       const querySnapshot = await getDocs(bookingsQuery);
//       const bookings = [];

//       querySnapshot.forEach((doc) => {
//         bookings.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });

//       return {
//         success: true,
//         bookings
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }
// };

// // User Profile Operations
// export const userOperations = {
//   // Get user profile
//   async getUserProfile() {
//     try {
//       const userId = auth.currentUser.uid;
//       const userDoc = await getDoc(doc(db, 'users', userId));

//       if (!userDoc.exists()) {
//         throw new Error('User profile not found');
//       }

//       return {
//         success: true,
//         profile: userDoc.data()
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },

//   // Update user profile
//   async updateUserProfile(profileData) {
//     try {
//       const userId = auth.currentUser.uid;
//       const userRef = doc(db, 'users', userId);

//       await updateDoc(userRef, {
//         ...profileData,
//         updatedAt: new Date()
//       });

//       // Update display name if provided
//       if (profileData.displayName) {
//         await updateProfile(auth.currentUser, {
//           displayName: profileData.displayName
//         });
//       }

//       return {
//         success: true,
//         message: 'Profile updated successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }
// };