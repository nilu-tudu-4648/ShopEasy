import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";


const notifications = [
  {
    id: "1",
    title: "Order Shipped",
    description: "Your order #12345 has been shipped and is on its way!",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Special Offer",
    description: "Get 20% off on your next purchase. Use code SAVE20 at checkout.",
    time: "1 day ago",
  },
  {
    id: "3",
    title: "Back in Stock",
    description: "The item you added to your wishlist is back in stock. Don't miss out!",
    time: "2 days ago",
  },
  {
    id: "4",
    title: "Order Delivered",
    description: "Your order #12344 has been delivered. We hope you enjoy your purchase!",
    time: "3 days ago",
  },
];

const NotificationsScreen = () => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Bell size={24} color="#2563EB" />
      </View>
      <View style={styles.notificationDetails}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  notificationDescription: {
    fontSize: 16,
    color: "#64748B",
    marginVertical: 4,
  },
  notificationTime: {
    fontSize: 14,
    color: "#A0AEC0",
  },
});

export default NotificationsScreen;
