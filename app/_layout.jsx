import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "@/store/configureStore";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "@/store/reducers/authReducer";

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const [initialized, setInitialized] = useState(false);
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          if (user) {
            dispatch(setUser(user));
          }
        }
      } catch (error) {
        console.error("Error reading user from storage:", error);
      } finally {
        setInitialized(true);
      }
    };
    initializeApp();
  }, []);

  if (!initialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!loggedUser ? (
        // Auth Stack Group
        <>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </>
      ) : (
        // App Stack Group
        <>
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          
        </>
      )}
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn("Error hiding splash screen:", error);
        }
      };

      // const timer = setTimeout(hideSplash, 3000);
      // return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RootLayoutNav />
        </ThemeProvider>
      </Provider>
    </SafeAreaView>
  );
}
