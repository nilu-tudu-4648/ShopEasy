import { StyleSheet, TextInput, View, Pressable } from "react-native";
import React, { useState } from "react";
import { fontSize12, fontSize14, lignHeight20, screenHeight, Size8, SIZES } from "@/constants/Sizes";
// import { COLORS } from "@/constants/AppColors";
import { ThemedText } from "@/components/ThemedText"; 
import Entypo from "@expo/vector-icons/Entypo";
const AppTextInput = ({
  label = "",
  value,
  onChangeText,
  placeholder = "",
  secureTextEntry = false,
  keyboardType = "default",
  returnKeyType = "done",
  inputStyle,
  labelStyle,
  placeholderTextColor = 'gray',
  style,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry); // Local state to manage visibility toggle

  return (
    <View style={styles.fieldGroup}>
      {label && (
        <ThemedText
          type="p"
          style={{
            lineHeight: lignHeight20,
            // color: COLORS.black2,
            fontFamily: "Inter-Medium",
            ...labelStyle,
          }}
        >
          {label}
        </ThemedText>
      )}
      <View style={[styles.inputContainer,style]}>
        <TextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          returnKeyType={returnKeyType}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          style={[
            styles.textInput,
            {
              fontFamily: "Inter-Regular",
            },
            inputStyle,
          ]}
          {...props}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsSecure(!isSecure)} // Toggle secure text entry
            style={styles.eyeIconContainer}
          >
            <Entypo
              name={`${isSecure ? "eye" : "eye-with-line"}`}
              size={SIZES.h4}
              color="black"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 10,
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    borderWidth: 1,
    // borderColor: COLORS.gray3,
    borderRadius: Size8,
  
    height: screenHeight("6%"),
    paddingRight: Size8,
  },
  textInput: {
    flex: 1, 
    paddingLeft:Size8,
    fontSize:fontSize14,
  },
  eyeIconContainer: {
    paddingHorizontal: 5, 
  },
});
