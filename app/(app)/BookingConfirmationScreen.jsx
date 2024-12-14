// screens/BookingConfirmationScreen.js
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
} from 'react-native-ui-lib';
import { routeNames } from '../../constants/data';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { vehicle, startDate, endDate } = useLocalSearchParams();
  const vehicleData = JSON.parse(vehicle);
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const numberOfDays = Math.max(1, Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)));
  const totalPrice = parseFloat(vehicleData.price) * numberOfDays;
  const router = useRouter();
  const handleConfirm = () => {
    // Add booking to user's bookings
    router.push(routeNames.MyBookingsScreen);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.confirmationCard}>
        <Text text40 style={styles.title}>Booking Summary</Text>

        <View style={styles.detailRow}>
          <Text text70>Vehicle</Text>
          <Text text70 style={styles.boldText}>{vehicleData.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text text70>Start Date</Text>
          <Text text70>{new Date(startDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text text70>End Date</Text>
          <Text text70>{new Date(endDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text text70>Duration</Text>
          <Text text70>{numberOfDays} days</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text text60>Daily Rate</Text>
          <Text text60>${vehicleData.price}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text text50 style={styles.totalText}>Total</Text>
          <Text text50 style={styles.totalPrice}>${totalPrice}</Text>
        </View>

        <Button
          label="Confirm Booking"
          backgroundColor="#4169E1"
          style={styles.confirmButton}
          onPress={handleConfirm}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  confirmationCard: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
  },
  title: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#4169E1',
    fontWeight: 'bold',
  },
  confirmButton: {
    height: 48,
    marginTop: 24,
  },
});

export default BookingConfirmationScreen;