import { Drawer } from "expo-router/drawer";
import { useSelector } from "react-redux";
import { Redirect, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerItem from "../../components/CustomDrawerItem";

const CustomDrawerContent = ({ state, navigation, descriptors }) => {
  const pathname = usePathname();

  const drawerItems = [
    {
      label: 'Home',
      icon: <Ionicons name="home-outline" size={24} color={pathname === '/HomeScreen' ? '#4A6FFF' : '#666666'} />,
      route: '/HomeScreen'
    },
    {
      label: 'Profile',
      icon: <Ionicons name="person-outline" size={24} color={pathname === '/ProfileScreen' ? '#4A6FFF' : '#666666'} />,
      route: '/ProfileScreen'
    },
    {
      label: 'My Plans',
      icon: <Ionicons name="calendar-outline" size={24} color={pathname === '/MyPlansScreen' ? '#4A6FFF' : '#666666'} />,
      route: '/MyPlansScreen'
    },
    {
      label: 'Help & Support',
      icon: <Ionicons name="help-circle-outline" size={24} color={pathname === '/HelpSupportScreen' ? '#4A6FFF' : '#666666'} />,
      route: '/HelpSupportScreen'
    },
    {
      label: 'Notifications',
      icon: <Ionicons name="notifications-outline" size={24} color={pathname === '/NotificationsScreen' ? '#4A6FFF' : '#666666'} />,
      route: '/NotificationsScreen'
    }
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#4A6FFF", "#83B9FF"]}
        style={styles.drawerHeader}
      >
        <View style={styles.headerTop}>
          <Text style={styles.appName}>DeskTime</Text>
        </View>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
          {/* <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42h</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View> */}
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
{/* 
      <TouchableOpacity style={styles.logoutButton}>
        <View style={styles.logoutIcon}>
          <Ionicons name="log-out-outline" size={24} color="#FF5252" />
        </View>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}
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
        headerTitle: "DeskTime",
        headerTitleAlign: "center",
        drawerStyle: { width: "85%" },
        swipeEdgeWidth: 100,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" />
      <Drawer.Screen name="ProfileScreen" />
      <Drawer.Screen name="MyPlansScreen" />
      <Drawer.Screen name="HelpSupportScreen" />
      <Drawer.Screen name="NotificationsScreen" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    // paddingTop: 60,
    // paddingBottom: 30,
  },
  headerTop: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 9,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFE5E5',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '600',
  },
});