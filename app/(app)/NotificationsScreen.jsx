import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native-ui-lib';

const notifications = [
  {
    id: "1", 
    title: "Hours Updated",
    description: "Your study hours have been updated. You have 10 hours remaining this month.",
    time: "2 hours ago",
    icon: "clock-outline"
  },
  {
    id: "2",
    title: "Plan Expiring Soon",
    description: "Your current study plan expires in 5 days. Renew now to continue studying!",
    time: "1 day ago",
    icon: "calendar-alert"
  },
  {
    id: "3",
    title: "New Location Added",
    description: "A new study location is now available near you. Check it out!",
    time: "2 days ago",
    icon: "map-marker-plus"
  },
  {
    id: "4",
    title: "Study Milestone",
    description: "Congratulations! You've completed 50 hours of study time.",
    time: "3 days ago",
    icon: "trophy-outline"
  },
];

const NotificationsScreen = () => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
        <Icon name={item.icon} size={24} color={Colors.primary} />
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
    backgroundColor: Colors.backgroundGrey,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textGrey,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: Colors.cardBg,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: "#A0AEC0",
  },
});

export default NotificationsScreen;
