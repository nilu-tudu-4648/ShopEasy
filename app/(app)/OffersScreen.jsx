import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

// Sample data for offers
const offers = [
  {
    id: "1",
    title: "10% Off on First Purchase",
    description: "Get a 10% discount on your first order. Use code: FIRST10",
    image: "https://example.com/offer1.jpg",
  },
  {
    id: "2",
    title: "Buy 1 Get 1 Free",
    description: "Enjoy a Buy 1 Get 1 Free offer on selected items.",
    image: "https://example.com/offer2.jpg",
  },
  {
    id: "3",
    title: "Free Shipping on Orders Above $50",
    description: "Get free shipping on all orders above $50.",
    image: "https://example.com/offer3.jpg",
  },
  {
    id: "4",
    title: "20% Off on Electronics",
    description: "Avail a 20% discount on all electronic items.",
    image: "https://example.com/offer4.jpg",
  },
];

const OffersScreen = () => {
  const renderOfferItem = ({ item }) => (
    <TouchableOpacity style={styles.offerItem}>
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerDetails}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Offers</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
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
  offerItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  offerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  offerDetails: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  offerDescription: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
});

export default OffersScreen;
