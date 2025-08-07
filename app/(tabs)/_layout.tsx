import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { TouchableOpacity } from "react-native";
import { auth } from "../../lib/firebase";

export default function TabLayout() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007bff",
        headerStyle: {
          backgroundColor: "#007bff",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleSignOut} style={{ marginRight: 15 }}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Employee Form",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "briefcase" : "briefcase-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
