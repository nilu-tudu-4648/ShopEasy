import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { View, Text, Card, Colors } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { LineChart, BarChart } from "react-native-chart-kit";

Colors.loadColors({
  primary: "#4A6FFF",
  secondary: "#6B8AFF", 
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#FF5252",
  textGrey: "#666666",
  shimmer: "#E0E0E0",
});

const ShimmerPlaceholder = ({ width, height, style }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        { width, height, backgroundColor: Colors.shimmer, overflow: "hidden" },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [{ translateX }],
          backgroundColor: "rgba(255,255,255,0.5)",
        }}
      />
    </View>
  );
};

export default function AdminHome() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalBookings: 0,
    occupancyRate: 0,
    totalTables: 0,
    revenueToday: 0,
    popularRooms: [],
    hourlyBookings: Array(24).fill(0),
    weeklyRevenue: Array(7).fill(0),
    peakHours: [],
    averageBookingDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const router = useRouter();
  const { loggedUser } = useSelector((state) => state.entities.authReducer);

  const fetchAdminStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Previous stats fetching code remains same
      const activeBookingsQuery = query(
        collection(db, "bookings"),
        where("status", "==", "active")
      );
      const activeBookings = await getDocs(activeBookingsQuery);

      const todayBookingsQuery = query(
        collection(db, "bookings"),
        where("createdAt", ">=", Timestamp.fromDate(today))
      );
      const todayBookings = await getDocs(todayBookingsQuery);

      const tablesSnapshot = await getDocs(collection(db, "tables"));

      const totalTables = tablesSnapshot.size;
      const occupancyRate = (activeBookings.size / totalTables) * 100;

      // Calculate hourly bookings distribution
      const hourlyBookings = Array(24).fill(0);
      todayBookings.forEach(doc => {
        const hour = new Date(doc.data().createdAt.toDate()).getHours();
        hourlyBookings[hour]++;
      });

      // Calculate weekly revenue
      const weeklyRevenue = Array(7).fill(0);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      todayBookings.forEach(doc => {
        const day = new Date(doc.data().createdAt.toDate()).getDay();
        weeklyRevenue[day] += 29.99;
      });

      // Calculate peak hours
      const peakHours = hourlyBookings
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      // Calculate average booking duration
      let totalDuration = 0;
      let bookingCount = 0;
      todayBookings.forEach(doc => {
        const data = doc.data();
        if (data.checkOutTime && data.checkInTime) {
          totalDuration += data.checkOutTime.toDate() - data.checkInTime.toDate();
          bookingCount++;
        }
      });
      const averageBookingDuration = bookingCount > 0 ? totalDuration / bookingCount / (1000 * 60 * 60) : 0;

      // Get room stats
      const roomStats = {};
      todayBookings.forEach((doc) => {
        const room = doc.data().room;
        roomStats[room] = (roomStats[room] || 0) + 1;
      });

      const popularRooms = Object.entries(roomStats)
        .map(([room, count]) => ({ room, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStats({
        activeUsers: activeBookings.size,
        totalBookings: todayBookings.size,
        occupancyRate: Math.round(occupancyRate),
        totalTables,
        revenueToday: todayBookings.size * 29.99,
        popularRooms,
        hourlyBookings,
        weeklyRevenue,
        peakHours,
        averageBookingDuration: Math.round(averageBookingDuration * 10) / 10
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCard = (icon, value, label) => {
    if (loading) {
      return (
        <Card style={[styles.statsCard, styles.cardShadow]}>
          <Icon name={icon} size={32} color={Colors.shimmer} />
          <ShimmerPlaceholder width={80} height={30} style={{ marginTop: 8 }} />
          <ShimmerPlaceholder
            width={100}
            height={20}
            style={{ marginTop: 4 }}
          />
        </Card>
      );
    }

    return (
      <Card
        onPress={() => router.push("/Allusers")}
        style={[styles.statsCard, styles.cardShadow]}
      >
        <Icon name={icon} size={32} color={Colors.primary} />
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsLabel}>{label}</Text>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Today's Overview</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {renderStatsCard("account-group", stats.activeUsers, "Active Users")}
          {renderStatsCard(
            "calendar-check",
            stats.totalBookings,
            "Today's Bookings"
          )}
          {renderStatsCard(
            "chart-pie",
            `${stats.occupancyRate}%`,
            "Occupancy Rate"
          )}
          {renderStatsCard(
            "currency-inr",
            `₹${stats.revenueToday.toFixed(2)}`,
            "Today's Revenue"
          )}
        </View>

        <Card style={[styles.chartCard, styles.cardShadow]}>
          <Text style={styles.cardTitle}>Hourly Booking Distribution</Text>
          {!loading && (
            <LineChart
              data={{
                labels: ['12am', '6am', '12pm', '6pm', '11pm'],
                datasets: [{
                  data: stats.hourlyBookings
                }]
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 111, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          )}
        </Card>

        <Card style={[styles.chartCard, styles.cardShadow]}>
          <Text style={styles.cardTitle}>Weekly Revenue</Text>
          {!loading && (
            <BarChart
              data={{
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                  data: stats.weeklyRevenue
                }]
              }}
              width={screenWidth - 40} 
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 111, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                barPercentage: 0.7,
                propsForLabels: {
                  fontSize: 12
                }
              }}
              style={{
                marginVertical: 8,
                marginHorizontal: -10,
                borderRadius: 16
              }}
              showBarTops={false}
            />
          )}
        </Card>

        <Card style={[styles.insightsCard, styles.cardShadow]}>
          <Text style={styles.cardTitle}>Key Insights</Text>
          <View style={styles.insightItem}>
            <Icon name="clock-outline" size={24} color={Colors.primary} />
            <Text style={styles.insightText}>
              Average booking duration: {stats.averageBookingDuration} hours
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Icon name="trending-up" size={24} color={Colors.success} />
            <Text style={styles.insightText}>
              Peak hours: {stats.peakHours.map(h => `${h.hour}:00`).join(', ')}
            </Text>
          </View>
        </Card>

        <Card style={[styles.popularRoomsCard, styles.cardShadow]}>
          <Text style={styles.cardTitle}>Popular Rooms</Text>
          {loading
            ? [...Array(3)].map((_, index) => (
                <View key={index} style={styles.roomItem}>
                  <ShimmerPlaceholder width={150} height={24} />
                  <ShimmerPlaceholder width={80} height={20} />
                </View>
              ))
            : stats.popularRooms.map((room, index) => (
                <View key={index} style={styles.roomItem}>
                  <View style={styles.roomInfo}>
                    <Icon name="door" size={24} color={Colors.primary} />
                    <Text style={styles.roomText}>Room {room.room}</Text>
                  </View>
                  <Text style={styles.bookingCount}>{room.count} bookings</Text>
                </View>
              ))}
        </Card>

        <Card style={[styles.systemStatusCard, styles.cardShadow]}>
          <Text style={styles.cardTitle}>System Status</Text>
          {loading ? (
            [...Array(2)].map((_, index) => (
              <View key={index} style={styles.statusItem}>
                <ShimmerPlaceholder width={200} height={24} />
              </View>
            ))
          ) : (
            <>
              <View style={styles.statusItem}>
                <Icon name="database-check" size={24} color={Colors.success} />
                <Text style={styles.statusText}>Database: Operational</Text>
              </View>
              <View style={styles.statusItem}>
                <Icon name="wifi-check" size={24} color={Colors.success} />
                <Text style={styles.statusText}>Network: Strong</Text>
              </View>
            </>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
    marginTop: 5,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsCard: {
    width: "48%",
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "white",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.textGrey,
    marginTop: 4,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  insightsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  insightText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  popularRoomsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  bookingCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  systemStatusCard: {
    padding: 16,
    backgroundColor: "white",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});
