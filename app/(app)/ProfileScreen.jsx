import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  Text,
  Card,
  Avatar,
  TextField,
  Button,
  ListItem,
} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../firebase/helpers";
import { routeNames } from "../../constants/data";

const ProfileScreen = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const [profileData, setProfileData] = useState(loggedUser);
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState({ ...profileData });

  const menuItems = [
    ...(loggedUser?.admin
      ? [
          {
            icon: "car-outline",
            title: "My Vehicles",
            onPress: () => router.push(routeNames.MyVehiclesScreen),
          },
        ]
      : []),
    {
      icon: "card-outline",
      title: "Payment Methods",
      onPress: () => router.push("/payment-methods"),
    },
    {
      icon: "shield-checkmark-outline",
      title: "Privacy Settings",
      onPress: () => router.push("/privacy-settings"),
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => router.push("/help-support"),
    },
  ];

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const renderListItem = ({ icon, title, onPress }) => (
    <ListItem
      key={title}
      onPress={onPress}
      height={60}
      containerStyle={styles.listItem}
    >
      <ListItem.Part left>
        <Ionicons
          name={icon}
          size={24}
          color="#4169E1"
          style={styles.listIcon}
        />
      </ListItem.Part>
      <ListItem.Part middle>
        <Text text70>{title}</Text>
      </ListItem.Part>
      <ListItem.Part right>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </ListItem.Part>
    </ListItem>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={{ uri: "https://via.placeholder.com/150" }}
            size={80}
          />
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextField
              placeholder="Full Name"
              value={editedData.name}
              onChangeText={(text) =>
                setEditedData({ ...editedData, name: text })
              }
              style={styles.input}
            />
            <TextField
              placeholder="Email"
              value={editedData.email}
              onChangeText={(text) =>
                setEditedData({ ...editedData, email: text })
              }
              keyboardType="email-address"
              style={styles.input}
            />
            <TextField
              placeholder="Phone"
              value={editedData.phone}
              onChangeText={(text) =>
                setEditedData({ ...editedData, phone: text })
              }
              keyboardType="phone-pad"
              style={styles.input}
            />
            <View style={styles.buttonRow}>
              <Button
                label="Cancel"
                outline
                outlineColor="#666"
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setEditedData({ ...profileData });
                  setIsEditing(false);
                }}
              />
              <Button
                label="Save"
                backgroundColor="#4169E1"
                style={styles.button}
                onPress={handleSave}
              />
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text text50 style={styles.name}>
              {profileData.name}
            </Text>
            <Text text70 style={styles.detail}>
              {profileData.email}
            </Text>
            <Text text70 style={styles.detail}>
              {profileData.phone}
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.settingsCard}>
        <View style={styles.settingsHeader}>
          <Text text60 style={styles.settingsTitle}>
            Settings
          </Text>
        </View>

        <View style={styles.notificationSetting}>
          <Text text70>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#D1D1D1", true: "#4169E1" }}
          />
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          {menuItems.map(renderListItem)}
        </View>
      </Card>

      <Button
        label="Sign Out"
        outline
        outlineColor="#FF4444"
        style={styles.signOutButton}
        onPress={() => logoutUser(router, dispatch)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  profileCard: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    color: "#4169E1",
    fontSize: 14,
  },
  profileInfo: {
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  detail: {
    color: "#666",
    marginBottom: 4,
  },
  editForm: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 10,
  },
  settingsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingsTitle: {
    fontWeight: "bold",
  },
  notificationSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  listItem: {
    height: 60,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "red",
  },
  listIcon: {
    marginRight: 16,
  },
  signOutButton: {
    margin: 16,
    marginTop: 0,
    height: 48,
  },
});

export default ProfileScreen;
