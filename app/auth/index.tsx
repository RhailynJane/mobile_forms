import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="lock-closed"
          size={80}
          color="#007bff"
          style={styles.icon}
        />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Employee Management System</Text>
        <Text style={styles.description}>
          Manage your employees efficiently with our comprehensive system
        </Text>

        <Link href="/auth/signin" asChild>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.signInButton }}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/signup" asChild>
          <TouchableOpacity
            style={{ ...styles.button, ...styles.signUpButton }}
          >
            <Ionicons name="person-add-outline" size={20} color="#007bff" />
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  card: {
    marginTop: 100,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 20,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 8,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: "#007bff",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007bff",
  },
  signUpText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
