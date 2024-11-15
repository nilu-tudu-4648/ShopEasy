import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#4B7BF5' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="SignupScreen" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="OtpScreen" />
      </Stack>
    );
  }