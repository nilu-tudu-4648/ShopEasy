import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import {
  View,
  Text,
  Card,
  Colors,
  TextField,
  Button,
  Picker,
} from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { Pen, Search, Filter, UserPlus, X } from "lucide-react-native";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

Colors.loadColors({
  primary: "#4A6FFF",
  secondary: "#6B8AFF",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#FF5252",
  textGrey: "#666666",
  modalBackground: "rgba(0,0,0,0.5)",
  inputBackground: "#F8F9FA",
  borderColor: "#E9ECEF",
});

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });

      setUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, "users", editedUser.id);
      await updateDoc(userRef, {
        name: editedUser.name,
        email: editedUser.email,
        userType: editedUser.userType,
        phone: editedUser.phone || "",
        isActive: editedUser.isActive,
        visits: editedUser.visits || 0,
        totalStudyTime: editedUser.totalStudyTime || 0,
        plan: {
          ...editedUser.plan,
          name: editedUser.plan?.name,
          price: editedUser.plan?.price,
          hoursTotal: editedUser.plan?.hoursTotal,
          hoursUsed: editedUser.plan?.hoursUsed || 0,
          status: editedUser.plan?.status,
          autoRenew: editedUser.plan?.autoRenew
        },
        usage: {
          ...editedUser.usage,
          currentMonthHours: editedUser.usage?.currentMonthHours || 0,
          totalHours: editedUser.usage?.totalHours || 0,
          averageSessionLength: editedUser.usage?.averageSessionLength || 0
        }
      });

      setUsers(
        users.map((user) => (user.id === editedUser.id ? editedUser : user))
      );

      setIsEditModalVisible(false);
      Alert.alert("Success", "User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
      Alert.alert("Success", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && user.userType === filterType;
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage and monitor user accounts
        </Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textGrey} />
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === "all" && styles.activeFilterTab,
          ]}
          onPress={() => setFilterType("all")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === "user" && styles.activeFilterTab,
          ]}
          onPress={() => setFilterType("user")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "user" && styles.activeFilterText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterType === "admin" && styles.activeFilterTab,
          ]}
          onPress={() => setFilterType("admin")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "admin" && styles.activeFilterText,
            ]}
          >
            Admins
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.userList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>
                    {user.name?.[0]?.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDetail}>
                    Phone: {user.phone || "N/A"}
                  </Text>
                  <Text style={styles.userDetail}>
                    Status: {user.isActive ? "Active" : "Inactive"}
                  </Text>
                  <Text style={styles.userDetail}>
                    Total Visits: {user.visits || 0}
                  </Text>
                  <Text style={styles.userDetail}>
                    Study Time: {user.totalStudyTime || 0} hrs
                  </Text>
                  <Text style={styles.userDetail}>
                    Plan: {user.plan?.name || "No Plan"}
                  </Text>
                  <Text style={styles.userDetail}>
                    Hours Used: {user.plan?.hoursUsed || 0}/{user.plan?.hoursTotal || 0}
                  </Text>
                  <View style={styles.userTypeContainer}>
                    <Text style={styles.userType}>{user.userType}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditUser(user)}
                    >
                      <Pen size={16} color={Colors.primary} />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteUser(user.id)}
                    >
                      <X size={16} color={Colors.error} />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>

            <TextField
              label="Name"
              value={editedUser.name}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, name: text })
              }
              style={styles.input}
            />

            <TextField
              label="Email"
              value={editedUser.email}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, email: text })
              }
              style={styles.input}
            />

            <TextField
              label="Phone"
              value={editedUser.phone}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, phone: text })
              }
              style={styles.input}
            />

            <Picker
              label="User Type"
              value={editedUser.userType}
              onChange={(value) => setEditedUser({...editedUser, userType: value})}
              style={styles.input}
            >
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Student" value="student" />
            </Picker>

            <TextField
              label="Plan Name"
              value={editedUser.plan?.name}
              onChangeText={(text) =>
                setEditedUser({ 
                  ...editedUser, 
                  plan: {...editedUser.plan, name: text}
                })
              }
              style={styles.input}
            />

            <TextField
              label="Total Hours"
              value={String(editedUser.plan?.hoursTotal || '')}
              onChangeText={(text) =>
                setEditedUser({ 
                  ...editedUser, 
                  plan: {...editedUser.plan, hoursTotal: Number(text)}
                })
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button
                label="Cancel"
                outline
                outlineColor={Colors.error}
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                label="Save"
                backgroundColor={Colors.primary}
                onPress={handleUpdateUser}
                style={styles.modalButton}
              />
            </View>
          </View>
        </BlurView>
      </Modal>

      <TouchableOpacity style={styles.fab}>
        <UserPlus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textGrey,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  userList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 4,
  },
  userTypeContainer: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  userType: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.modalBackground,
  },
  modalContent: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    minWidth: 100,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textGrey,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textGrey,
  },
});
