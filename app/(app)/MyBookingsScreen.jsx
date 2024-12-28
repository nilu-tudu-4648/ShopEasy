import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Text, Card, Button } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../constants/helperFunc";
import { cancelBooking, getUserBookings } from "../firebase/helpers";
import { setUserBookings } from "../../store/reducers/bookingReducer";

const MyBookingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const { userBookings } = useSelector(
    (state) => state.entities.bookingReducer
  );
  const dispatch = useDispatch();

  const renderBookingCard = ({ item }) => (
    <Card style={styles.bookingCard}>
      <Image 
        source={{ uri: item.vehicleImage || 'https://via.placeholder.com/400x200' }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />

      <Text text60 style={styles.vehicleName}>
        {item.vehicleName}
      </Text>

      <View style={styles.dateRow}>
        <View style={styles.dateBlock}>
          <Text text70 style={styles.dateLabel}>
            Start Date & Time
          </Text>
          <Text text70 style={styles.dateText}>
            {formatTime.formatDateTime(item.startTime)}
          </Text>
        </View>

        <View style={styles.dateBlock}>
          <Text text70 style={styles.dateLabel}>
            End Date & Time
          </Text>
          <Text text70 style={styles.dateText}>
            {formatTime.formatDateTime(item.endTime)}
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text text70 style={styles.priceLabel}>Total Price</Text>
        <Text text60 style={styles.price}>
          ₹{item.totalPrice}
        </Text>
      </View>

      {item.status === "scheduled" && (
        <Button
          label="Cancel Booking"
          outline
          onPress={() => cancelBooking(item.userId, item.id, dispatch)}
          outlineColor="#FF4444"
          style={styles.cancelButton}
          labelStyle={styles.cancelButtonLabel}
        />
      )}
    </Card>
  );

  useEffect(() => {
    const fetchBookings = async () => {
      if (loggedUser?.uid) {
        const bookings = await getUserBookings(loggedUser.uid);
        dispatch(setUserBookings(bookings));
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = userBookings?.filter(booking => {
    const isUpcoming = booking.status === "scheduled";
    return selectedTab === 0 ? isUpcoming : !isUpcoming;
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Button
          label="Upcoming"
          outline={selectedTab !== 0}
          onPress={() => setSelectedTab(0)}
          style={[styles.tabButton, selectedTab === 0 && styles.selectedTab]}
          labelStyle={selectedTab === 0 ? styles.selectedTabLabel : styles.tabLabel}
        />
        <Button
          label="Completed"
          outline={selectedTab !== 1}
          onPress={() => setSelectedTab(1)}
          style={[styles.tabButton, selectedTab === 1 && styles.selectedTab]}
          labelStyle={selectedTab === 1 ? styles.selectedTabLabel : styles.tabLabel}
        />
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text text70 style={styles.emptyText}>
              {selectedTab === 0
                ? "No upcoming bookings"
                : "No completed bookings"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    height: 44,
  },
  selectedTab: {
    backgroundColor: '#4A6FFF',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  bookingCard: {
    padding: 0,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  vehicleImage: {
    width: "100%", 
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  vehicleName: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 20,
    color: '#1A1A1A',
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
  dateBlock: {
    flex: 1,
    paddingHorizontal: 8,
  },
  dateLabel: {
    color: '#6C757D',
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  dateText: {
    color: '#212529',
    fontSize: 14,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priceLabel: {
    color: '#495057',
    fontSize: 15,
    fontWeight: '500',
  },
  price: {
    color: '#4A6FFF',
    fontWeight: "700",
    fontSize: 20,
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  cancelButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: '#6C757D',
  },
  selectedTabLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MyBookingsScreen;
