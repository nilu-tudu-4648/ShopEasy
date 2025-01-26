import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "react-native-image-picker";
import { TextInput } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { UserFormData } from "@/constants/types";
import { userSchema } from "@/constants/schema";
import { Colors } from "react-native-ui-lib";
import AppHeader from "@/components/AppHeader";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AppButton from "@/components/AppButton";
import { useRouter } from "expo-router";
import AppToast from "@/components/AppToast";
Colors.loadColors({
  primary: "#4A6FFF",
  secondary: "#6B8AFF",
  textGrey: "#666666",
  cardBg: "#FFFFFF",
  error: "#FF5252",
});

const membershipPlans = [
  { id: "1", name: "Basic" },
  { id: "2", name: "Premium" },
  { id: "3", name: "Gold" },
];

const UserDetailScreen: React.FC = () => {
  const [showDatePicker, setShowDatePicker] = useState<{
    show: boolean;
    field: "dateOfBirth" | "joinDate" | null;
  }>({ show: false, field: null });
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      status: "active",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: UserFormData) => {
    console.log("Form data:", data);
    try {
      setLoading(true);
      const userRef = doc(collection(db, "users"));
      await setDoc(userRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: userRef.id,
      });
      console.log("User registered successfully");
      AppToast.show('User registered successfully');
      router.push("/UserList");
      // Could add navigation/success message here
    } catch (error) {
      console.error("Error registering user:", error);
      // Could add error handling/display here
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: "photo",
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setValue("profilePhoto", response.assets[0].uri || "");
      }
    });
  };

  const renderDatePicker = (
    field: "dateOfBirth" | "joinDate",
    label: string
  ) => (
    <Controller
      name={field}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          style={[styles.input, errors[field] && styles.errorInput]}
          onPress={() => setShowDatePicker({ show: true, field })}
        >
          <Text style={styles.dateText}>
            {value ? value.toLocaleDateString() : label}
          </Text>
          {showDatePicker.show && showDatePicker.field === field && (
            <DateTimePicker
              value={value || new Date()}
              maximumDate={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker({ show: false, field: null });
                if (selectedDate) {
                  onChange(selectedDate);
                }
              }}
            />
          )}
        </TouchableOpacity>
      )}
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppHeader title="Register New User" />
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.photoButton}
          >
            <Controller
              name="profilePhoto"
              control={control}
              render={({ field: { value } }) => (
                <>
                  {value ? (
                    <Image
                      source={{ uri: value }}
                      style={styles.profilePhoto}
                    />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>Add Photo</Text>
                    </View>
                  )}
                </>
              )}
            />
          </TouchableOpacity>
        </View>

        <Controller
          name="firstName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.firstName && styles.errorInput]}
                placeholder="First Name"
                onChangeText={onChange}
                value={value}
                placeholderTextColor={Colors.textGrey}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.lastName && styles.errorInput]}
                placeholder="Last Name"
                onChangeText={onChange}
                value={value}
                placeholderTextColor={Colors.textGrey}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                placeholder="Email"
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textGrey}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.phone && styles.errorInput]}
                placeholder="Phone Number"
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor={Colors.textGrey}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.addressInput,
                  errors.address && styles.errorInput,
                ]}
                placeholder="Address"
                onChangeText={onChange}
                value={value}
                multiline
                placeholderTextColor={Colors.textGrey}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address.message}</Text>
              )}
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          {renderDatePicker("dateOfBirth", "Date of Birth")}
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          {renderDatePicker("joinDate", "Join Date")}
          {errors.joinDate && (
            <Text style={styles.errorText}>{errors.joinDate.message}</Text>
          )}
        </View>

        <Controller
          name="membershipPlanId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.input,
                  errors.membershipPlanId && styles.errorInput,
                ]}
              >
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item
                    style={{ fontSize: 12 }}
                    label="Select Membership Plan"
                    value=""
                  />
                  {membershipPlans.map((plan) => (
                    <Picker.Item
                      key={plan.id}
                      label={plan.name}
                      value={plan.id}
                      style={{ fontSize: 12 }}
                    />
                  ))}
                </Picker>
              </View>
              {errors.membershipPlanId && (
                <Text style={styles.errorText}>
                  {errors.membershipPlanId.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <View style={[styles.input, errors.status && styles.errorInput]}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item
                    style={{ fontSize: 12 }}
                    label="Active"
                    value="active"
                  />
                  <Picker.Item
                    style={{ fontSize: 12 }}
                    label="Inactive"
                    value="inactive"
                  />
                </Picker>
              </View>
              {errors.status && (
                <Text style={styles.errorText}>{errors.status.message}</Text>
              )}
            </View>
          )}
        />

        <AppButton
          title="Register User"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 16,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  photoPlaceholderText: {
    color: Colors.textGrey,
  },
  inputContainer: {
    marginBottom: 16,
  },
  errorInput: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  dateText: {
    color: "#000",
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    padding: 12,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: Colors.cardBg,
    color: "#000",
    fontSize: 12,
    justifyContent: "center",
  },
  picker: {
    height: 48,
    margin: -8,
  },
  // For address input specifically
  addressInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
});

export default UserDetailScreen;