import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Edit3, MapPin, Package, Settings, LogOut } from "lucide-react-native";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch(setUser(null));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit3 size={16} color="#2563EB" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem}>
          <MapPin size={24} color="#2563EB" />
          <Text style={styles.menuText}>My Addresses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Package size={24} color="#2563EB" />
          <Text style={styles.menuText}>Order History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={24} color="#2563EB" />
          <Text style={styles.menuText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={24} color="#F56565" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
  },
  profileEmail: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  editButtonText: {
    fontSize: 14,
    color: "#2563EB",
    marginLeft: 5,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuText: {
    fontSize: 18,
    color: "#334155",
    marginLeft: 12,
  },
  logoutText: {
    color: "#F56565",
  },
});

export default ProfileScreen;
