import React, { useState, useEffect,useCallback,useMemo } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Button, Text, Colors, TextField } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { formatTime } from "../../constants/helperFunc";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc,
  addDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  increment, 
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CheckInOutScreen = () => {
  const [state, setState] = useState({
    selectedTable: null,
    isCheckedIn: false,
    timer: 0,
    checkInTime: null,
    selectedRoom: "A",
    searchQuery: "",
    selectedFloor: 1,
    loading: false,
    tables: [],
    checkInHistory: []
  });
  
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  
  // Memoized state setters to reduce rerenders
  const setters = useMemo(() => ({
    setSelectedTable: (value) => setState(prev => ({ ...prev, selectedTable: value })),
    setLoading: (value) => setState(prev => ({ ...prev, loading: value })),
    setTables: (value) => setState(prev => ({ ...prev, tables: value })),
    setSearchQuery: (value) => setState(prev => ({ ...prev, searchQuery: value })),
    setSelectedRoom: (value) => setState(prev => ({ ...prev, selectedRoom: value })),
    setSelectedFloor: (value) => setState(prev => ({ ...prev, selectedFloor: value })),
    setCheckInHistory: (value) => setState(prev => ({ ...prev, checkInHistory: value })),
    setTimer: (value) => setState(prev => ({ ...prev, timer: value })),
    startCheckIn: (table, time) => setState(prev => ({
      ...prev,
      isCheckedIn: true,
      selectedTable: table,
      checkInTime: time,
      timer: 0
    })),
    endCheckIn: () => setState(prev => ({
      ...prev,
      isCheckedIn: false,
      checkInTime: null,
      selectedTable: null,
      timer: 0
    }))
  }), []);

  // Memoized Firebase queries
  const queries = useMemo(() => ({
    getCurrentBooking: () => doc(db, 'users', loggedUser.user.id),
    getTablesQuery: (room, floor) => query(
      collection(db, 'tables'),
      where('room', '==', room),
      where('floor', '==', floor)
    ),
    getActiveBookingsQuery: () => query(
      collection(db, 'bookings'),
      where('status', '==', 'active')
    ),
    getTodayBookingsQuery: (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(today)),
        orderBy('createdAt', 'desc')
      );
    }
  }), [loggedUser.user.id]);

  // Memoized data fetching functions
  const dataFetchers = useMemo(() => ({
    fetchCurrentBooking: async () => {
      try {
        const userDoc = await getDoc(queries.getCurrentBooking());
        const currentBooking = userDoc.data()?.currentBooking;
  
        if (currentBooking?.startTime) {
          const startTime = currentBooking.startTime instanceof Timestamp 
            ? currentBooking.startTime.toDate() 
            : new Date(currentBooking.startTime);
          
          setters.startCheckIn(
            currentBooking.tableId,
            startTime.toISOString()
          );
        }
      } catch (error) {
        console.error('Error fetching current booking:', error);
      }
    },

    fetchTables: async () => {
      try {
        setters.setLoading(true);
        
        const [tablesSnapshot, bookingsSnapshot] = await Promise.all([
          getDocs(queries.getTablesQuery(state.selectedRoom, state.selectedFloor)),
          getDocs(queries.getActiveBookingsQuery())
        ]);
  
        const tablesList = tablesSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          status: 'available',
          currentBooking: null
        }));
  
        const now = new Date();
        const activeBookings = bookingsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
  
        const updatedTables = tablesList.map(table => {
          const activeBooking = activeBookings.find(booking => 
            booking.tableId === table.id && 
            booking.endTime.toDate() > now
          );
  
          return activeBooking ? {
            ...table,
            status: 'occupied',
            currentBooking: activeBooking
          } : table;
        });
  
        setters.setTables(updatedTables);
      } catch (error) {
        console.error('Error fetching tables:', error);
        Alert.alert('Error', 'Failed to load tables');
      } finally {
        setters.setLoading(false);
      }
    },

    fetchHistory: async () => {
      try {
        const snapshot = await getDocs(
          queries.getTodayBookingsQuery(loggedUser.user.id),
          { includeMetadataChanges: true }
        );
        
        const history = snapshot.docs
          .filter(doc => doc.data().createdAt)
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            time: doc.data().createdAt.toDate().toISOString()
          }));
        
        setters.setCheckInHistory(history);
      } catch (error) {
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          Alert.alert(
            'One-time Setup Required',
            'Please wait while we set up the database index. This may take a few minutes. Try again shortly.'
          );
        } else {
          console.error('Error fetching history:', error);
          Alert.alert('Error', 'Failed to load check-in history');
        }
      }
    }
  }), [queries, state.selectedRoom, state.selectedFloor, setters, loggedUser.user.id]);

  // Memoized handlers
  const handlers = useMemo(() => ({
    handleCheckIn: async () => {
      if (!state.selectedTable) {
        Alert.alert('Error', 'Please select a table');
        return;
      }
  
      try {
        setters.setLoading(true);
        const now = new Date();
        const firestoreTimestamp = Timestamp.fromDate(now);
  
        const booking = {
          userId: loggedUser.user.id,
          tableId: state.selectedTable,
          room: state.selectedRoom,
          floor: state.selectedFloor,
          startTime: firestoreTimestamp,
          endTime: Timestamp.fromDate(new Date(now.getTime() + (8 * 60 * 60 * 1000))),
          status: 'active',
          createdAt: serverTimestamp()
        };
  
        const bookingRef = await addDoc(collection(db, 'bookings'), booking);
  
        await updateDoc(queries.getCurrentBooking(), {
          currentBooking: {
            id: bookingRef.id,
            tableId: state.selectedTable,
            startTime: firestoreTimestamp
          },
          visits: increment(1)
        });
  
        setters.startCheckIn(state.selectedTable, now.toISOString());
        await Promise.all([dataFetchers.fetchTables(), dataFetchers.fetchHistory()]);
      } catch (error) {
        console.error('Check-in error:', error);
        Alert.alert('Error', 'Failed to check in');
      } finally {
        setters.setLoading(false);
      }
    },

    handleCheckOut: async () => {
      try {
        setters.setLoading(true);
        const now = new Date();
  
        const userDoc = await getDoc(queries.getCurrentBooking());
        const currentBooking = userDoc.data()?.currentBooking;
  
        if (currentBooking) {
          await Promise.all([
            updateDoc(doc(db, 'bookings', currentBooking.id), {
              status: 'completed',
              endTime: Timestamp.fromDate(now),
              actualDuration: state.timer
            }),
            updateDoc(queries.getCurrentBooking(), {
              currentBooking: null,
              totalStudyTime: increment(state.timer)
            })
          ]);
        }
  
        setters.endCheckIn();
        await Promise.all([dataFetchers.fetchTables(), dataFetchers.fetchHistory()]);
      } catch (error) {
        console.error('Check-out error:', error);
        Alert.alert('Error', 'Failed to check out');
      } finally {
        setters.setLoading(false);
      }
    }
  }), [state, setters, queries, loggedUser.user.id, dataFetchers]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (state.isCheckedIn && state.checkInTime) {
      const startTime = new Date(state.checkInTime);
      setters.setTimer(Math.floor((new Date() - startTime) / 1000));

      interval = setInterval(() => {
        setters.setTimer(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [state.isCheckedIn, state.checkInTime, setters]);

  // Initial data loading
  useEffect(() => {
    dataFetchers.fetchCurrentBooking();
    dataFetchers.fetchHistory();
  }, [dataFetchers]);

  useEffect(() => {
    dataFetchers.fetchTables();
  }, [state.selectedRoom, state.selectedFloor, dataFetchers]);

  // Memoized filtered tables
  const filteredTables = useMemo(() => 
    state.tables.filter(table => 
      table.id.toLowerCase().includes(state.searchQuery.toLowerCase())
    ),
    [state.tables, state.searchQuery]
  );


  // Your existing FilterSection and HistorySection components remain the same
  const FilterSection = useCallback(() => (
    <View style={styles.filterContainer}>
      <View style={styles.searchContainer}>
        <TextField
          placeholder="Search table..."
          value={state.searchQuery}
          onChangeText={setters.setSearchQuery}
          leadingAccessory={<Icon name="magnify" size={20} color={Colors.textGrey} />}
          style={styles.searchInput}
        />
      </View>
  
      <View style={styles.filterSection}>
        <View style={styles.roomButtons}>
          {["A", "B"].map((room) => (
            <Button
              key={room}
              label={`Room ${room}`}
              outline={state.selectedRoom !== room}
              backgroundColor={state.selectedRoom === room ? Colors.primary : Colors.white}
              labelStyle={{
                color: state.selectedRoom === room ? Colors.white : Colors.primary,
              }}
              style={styles.roomButton}
              onPress={() => setSelectedRoom(room)}
            />
          ))}
        </View>
  
        <View style={styles.floorButtons}>
          {[1, 2].map((floor) => (
            <Button
              key={floor}
              label={`Floor ${floor}`}
              outline={state.selectedFloor !== floor}
              backgroundColor={state.selectedFloor === floor ? Colors.primary : Colors.white}
              labelStyle={{
                color: state.selectedFloor === floor ? Colors.white : Colors.primary,
              }}
              style={styles.floorButton}
              onPress={() => setSelectedFloor(floor)}
            />
          ))}
        </View>
      </View>
  
      <View style={styles.statusSummary}>
        <View style={styles.statusItem}>
          <Icon name="desk" size={20} color={Colors.success} />
          <Text style={styles.statusCount}>
            {state.tables.filter((t) => t.status === "available").length} Available
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Icon name="desk" size={20} color={Colors.error} />
          <Text style={styles.statusCount}>
            {state.tables.filter((t) => t.status === "occupied").length} Occupied
          </Text>
        </View>
      </View>
    </View>
 ), [state.searchQuery, setters.setSearchQuery]);

 const HistorySection = useCallback(() => (
  <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Today's Activity</Text>
      {state.checkInHistory.length === 0 ? (
        <Text style={styles.noHistoryText}>No activity today</Text>
      ) : (
        state.checkInHistory.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Icon
              name={entry.status === "active" ? "login" : "logout"}
              size={20}
              color={entry.status === "active" ? Colors.primary : Colors.error}
            />
            <View style={styles.historyDetails}>
              <Text style={styles.historyText}>
                {entry.status === "active" ? "Checked in to" : "Checked out from"}{" "}
                Table {entry.tableId}
              </Text>
              <Text style={styles.historyTime}>
                {entry.createdAt?.toDate().toLocaleTimeString() || 'Time not available'}
                {entry.actualDuration &&  (`Duration: ${formatTime.getDuration(entry.actualDuration)}`)}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  ), [state.checkInHistory]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#4A6FFF", "#6B8AFF"]} style={styles.header}>
          <View style={styles.headerContent}>
            {state.isCheckedIn && (
              <View style={styles.currentStatus}>
                <Icon name="desk" size={24} color="white" />
                <Text style={styles.statusText}>Table {state.selectedTable}</Text>
              </View>
            )}
            <View style={styles.timerContent}>
              <Text style={styles.timerLabel}>Study Duration</Text>
              <Text style={styles.timerText}>{formatTime.getDuration(state.timer)}</Text>
              {state.checkInTime && (
                <Text style={styles.checkInTime}>
                  Check-in: {new Date(state.checkInTime).toLocaleTimeString()}
                </Text>
              )}
            </View>
          </View>
        </LinearGradient>
        <SafeAreaView style={styles.mainContent}>
          <Button
            label={state.isCheckedIn ? "Check Out" : "Check In"}
            backgroundColor={state.isCheckedIn ? Colors.error : Colors.primary}
            style={styles.actionButton}
            outline
            disabled={(!state.selectedTable && !state.isCheckedIn) || state.loading}
            onPress={state.isCheckedIn ? handlers.handleCheckOut : handlers.handleCheckIn}
          >
            {state.loading ? (
              <ActivityIndicator color={state.isCheckedIn ? Colors.error : Colors.primary} />
            ) : (
              <Text style={styles.buttonText}>
                {state.isCheckedIn ? "Check Out" : "Check In"}
              </Text>
            )}
          </Button>

          <FilterSection />

          <ScrollView style={styles.tablesContainer}>
            <View style={styles.tableGrid}>
              {filteredTables.map((table) => (
                <Button
                  key={table.id}
                  label={`T ${table.id}`}
                  disabled={table.status === "occupied" || state.loading}
                  backgroundColor={
                    state.selectedTable === table.id
                      ? Colors.primary
                      : table.status === "occupied"
                      ? Colors.error + "20"
                      : Colors.white
                  }
                  outlineColor={Colors.primary}
                  style={[
                    styles.tableButton,
                    state.selectedTable === table.id && styles.selectedTable,
                    table.status === "occupied" && styles.occupiedTable,
                  ]}
                  labelStyle={{
                    color:
                      state.selectedTable === table.id
                        ? "white"
                        : table.status === "occupied"
                        ? Colors.error
                        : Colors.primary,
                  }}
                  onPress={() => setters.setSelectedTable(table.id)}
                >
                  {table.currentBooking && (
                    <Text style={styles.bookingInfo}>
                      Until {new Date(table.currentBooking.endTime?.toDate()).toLocaleTimeString()}
                    </Text>
                  )}
                </Button>
              ))}
            </View>
          </ScrollView>

          {state.checkInHistory.length > 0 && <HistorySection />}
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 20,
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  filterContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    height: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  currentStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  tableButton: {
    width: "48%",
    height: 100,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTable: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  occupiedTable: {
    opacity: 0.5,
  },
  bookingInfo: {
    fontSize: 12,
    color: Colors.textGrey,
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    marginTop: 20,
  },
  timerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  timerGradient: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  timerContent: {
    alignItems: "center",
  },
  timerLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  timerText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  checkInTime: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  searchContainer: {
    marginVertical: 15,
    borderColor:'gray',
    borderRadius: 10,
    padding: 10,
    borderWidth:1
  },
  searchInput: {
    backgroundColor: Colors.white,
  },
  filterSection: {
    marginBottom: 15,
  },
  roomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roomButton: {
    width: "48%",
    borderRadius: 10,
  },
  floorButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floorButton: {
    width: "48%",
    borderRadius: 10,
  },
  statusSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCount: {
    marginLeft: 5,
    color: Colors.textGrey,
  },
  tablesContainer: {
    flex: 1,
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 5,
  },
  tableButton: {
    width: "31%",
    height: 80,
    marginBottom: 10,
    borderRadius: 10,
  },
  historyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  historyDetails: {
    marginLeft: 10,
    flex: 1,
  },
  historyText: {
    fontSize: 14,
  },
  historyTime: {
    color: Colors.textGrey,
    fontSize: 12,
    marginTop: 2,
  },
  noHistoryText: {
    color: Colors.textGrey,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CheckInOutScreen;