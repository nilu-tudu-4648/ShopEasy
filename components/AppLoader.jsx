// AppLoader.jsx
import React from "react";
import { View, ActivityIndicator } from "react-native";

const AppLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4169E1" />
    </View>
  );
};

export default AppLoader;
