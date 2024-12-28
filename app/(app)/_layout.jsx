import { Drawer } from "expo-router/drawer";
import { useSelector } from "react-redux";
import { usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerItem from "../../components/CustomDrawerItem";
import { routeNames } from "../../constants/data";

const CustomDrawerContent = () => {
  const pathname = usePathname();
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const drawerItems = [
    {
      label: "Home",
      icon: (
        <Ionicons
          name="home-outline"
          size={24}
          color={pathname === `/${routeNames.HomeScreen}` ? "#4A6FFF" : "#666666"}
        />
      ),
      route: routeNames.HomeScreen,
    },
    {
      label: "Profile",
      icon: (
        <Ionicons
          name="person-outline"
          size={24}
          color={pathname === `/${routeNames.ProfileScreen}` ? "#4A6FFF" : "#666666"}
        />
      ),
      route: routeNames.ProfileScreen,
    },
    ...(loggedUser?.admin
      ? [
          {
            label: "Add Vehicle",
            icon: (
              <Ionicons
                name="car-outline"
                size={24}
                color={
                  pathname === `/${routeNames.AddVehicleScreen}` ? "#4A6FFF" : "#666666"
                }
              />
            ),
            route: routeNames.AddVehicleScreen,
          },
        ]
      : []),
    {
      label: "My Bookings",
      icon: (
        <Ionicons
          name="calendar-outline"
          size={24}
          color={
            pathname === routeNames.MyBookingsScreen ? "#4A6FFF" : "#666666"
          }
        />
      ),
      route: routeNames.MyBookingsScreen,
    },
    {
      label: "Help & Support",
      icon: (
        <Ionicons
          name="help-circle-outline"
          size={24}
          color={
            pathname === `/${routeNames.HelpSupportScreen}` ? "#4A6FFF" : "#666666"
          }
        />
      ),
      route: routeNames.HelpSupportScreen,
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#4A6FFF", "#83B9FF"]}
        style={styles.drawerHeader}
      >
        <View style={styles.headerTop}>
          <Text style={styles.appName}>DriveLoop</Text>
        </View>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{loggedUser?.name}</Text>
          <Text style={styles.userEmail}>{loggedUser?.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.drawerContent}>
        {drawerItems.map((item, index) => (
          <CustomDrawerItem
            key={index}
            icon={item.icon}
            label={item.label}
            route={item.route}
          />
        ))}
      </View>
    </View>
  );
};

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4A6FFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: "DriveLoop",
        headerTitleAlign: "center",
        drawerStyle: { width: "85%" },
        swipeEdgeWidth: 100,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name={routeNames.HomeScreen} />
      <Drawer.Screen name={routeNames.ProfileScreen} />
      <Drawer.Screen name={routeNames.MyBookingsScreen} />
      <Drawer.Screen name={routeNames.HelpSupportScreen} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
  },
  headerTop: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userInfo: {
    alignItems: "center",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 16,
  },
  userStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 9,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#FFF1F1",
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFE5E5",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF5252",
    fontWeight: "600",
  },
});
