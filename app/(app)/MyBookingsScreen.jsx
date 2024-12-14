import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  TabController,
} from 'react-native-ui-lib';

const MyBookingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookings] = useState([
    {
      id: '1',
      vehicle: 'Toyota Camry',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-25'),
      status: 'upcoming',
      price: 250,
    },
    {
      id: '2',
      vehicle: 'Honda Civic',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-18'),
      status: 'completed',
      price: 180,
    },
  ]);

  const filteredBookings = bookings.filter(booking => 
    (selectedTab === 0 && booking.status === 'upcoming') ||
    (selectedTab === 1 && booking.status === 'completed')
  );

  const renderBookingCard = ({ item }) => (
    <Card style={styles.bookingCard}>
      <Text text60 style={styles.vehicleName}>{item.vehicle}</Text>
      
      <View style={styles.dateRow}>
        <View>
          <Text text70 style={styles.dateLabel}>Start Date</Text>
          <Text text70>{item.startDate.toLocaleDateString()}</Text>
        </View>
        
        <View>
          <Text text70 style={styles.dateLabel}>End Date</Text>
          <Text text70>{item.endDate.toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text text70>Total Price</Text>
        <Text text60 style={styles.price}>${item.price}</Text>
      </View>

      {item.status === 'upcoming' && (
        <Button
          label="Cancel Booking"
          outline
          outlineColor="#FF4444"
          style={styles.cancelButton}
        />
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <TabController
        items={[
          { label: 'Upcoming' },
          { label: 'Completed' }
        ]}
        selectedIndex={selectedTab}
        onChangeIndex={setSelectedTab}
      >
        <TabController.TabBar
          enableShadow
          backgroundColor="#fff"
          indicatorStyle={{ backgroundColor: '#4169E1' }}
          labelStyle={styles.tabLabel}
          selectedLabelStyle={styles.selectedTabLabel}
        />
      </TabController>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text text70 style={styles.emptyText}>
              {selectedTab === 0 ? 'No upcoming bookings' : 'No completed bookings'}
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
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  bookingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  vehicleName: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateLabel: {
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    color: '#4169E1',
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 40,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  selectedTabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4169E1',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
  },
});

export default MyBookingsScreen;