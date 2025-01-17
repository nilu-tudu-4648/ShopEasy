import { Stack } from "expo-router";

export default function AuthLayout() {
  const options = {
    headerShown: false,
    gestureEnabled: false,
  }
  return (
    <Stack
      screenOptions={options}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen
        name="SignupScreen"
        options={options}
      />
      <Stack.Screen
        name="LoginScreen"
        options={options}
      />
      <Stack.Screen
        name="OtpScreen"
        options={options}
      />
    </Stack>
  );
}
