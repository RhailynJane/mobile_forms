import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Yup from "yup";
import { auth } from "../../lib/firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function SignInScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  interface SignInFormValues {
    email: string;
    password: string;
  }

  const handleSignIn = async (values: SignInFormValues) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in with:", values.email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log("Sign in successful:", userCredential.user.email);

      // Navigate manually to ensure it works
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Sign in error:", error);
      Alert.alert(
        "Sign In Error",
        error.message || "An error occurred during sign in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Ionicons
              name="log-in"
              size={60}
              color="#007bff"
              style={styles.icon}
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignIn}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Email Address"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Password"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      style={styles.input}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <View style={styles.optionsContainer}>
                    <BouncyCheckbox
                      size={20}
                      fillColor="#007bff"
                      unfillColor="#FFFFFF"
                      text="Remember me"
                      isChecked={rememberMe}
                      onPress={() => setRememberMe(!rememberMe)}
                      textStyle={styles.checkboxText}
                    />
                    <TouchableOpacity>
                      <Text style={styles.forgotPassword}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      loading && styles.submitButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    minHeight: 600, // Minimum height to ensure content is accessible
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  checkboxText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "none",
  },
  forgotPassword: {
    color: "#007bff",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20, // Add margin for better spacing
  },
  submitButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
