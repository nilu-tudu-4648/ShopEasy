import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { categories } from "../../constants/data";


const CategoriesScreen = ({ navigation }) => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate("CategoryDetail", { categoryId: item.id, categoryName: item.name })}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse Categories</Text>
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 4,
  },
  categoryImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
});

export default CategoriesScreen;
