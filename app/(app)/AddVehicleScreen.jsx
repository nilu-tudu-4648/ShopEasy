import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createVehicle, getAllVehicles } from "../firebase/helpers";
import { useDispatch, useSelector } from "react-redux";
import { routeNames } from "../../constants/data";
import { useRouter } from "expo-router";
import AppToast from "../../components/AppToast";

export default function AddVehicleScreen() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState({
    name: "",
    price: "",
    location: "",
    features: ["", "", ""],
    description: "",
    images: [],
    userId: "",
  });

  const dispatch = useDispatch();
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setVehicleData((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!vehicleData.name || !vehicleData.price || !vehicleData.location) {
        AppToast.show('Please fill in all required fields');
        return;
      }

      const func = () => {
        getAllVehicles(dispatch);
        router.push(routeNames.MyVehiclesScreen);
      };

      await createVehicle({ 
        ...vehicleData,
        userId: loggedUser.uid,
        rating: 0,
        status: 'available'
      }, func);

    } catch (error) {
      console.error('Error creating vehicle:', error);
      AppToast.show('Failed to create vehicle');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Images</Text>
        <ScrollView horizontal style={styles.imageContainer}>
          {vehicleData.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.vehicleImage} />
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Ionicons name="add" size={40} color="#4169E1" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Name"
          value={vehicleData.name}
          onChangeText={(text) =>
            setVehicleData((prev) => ({ ...prev, name: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Price per Day"
          keyboardType="numeric"
          value={vehicleData.price}
          onChangeText={(text) =>
            setVehicleData((prev) => ({ ...prev, price: text }))
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={vehicleData.location}
          onChangeText={(text) =>
            setVehicleData((prev) => ({ ...prev, location: text }))
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {vehicleData.features.map((feature, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Feature ${index + 1}`}
            value={feature}
            onChangeText={(text) => {
              const newFeatures = [...vehicleData.features];
              newFeatures[index] = text;
              setVehicleData((prev) => ({ ...prev, features: newFeatures }));
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Vehicle Description"
          multiline
          numberOfLines={4}
          value={vehicleData.description}
          onChangeText={(text) =>
            setVehicleData((prev) => ({ ...prev, description: text }))
          }
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  vehicleImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  addImageButton: {
    width: 200,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#4169E1",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4169E1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
