import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Colors, TextField } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

Colors.loadColors({
  primary: "#4A6FFF",
  secondary: "#6B8AFF",
  textGrey: "#666666",
  backgroundGrey: "#F8FAFC",
  cardBg: "#FFFFFF",
  success: "#4CAF50",
  error: "#FF5252",
});

const CheckInOutScreen = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("A");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [checkInHistory, setCheckInHistory] = useState([]);

  // Generate tables data
  const generateTables = () => {
    const tables = [];
    // Room A - 50 tables
    for (let i = 1; i <= 50; i++) {
      tables.push({
        id: `A${i}`,
        room: "A",
        floor: i <= 25 ? 1 : 2,
        status: Math.random() > 0.7 ? "occupied" : "available",
      });
    }
    // Room B - 50 tables
    for (let i = 1; i <= 50; i++) {
      tables.push({
        id: `B${i}`,
        room: "B",
        floor: i <= 25 ? 1 : 2,
        status: Math.random() > 0.7 ? "occupied" : "available",
      });
    }
    return tables;
  };

  const tables = generateTables();

  useEffect(() => {
    loadCheckInState();
    loadCheckInHistory();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isCheckedIn && checkInTime) {
        const interval = setInterval(() => {
          const elapsedTime = calculateElapsedTime(checkInTime);
          setTimer(elapsedTime);
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [isCheckedIn, checkInTime])
  );

  const loadCheckInState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("checkInState");
      if (savedState) {
        const { isCheckedIn, checkInTime, selectedTable } =
          JSON.parse(savedState);
        setIsCheckedIn(isCheckedIn);
        setCheckInTime(checkInTime);
        setSelectedTable(selectedTable);
        if (isCheckedIn && checkInTime) {
          const elapsedTime = calculateElapsedTime(checkInTime);
          setTimer(elapsedTime);
        }
      }
    } catch (error) {
      console.error("Error loading check-in state:", error);
    }
  };

  const loadCheckInHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("checkInHistory");
      if (history) {
        setCheckInHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error("Error loading check-in history:", error);
    }
  };

  const saveCheckInHistory = async (newEntry) => {
    try {
      const history = [...checkInHistory, newEntry];
      await AsyncStorage.setItem("checkInHistory", JSON.stringify(history));
      setCheckInHistory(history);
    } catch (error) {
      console.error("Error saving check-in history:", error);
    }
  };

  const saveCheckInState = async (isCheckedIn, checkInTime) => {
    try {
      const state = {
        isCheckedIn,
        checkInTime,
        selectedTable,
      };
      await AsyncStorage.setItem("checkInState", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving check-in state:", error);
    }
  };

  const handleCheckInOut = async () => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[now.getDay()];

    if (!isCheckedIn) {
      const newCheckInTime = now.toISOString();
      setCheckInTime(newCheckInTime);
      setIsCheckedIn(true);
      setTimer(0);
      await saveCheckInState(true, newCheckInTime);

      const checkInEntry = {
        type: "check-in",
        table: selectedTable,
        time: newCheckInTime,
        dayName,
        date: now.toLocaleDateString(),
      };
      await saveCheckInHistory(checkInEntry);
    } else {
      const checkOutEntry = {
        type: "check-out",
        table: selectedTable,
        time: now.toISOString(),
        dayName,
        date: now.toLocaleDateString(),
        duration: formatTime(timer),
      };
      await saveCheckInHistory(checkOutEntry);

      setIsCheckedIn(false);
      setTimer(0);
      setCheckInTime(null);
      await saveCheckInState(false, null);
    }
  };

  const calculateElapsedTime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return Math.floor((now - start) / 1000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRoom = table.room === selectedRoom;
    const matchesFloor = table.floor === selectedFloor;
    return matchesSearch && matchesRoom && matchesFloor;
  });

  const availableCount = filteredTables.filter(
    (t) => t.status === "available"
  ).length;
  const occupiedCount = filteredTables.filter(
    (t) => t.status === "occupied"
  ).length;

  const HistorySection = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Today's Activity</Text>
      {checkInHistory
        .filter((entry) => entry.date === new Date().toLocaleDateString())
        .map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Icon
              name={entry.type === "check-in" ? "login" : "logout"}
              size={20}
              color={entry.type === "check-in" ? Colors.primary : Colors.error}
            />
            <View style={styles.historyDetails}>
              <Text style={styles.historyText}>
                {entry.type === "check-in"
                  ? "Checked in to"
                  : "Checked out from"}{" "}
                Table {entry.table}
              </Text>
              <Text style={styles.historyTime}>
                {new Date(entry.time).toLocaleTimeString()} - {entry.dayName}
                {entry.duration && ` (Duration: ${entry.duration})`}
              </Text>
            </View>
          </View>
        ))}
    </View>
  );

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#4A6FFF", "#6B8AFF"]} style={styles.header}>
          <View style={styles.headerContent}>
            {isCheckedIn && (
              <View style={styles.currentStatus}>
                <Icon name="desk" size={24} color="white" />
                <Text style={styles.statusText}>Table {selectedTable}</Text>
              </View>
            )}
            <View style={styles.timerContent}>
              <Text style={styles.timerLabel}>Study Duration</Text>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
              <Text style={styles.checkInTime}>
                Check-in: {new Date(checkInTime).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </LinearGradient>
          <Button
            label={isCheckedIn ? "Check Out" : "Check In"}
            backgroundColor={isCheckedIn ? Colors.error : Colors.primary}
            style={styles.actionButton}
            outline
            disabled={!selectedTable && !isCheckedIn}
            onPress={handleCheckInOut}
          />

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextField
              placeholder="Search table..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leadingAccessory={
                <Icon name="magnify" size={20} color={Colors.textGrey} />
              }
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterSection}>
            <View style={styles.roomButtons}>
              {["A", "B"].map((room) => (
                <Button
                  key={room}
                  label={`Room ${room}`}
                  outline={selectedRoom !== room}
                  backgroundColor={
                    selectedRoom === room ? Colors.primary : Colors.white
                  }
                  labelStyle={{
                    color:
                      selectedRoom === room ? Colors.white : Colors.primary,
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
                  outline={selectedFloor !== floor}
                  backgroundColor={
                    selectedFloor === floor ? Colors.primary : Colors.white
                  }
                  labelStyle={{
                    color:
                      selectedFloor === floor ? Colors.white : Colors.primary,
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
              <Text style={styles.statusCount}>{availableCount} Available</Text>
            </View>
            <View style={styles.statusItem}>
              <Icon name="desk" size={20} color={Colors.error} />
              <Text style={styles.statusCount}>{occupiedCount} Occupied</Text>
            </View>
          </View>



          <ScrollView style={styles.tablesContainer}>
            <View style={styles.tableGrid}>
              {filteredTables.map((table) => (
                <Button
                  key={table.id}
                  label={`T ${table.id}`}
                  disabled={table.status === "occupied"}
                  backgroundColor={
                    selectedTable === table.id
                      ? Colors.primary
                      : table.status === "occupied"
                      ? Colors.error + "20"
                      : Colors.white
                  }
                  outlineColor={Colors.primary}
                  style={[
                    styles.tableButton,
                    selectedTable === table.id && styles.selectedTable,
                    table.status === "occupied" && styles.occupiedTable,
                  ]}
                  labelStyle={{
                    color:
                      selectedTable === table.id
                        ? "white"
                        : table.status === "occupied"
                        ? Colors.error
                        : Colors.primary,
                  }}
                  onPress={() => setSelectedTable(table.id)}
                />
              ))}
            </View>
          </ScrollView>
          <HistorySection />
        </View>
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
});

export default CheckInOutScreen;
