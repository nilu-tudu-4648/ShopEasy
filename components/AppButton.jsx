import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Colors } from "react-native-ui-lib";

const AppButton = ({ title, onPress, style = {}, textStyle = {}, loading}) => {
  return (
    <TouchableOpacity 
      style={[styles.submitButton, style]} 
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.submitButtonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  submitButtonText: {
    color: "#fff", 
    fontSize: 16,
    fontWeight: "600",
  },
});
