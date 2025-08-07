import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Authentication",
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          headerShown: true,
          title: "Sign In",
          headerStyle: {
            backgroundColor: "#007bff",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          title: "Sign Up",
          headerStyle: {
            backgroundColor: "#007bff",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
