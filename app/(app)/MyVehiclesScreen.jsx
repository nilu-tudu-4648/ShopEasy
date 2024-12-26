// TODO: Implement MyVehiclesScreen
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVehicle,
  getMyVehicles,
  updateVehicle,
} from "../firebase/helpers";
import { routeNames } from "../../constants/data";
import { Dialog, TextField, Button } from "react-native-ui-lib";
import AppLoader from "../../components/AppLoader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

const MyVehiclesScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { myVehicles } = useSelector((state) => state.entities.bookingReducer);
  const loggedUser = useSelector(
    (state) => state.entities.authReducer.loggedUser
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVehicles(loggedUser.uid, dispatch);
    setLoading(false);
  }, []);

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditedName(vehicle.name);
    setEditedLocation(vehicle.location);
    setEditedPrice(vehicle.price.toString());
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedVehicle) return;

      const updatedData = {
        name: editedName,
        location: editedLocation,
        price: parseFloat(editedPrice),
      };

      await updateVehicle(selectedVehicle.id, updatedData, dispatch);
      setShowEditDialog(false);
      getMyVehicles(loggedUser.uid, dispatch); // Refresh the list
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert("Error", "Failed to update vehicle details");
    }
  };

  const handleDelete = (vehicleId) => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              deleteVehicle(vehicleId, dispatch);
            } catch (error) {
              console.error("Error deleting vehicle:", error);
            }
          },
        },
      ]
    );
  };

  const renderVehicleItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/400x200" }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <Text style={styles.priceText}>₹{item.price}/day</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={48} color="#666" />
      <Text style={styles.emptyText}>No vehicles found</Text>
      <Text style={styles.emptySubtext}>
        Add your first vehicle to get started
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <AppLoader />
      ) : (
        <>
          <FlatList
            data={myVehicles}
            renderItem={renderVehicleItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyList}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push(routeNames.AddVehicleScreen)}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <Dialog
        visible={showEditDialog}
        onDismiss={() => setShowEditDialog(false)}
        containerStyle={styles.dialog}
      >
        <View>
          <Text style={styles.dialogTitle}>Edit Vehicle</Text>

          <TextField
            placeholder="Vehicle Name"
            value={editedName}
            onChangeText={setEditedName}
            style={styles.input}
          />

          <TextField
            placeholder="Location"
            value={editedLocation}
            onChangeText={setEditedLocation}
            style={styles.input}
          />

          <TextField
            placeholder="Price per day"
            value={editedPrice}
            onChangeText={setEditedPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.dialogButtons}>
            <Button
              label="Cancel"
              outline
              onPress={() => setShowEditDialog(false)}
              style={styles.dialogButton}
            />
            <Button
              label="Save"
              onPress={handleSaveEdit}
              style={styles.dialogButton}
            />
          </View>
        </View>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContainer: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: CARD_WIDTH,
  },
  vehicleImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169E1",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  editButton: {
    backgroundColor: "#4169E1",
  },
  deleteButton: {
    backgroundColor: "#FF4444",
  },
  buttonText: {
    color: "#FFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4169E1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  dialog: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dialogButton: {
    minWidth: 120,
  },
});

export default MyVehiclesScreen;
