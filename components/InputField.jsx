import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const InputField = ({showPassword,setShowPassword, label, icon, secureTextEntry,error, ...props }, ref) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        error && styles.inputError
      ]}>
        <Ionicons
          name={icon}
          size={Math.min(width * 0.05, 20)}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={Math.min(width * 0.05, 20)}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({

  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: "500",
    color: "#000",
    marginBottom: height * 0.01,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: Math.min(width * 0.03, 12),
    paddingHorizontal: width * 0.04,
    height: Math.min(height * 0.07, 56),
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: Math.min(width * 0.04, 16),
    color: "#000",
  },
  eyeIcon: {
    padding: width * 0.02,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    paddingRight: width * 0.05,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF5252",
  },
  inputTextError: {
    color: "#FF5252",
  },
  errorText: {
    color: "#FF5252",
    fontSize: Math.min(width * 0.03, 12),
    marginTop: 4,
    marginLeft: 4,
  },
  checkboxError: {
    borderColor: "#FF5252",
  },
});
