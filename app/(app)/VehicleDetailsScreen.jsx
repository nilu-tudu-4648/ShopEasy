import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { Text, Card, Button, DateTimePicker, Image } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { routeNames } from "../../constants/data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const VehicleDetailsScreen = () => {
  const router = useRouter();
  const { vehicle } = useLocalSearchParams();
  const vehicleData = JSON.parse(vehicle);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const vehicleImages = [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
  ];

  const vehicleRating = vehicleData?.rating || "0";
  const vehicleLocation = vehicleData?.location || "Location Not Available";

  const renderImageItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </View>
  );

  const handleBooking = () => {
    try {
      // Combine date and time
      const startDateTime = new Date(startDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
      
      const endDateTime = new Date(endDate);
      endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

      router.push({
        pathname: routeNames.BookingConfirmationScreen,
        params: {
          vehicle: JSON.stringify(vehicleData),
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
        },
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.carouselContainer}>
        <FlatList
          data={vehicleImages}
          renderItem={renderImageItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      <Card style={styles.detailsCard}>
        <View style={styles.header}>
          <Text text40 style={styles.title}>
            {vehicleData?.name}
          </Text>
          <Text text50 style={styles.price}>
          ₹{vehicleData?.price}/day
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text text70>{vehicleRating}</Text>
          <Text text70 style={styles.reviewCount}>
            (32 reviews)
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text text70>{vehicleLocation}</Text>
        </View>

        <Text text70 style={styles.description}>
          This vehicle comes with comprehensive insurance and 24/7 roadside
          assistance. Clean interior and regularly maintained.
        </Text>

        <View style={styles.datePickerContainer}>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text text70 style={styles.dateLabel}>
                Start Date
              </Text>
              <DateTimePicker
                mode="date"
                value={startDate}
                minimumDate={new Date()}
                containerStyle={styles.datePickerStyle}
              />
            </View>
            <View style={styles.dateTimeColumn}>
              <Text text70 style={styles.dateLabel}>
                Start Time
              </Text>
              <DateTimePicker
                mode="time"
                value={startTime}
                onChange={(time) => setStartTime(time)}
                containerStyle={styles.datePickerStyle}
              />
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text text70 style={styles.dateLabel}>
                End Date
              </Text>
              <DateTimePicker
                mode="date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                minimumDate={startDate}
                containerStyle={styles.datePickerStyle}
              />
            </View>
            <View style={styles.dateTimeColumn}>
              <Text text70 style={styles.dateLabel}>
                End Time
              </Text>
              <DateTimePicker
                mode="time"
                value={endTime}
                onChange={(time) => setEndTime(time)}
                containerStyle={styles.datePickerStyle}
              />
            </View>
          </View>
        </View>

        <Button
          label="Book Now"
          backgroundColor="#4169E1"
          style={styles.bookButton}
          onPress={handleBooking}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  carouselContainer: {
    backgroundColor: "#FFF",
    height: 250,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 250,
    resizeMode: "cover",
  },
  detailsCard: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  price: {
    color: "#4169E1",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewCount: {
    marginLeft: 8,
    color: "#666",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    lineHeight: 22,
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateTimeColumn: {
    flex: 1,
    marginRight: 8,
  },
  dateLabel: {
    marginBottom: 8,
  },
  datePickerStyle: {
    marginBottom: 16,
  },
  bookButton: {
    height: 48,
  },
});

export default VehicleDetailsScreen;
