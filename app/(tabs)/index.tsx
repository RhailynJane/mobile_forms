import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { db } from "../../lib/firebase";

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name must not exceed 50 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  employeeId: Yup.string()
    .required("Employee ID is required")
    .matches(
      /^EMP[0-9]{3,6}$/,
      "Employee ID must be in format EMP followed by 3-6 digits"
    ),
  department: Yup.string()
    .required("Department is required")
    .min(2, "Department must be at least 2 characters"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  position: Yup.string()
    .required("Position is required")
    .min(2, "Position must be at least 2 characters"),
  salary: Yup.number()
    .required("Salary is required")
    .positive("Salary must be positive")
    .min(20000, "Salary must be at least $20,000"),
});

export default function EmployeeForm() {
  const [isFullTime, setIsFullTime] = useState(false);

  const checkForDuplicates = async (email: string, employeeId: string) => {
    try {
      // Check for duplicate email
      const emailQuery = query(
        collection(db, "employees"),
        where("email", "==", email)
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        return {
          isDuplicate: true,
          field: "email",
          message: "Email already exists",
        };
      }

      // Check for duplicate employee ID
      const idQuery = query(
        collection(db, "employees"),
        where("employeeId", "==", employeeId)
      );
      const idSnapshot = await getDocs(idQuery);

      if (!idSnapshot.empty) {
        return {
          isDuplicate: true,
          field: "employeeId",
          message: "Employee ID already exists",
        };
      }

      return { isDuplicate: false, field: null, message: null };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      throw error;
    }
  };

  const handleSubmit = async (
    values: {
      fullName: string;
      email: string;
      employeeId: string;
      department: string;
      phoneNumber: string;
      position: string;
      salary: string;
    },
    {
      resetForm,
      setFieldError,
    }: import("formik").FormikHelpers<{
      fullName: string;
      email: string;
      employeeId: string;
      department: string;
      phoneNumber: string;
      position: string;
      salary: string;
    }>
  ) => {
    try {
      // Check for duplicates before saving
      const duplicateCheck = await checkForDuplicates(
        values.email,
        values.employeeId
      );

      if (duplicateCheck.isDuplicate) {
        setFieldError(duplicateCheck.field!, duplicateCheck.message!);
        Alert.alert("Duplicate Found", duplicateCheck.message!);
        return;
      }

      const employeeData = {
        ...values,
        employmentType: isFullTime ? "Full-Time" : "Part-Time",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "employees"), employeeData);

      Alert.alert("Success", "Employee information saved successfully!", [
        {
          text: "Add More Employee",
          onPress: () => {
            resetForm();
            setIsFullTime(false);
          },
        },
        {
          text: "View Employees",
          onPress: () => {
            resetForm();
            setIsFullTime(false);
            router.push("/employees");
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save employee data.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Ionicons
            name="briefcase"
            size={60}
            color="#007bff"
            style={styles.icon}
          />
          <Text style={styles.title}>Employee Information</Text>
          <Text style={styles.subtitle}>Enter the employee details below:</Text>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              employeeId: "",
              department: "",
              phoneNumber: "",
              position: "",
              salary: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                {[
                  {
                    name: "fullName",
                    icon: "person-outline",
                    placeholder: "Full Name",
                  },
                  {
                    name: "email",
                    icon: "mail-outline",
                    placeholder: "Email",
                    keyboardType: "email-address",
                  },
                  {
                    name: "employeeId",
                    icon: "id-card-outline",
                    placeholder: "Employee ID (e.g., EMP123)",
                  },
                  {
                    name: "department",
                    icon: "business-outline",
                    placeholder: "Department",
                  },
                  {
                    name: "phoneNumber",
                    icon: "call-outline",
                    placeholder: "Phone Number",
                    keyboardType: "phone-pad",
                  },
                  {
                    name: "position",
                    icon: "briefcase-outline",
                    placeholder: "Position",
                  },
                  {
                    name: "salary",
                    icon: "cash-outline",
                    placeholder: "Salary",
                    keyboardType: "numeric",
                  },
                ].map(({ name, icon, placeholder, keyboardType }) => (
                  <View key={name}>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name={icon as any}
                        size={20}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        onChangeText={handleChange(name)}
                        onBlur={handleBlur(name)}
                        value={values[name as keyof typeof values]}
                        keyboardType={keyboardType as any}
                      />
                    </View>
                    {errors[name as keyof typeof errors] &&
                      touched[name as keyof typeof touched] && (
                        <Text style={styles.errorText}>
                          {errors[name as keyof typeof errors]}
                        </Text>
                      )}
                  </View>
                ))}

                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Employment Type:</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      isFullTime && styles.toggleButtonActive,
                    ]}
                    onPress={() => setIsFullTime(!isFullTime)}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        isFullTime && styles.toggleTextActive,
                      ]}
                    >
                      {isFullTime ? "Full-Time" : "Part-Time"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleSubmit()}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.submitButtonText}>Save Employee</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  toggleButton: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  toggleText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
