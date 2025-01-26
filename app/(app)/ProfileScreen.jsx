import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Edit3, MapPin, Package, Settings, LogOut, Clock, CalendarDays } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch(setUser(null));
      router.replace("/(auth)/LoginScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
if (!loggedUser) {
  return <Text>Loading...</Text>;
}
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{loggedUser.user?.firstName} {loggedUser.user?.lastName}</Text>
          <Text style={styles.profileEmail}>{loggedUser.user?.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{loggedUser.user?.visits}</Text>
              <Text style={styles.statLabel}>Total Visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.floor(loggedUser.user?.totalStudyTime/60)}h</Text>
              <Text style={styles.statLabel}>Study Time</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/stacks/StudyHistory')}>
            <View style={[styles.quickActionIcon, { backgroundColor: "#4A6FFF20" }]}>
              <Clock size={24} color="#4A6FFF" />
            </View>
            <Text style={styles.quickActionText}>Study History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: "#4CAF5020" }]}>
              <CalendarDays size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: "#4A6FFF10" }]}>
              <MapPin size={24} color="#4A6FFF" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>My Addresses</Text>
              <Text style={styles.menuSubtext}>Manage your addresses</Text>
            </View>
          </TouchableOpacity>

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