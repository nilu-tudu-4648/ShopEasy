import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebase/firebaseConfig";

export default function Index() {
  const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.entities.authReducer.loggedUser);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Listen to auth state changes
        // const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {

        // });

        // Restore user from AsyncStorage on app load
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          console.log(user,'initapp')
          dispatch(setUser(user));
        }

        // Cleanup auth listener on unmount
        // return () => unsubscribeAuth();
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const route = loggedUser ? "/(app)/HomeScreen" : "/(auth)/LoginScreen";

  return <Redirect href={route} />;
}
