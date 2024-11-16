import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "@/store/reducers/authReducer";
export default function Index() {
const [initialized, setInitialized] = useState(false);
  const dispatch = useDispatch();
  const {loggedUser} = useSelector((state) => state.entities.authReducer)
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
  }, [loggedUser]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const route = loggedUser ? '/(app)/HomeScreen' : '/(auth)/LoginScreen';
  
  return <Redirect href={route} />;
}
