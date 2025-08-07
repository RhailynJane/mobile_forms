import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../lib/firebase";

type Employee = {
  id: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  phoneNumber: string;
  salary: string;
  employmentType: string;
  employeeId: string;
};

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const fetchEmployees = async () => {
    try {
      const snapshot = await getDocs(collection(db, "employees"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          fullName: docData.fullName ?? "",
          email: docData.email ?? "",
          department: docData.department ?? "",
          position: docData.position ?? "",
          phoneNumber: docData.phoneNumber ?? "",
          salary: docData.salary ?? "",
          employmentType: docData.employmentType ?? "",
          employeeId: docData.employeeId ?? "",
        };
      });
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const handleDeleteEmployee = (employee: Employee) => {
    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEmployee(employee.id),
        },
      ]
    );
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(employeeId));

      await deleteDoc(doc(db, "employees", employeeId));

      // Remove from local state
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));

      Alert.alert("Success", "Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Error", "Failed to delete employee. Please try again.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    }
  };

  const renderEmployeeCard = ({ item }: { item: Employee }) => {
    const isDeleting = deletingIds.has(item.id);

    return (
      <View style={[styles.employeeCard, isDeleting && styles.cardDeleting]}>
        <View style={styles.cardHeader}>
          <View style={styles.nameSection}>
            <Text style={styles.employeeName}>{item.fullName}</Text>
            <Text style={styles.employeeId}>ID: {item.employeeId}</Text>
          </View>
          <View style={styles.cardActions}>
            <View
              style={[
                styles.employmentTypeBadge,
                item.employmentType === "Full-Time"
                  ? styles.fullTimeBadge
                  : styles.partTimeBadge,
              ]}
            >
              <Text
                style={[
                  styles.employmentTypeText,
                  item.employmentType === "Full-Time"
                    ? styles.fullTimeText
                    : styles.partTimeText,
                ]}
              >
                {item.employmentType}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteEmployee(item)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#dc3545" />
              ) : (
                <Ionicons name="trash-outline" size={18} color="#dc3545" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.position}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.department}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.salaryText}>
              ${parseInt(item.salary).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Employee Directory</Text>
          <Text style={styles.subtitle}>{employees.length} employees</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="person-add-outline" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>

      {employees.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No employees found</Text>
          <Text style={styles.emptySubtext}>
            Add your first employee to get started
          </Text>
          <TouchableOpacity
            style={styles.addEmployeeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.addEmployeeButtonText}>Add Employee</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={renderEmployeeCard}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  addEmployeeButton: {
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEmployeeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  employeeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDeleting: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  employeeId: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  employmentTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullTimeBadge: {
    backgroundColor: "#e3f2fd",
  },
  partTimeBadge: {
    backgroundColor: "#fff3e0",
  },
  employmentTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  fullTimeText: {
    color: "#1976d2",
  },
  partTimeText: {
    color: "#f57c00",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fcc",
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  salaryText: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
    flex: 1,
  },
});
