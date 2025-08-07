// app/_layout.tsx
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { auth } from "../lib/firebase";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );
      setIsAuthenticated(!!user);
      setIsInitialized(true);
    });

    // Set a timeout to initialize even if Firebase takes too long
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.log("Firebase taking too long, setting to unauthenticated");
        setIsAuthenticated(false);
        setIsInitialized(true);
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isInitialized]);

  // Navigate based on auth state
  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth");
      }
    }
  }, [isAuthenticated, isInitialized]);

  // Show loading screen while checking auth state
  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
