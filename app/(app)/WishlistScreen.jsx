import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

// Sample data for wishlist items
const wishlistItems = [
  {
    id: "1",
    title: "Wireless Headphones",
    price: "$99",
    image: "https://example.com/headphones.jpg",
  },
  {
    id: "2",
    title: "Smart Watch",
    price: "$199",
    image: "https://example.com/smartwatch.jpg",
  },
  {
    id: "3",
    title: "Running Shoes",
    price: "$79",
    image: "https://example.com/shoes.jpg",
  },
];

const WishlistScreen = ({ navigation }) => {
  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromWishlist(item.id)}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const addToCart = (item) => {
    // Logic to add the item to the cart
    console.log("Added to cart:", item.title);
  };

  const removeFromWishlist = (id) => {
    // Logic to remove the item from the wishlist
    console.log("Removed from wishlist:", id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wishlist</Text>
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        renderItem={renderWishlistItem}
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
  wishlistItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  itemPrice: {
    fontSize: 16,
    color: "#64748B",
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  addToCartButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButton: {
    backgroundColor: "#E11D48",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default WishlistScreen;
