import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Edit3, MapPin, Settings, LogOut, Clock, CalendarDays, Users, Building2 } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "../firebase/firebaseConfig";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch(setUser(null));
      router.replace("/(auth)/LoginScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error selecting image");
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = `profile_${loggedUser.user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `profile_images/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile in Firestore
      const userRef = doc(db, "users", loggedUser.user.uid);
      await updateDoc(userRef, {
        profileImage: downloadURL
      });

      // Update Redux state
      dispatch(setUser({
        ...loggedUser,
        user: {
          ...loggedUser.user,
          profileImage: downloadURL
        }
      }));

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };
  
  if (!loggedUser) {
    return <Text>Loading...</Text>;
  }

  const isAdmin = loggedUser.user?.userType === 'admin';

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: loggedUser.user?.profileImage || "https://via.placeholder.com/100"
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={[styles.editImageButton]}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Edit3 size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{loggedUser.user?.name}</Text>
          <Text style={styles.profileEmail}>{loggedUser.user?.email}</Text>
          <View style={styles.statsContainer}>
            {isAdmin ? (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4</Text>
                  <Text style={styles.statLabel}>Locations</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{loggedUser.user?.visits}</Text>
                  <Text style={styles.statLabel}>Total Visits</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{Math.floor(loggedUser.user?.totalStudyTime/60)}h</Text>
                  <Text style={styles.statLabel}>Study Time</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {isAdmin ? (
            <>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/Allusers')}>
                <View style={[styles.quickActionIcon]}>
                  <Users size={24} color="#4A6FFF" />
                </View>
                <Text style={styles.quickActionText}>Manage Users</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/admin/Locations')}>
                <View style={[styles.quickActionIcon]}>
                  <Building2 size={24} color="#4A6FFF" />
                </View>
                <Text style={styles.quickActionText}>Locations</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/stacks/StudyHistory')}>
                <View style={[styles.quickActionIcon]}>
                  <Clock size={24} color="#4A6FFF" />
                </View>
                <Text style={styles.quickActionText}>Study History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <View style={[styles.quickActionIcon]}>
                  <CalendarDays size={24} color="#4CAF50" />
                </View>
                <Text style={styles.quickActionText}>Schedule</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuItems}>
          {!isAdmin && (
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "#4A6FFF10" }]}>
                <MapPin size={24} color="#4A6FFF" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>My Addresses</Text>
                <Text style={styles.menuSubtext}>Manage your addresses</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#4A6FFF10" }]}>
              <Settings size={24} color="#4A6FFF" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Account Settings</Text>
              <Text style={styles.menuSubtext}>Privacy and security</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#FF525210" }]}>
              <LogOut size={24} color="#FF5252" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              <Text style={styles.menuSubtext}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
  },
  editImageButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#4A6FFF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  adminEditButton: {
    backgroundColor: "#FF6B6B",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: "#1A1A1A10",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  menuItems: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#1A1A1A10",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
    color: "#64748B",
  },
  logoutButton: {
    marginTop: 12,
  },
  logoutText: {
    color: "#FF5252",
  },
});

export default ProfileScreen;