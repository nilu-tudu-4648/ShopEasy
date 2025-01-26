import { Drawer } from "expo-router/drawer";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomDrawerItem from "../../components/CustomDrawerItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "@/store/reducers/authReducer";

const drawerItems = [
  {
    label: 'Home',
    iconName: 'home-outline',
    route: '/HomeScreen'
  },
  {
    label: 'Register member', 
    iconName: 'person-add-outline',
    route: '/UserRegister'
  },
  {
    label: 'Members',
    iconName: 'people-outline',
    route: '/UserList'
  },
  {
    label: 'Plans',
    iconName: 'calendar-outline', 
    route: '/MyPlansScreen'
  },
];

const CustomDrawerContent = () => {
  const pathname = usePathname();
  const {loggedUser} = useSelector((state) => state.entities.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!loggedUser) {
    return <Redirect href="/LoginScreen" />;
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/(auth)/LoginScreen");
      setTimeout(() => {
        dispatch(setUser(null));
      }, 1000);
    } catch (error) {
      console.error("Error logging out:", error);
    } 
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4A6FFF", "#83B9FF"]}
        style={styles.drawerHeader}
      >
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/60" }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{loggedUser.user?.firstName}</Text>
          <Text style={styles.userEmail}>{loggedUser.user?.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.drawerContent}>
        {drawerItems.map((item) => (
          <CustomDrawerItem
            key={item.route}
            icon={
              <Ionicons 
                name={item.iconName} 
                size={24} 
                color={pathname === item.route ? '#4A6FFF' : '#666666'} 
              />
            }
            label={item.label}
            route={item.route}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <View style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF5252" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const AppLayout = () => {
  const screenOptions = {
    headerStyle: {
      backgroundColor: "#4A6FFF",
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerTitle: "GymGenius",
    headerTitleAlign: "center",
    drawerStyle: { width: "85%" },
    swipeEdgeWidth: 100,
  };

  return (
    <Drawer
      screenOptions={screenOptions}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" />
      <Drawer.Screen name="MyPlansScreen" />
      <Drawer.Screen name="UserList" />
      <Drawer.Screen name="UserRegister" />
    </Drawer>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
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
  drawerContent: {
    flex: 1,
    paddingTop: 9,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5252',
    fontWeight: '600',
  }
});
