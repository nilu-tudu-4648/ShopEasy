//StudyHistory.jsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const StudyHistory = () => {
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const visitHistory = loggedUser?.user?.usage?.visitHistory || [];

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study History</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="clock-outline" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>
              {Math.floor(loggedUser?.user?.usage?.totalHours || 0)} hrs {Math.round(((loggedUser?.user?.usage?.totalHours || 0) % 1) * 60)} min
            </Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="calendar-check" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{loggedUser?.user?.visits || 0}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.historyContainer}>
        {visitHistory.slice().reverse().map((visit, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Icon name="desk" size={24} color={Colors.primary} />
              <View style={styles.historyDetails}>
                <Text style={styles.tableText}>Table {visit.tableId}</Text>
                <Text style={styles.locationText}>
                  Room {visit.room}, Floor {visit.floor}
                </Text>
              </View>
            </View>
            <Text style={styles.dateText}>{formatDate(visit.date)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textGrey,
    marginTop: 2,
  },
  historyContainer: {
    flex: 1,
    padding: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDetails: {
    marginLeft: 15,
  },
  tableText: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    color: Colors.textGrey,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textGrey,
  },
});

export default StudyHistory;
