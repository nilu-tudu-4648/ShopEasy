import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

// Sample data for orders
const orders = [
  {
    id: "1",
    date: "2024-10-24",
    status: "Delivered",
    totalAmount: 49.99,
  },
  {
    id: "2",
    date: "2024-10-18",
    status: "In Transit",
    totalAmount: 99.99,
  },
  {
    id: "3",
    date: "2024-10-12",
    status: "Cancelled",
    totalAmount: 29.99,
  },
  {
    id: "4",
    date: "2024-10-05",
    status: "Delivered",
    totalAmount: 19.99,
  },
];

const OrdersScreen = ({ navigation }) => {
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate("OrderDetailsScreen", { orderId: item.id })}
    >
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>Order Date: {item.date}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
      </View>
      <Text style={styles.orderAmount}>${item.totalAmount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
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
  orderItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderInfo: {
    flex: 1,
  },
  orderDate: {
    fontSize: 16,
    color: "#64748B",
  },
  orderStatus: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "bold",
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
  },
});

export default OrdersScreen;
