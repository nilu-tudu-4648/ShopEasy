import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  HomeIcon,
  ListIcon,
  ShoppingBagIcon,
  ReceiptIcon,
  UserIcon,
  TagIcon,
  HeartIcon,
  BellIcon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react-native";

import HomeScreen from "./HomeScreen";
import CategoriesScreen from "./CategoriesScreen";
import CartScreen from "./CartScreen";
import OrdersScreen from "./OrdersScreen";
import ProfileScreen from "./ProfileScreen";
import OffersScreen from "./OffersScreen";
import WishlistScreen from "./WishlistScreen";
import NotificationsScreen from "./NotificationsScreen";
import HelpSupportScreen from "./HelpSupportScreen";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState("Home");
  const dispatch = useDispatch();

  const menuItems = [
    { icon: HomeIcon, label: "Home", route: "Home" },
    { icon: ListIcon, label: "Categories", route: "Categories" },
    { icon: TagIcon, label: "Offers", route: "Offers" },
    { icon: HeartIcon, label: "Wishlist", route: "Wishlist" },
    { icon: BellIcon, label: "Notifications", route: "Notifications" },
    { icon: UserIcon, label: "Account", route: "Profile" },
    { icon: HelpCircleIcon, label: "Help & Support", route: "HelpSupport" },
    { icon: LogOutIcon, label: "Logout", route: "Logout" },
  ];

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch(setUser(null));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleNavigation = (item) => {
    if (!item?.label) return;

    try {
      if (item.label.toLowerCase() === "logout") {
        removeUser();
      } else if (item.route) {
        setSelectedItem(item.label);
        navigation.navigate(item.route);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.logoText}>ShopEasy</Text>
      </View>
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isSelected = selectedItem === item.label;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isSelected && styles.activeMenuItem]}
              onPress={() => handleNavigation(item)}
            >
              <View style={styles.menuIcon}>
                <Icon size={24} color={isSelected ? "#fff" : "#64748B"} />
              </View>
              <Text
                style={[styles.menuText, isSelected && styles.activeMenuText]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color }) => <ListIcon size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <ShoppingBagIcon size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color }) => <ReceiptIcon size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: "80%",
        },
        headerTitle:"ShopEasy",
        headerTitleAlign: "center",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Tab" component={TabNavigator} />
      <Drawer.Screen name="Offers" component={OffersScreen} />
      <Drawer.Screen name="Wishlist" component={WishlistScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 42 : 0,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeMenuItem: {
    backgroundColor: "#2563EB",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#64748B",
  },
  activeMenuText: {
    color: "#fff",
  },
  tabBar: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingBottom: 5,
  },
});
