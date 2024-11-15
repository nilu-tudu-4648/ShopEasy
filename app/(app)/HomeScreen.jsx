import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";
import { categories } from "../../constants/data";


const featuredProducts = [
  {
    id: "1",
    name: "Smartphone",
    price: "$299",
    image: { uri: "https://example.com/images/smartphone.png" },
  },
  {
    id: "2",
    name: "Headphones",
    price: "$99",
    image: { uri: "https://example.com/images/headphones.png" },
  },
  {
    id: "3",
    name: "Sneakers",
    price: "$150",
    image: { uri: "https://example.com/images/sneakers.png" },
  },
];

const HomeScreen = () => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Image
        source={item.image}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#64748B" />
        <TextInput placeholder="Search products" style={styles.searchInput} />
      </View>

      {/* Banner Carousel (Static images as placeholder) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bannerContainer}
      >
        {[1, 1, 1, 1, 1].map((ite, i) => (
          <Image
            key={i}
            source={require("../../assets/categories/fashion.jpg")}
            style={styles.bannerImage}
          />
        ))}
      </ScrollView>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.categoryList}
      />

      {/* Featured Products */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={featuredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.productList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 10,
  },
  categoryList: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: "#64748B",
  },
  productList: {
    paddingVertical: 10,
  },
  productCard: {
    width: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
  },
});

export default HomeScreen;
