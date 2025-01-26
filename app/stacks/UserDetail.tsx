
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import AppToast from "../../components/AppToast";
import { formatTime } from "../../constants/helperFunc";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { User } from "@/constants/types";

const UserDetailScreen: React.FC = () => {
  const { user } = useLocalSearchParams();
  const [userData, setUserData] = useState<User | null>(JSON.parse(user as string));
  const { width } = useWindowDimensions();
  const imageSize = width * 0.35;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = async (newValue: string) => {
    try {
      if (!userData) return;
      await updateDoc(doc(db, "users", userData.id), {
        [editingField as string]: newValue,
      });
      AppToast.show("Updated successfully");
      setUserData(prevUserData => {
        if (!prevUserData) return null;
        return {
          ...prevUserData,
          [editingField as string]: newValue,
        };
      });
      setEditingField(null);
    } catch (error) {
      console.error("Error updating user:", error);
      AppToast.show("Failed to update user");
    }
  };

  const DetailRow: React.FC<{
    label: string;
    value: string;
    field?: string;
    editable?: boolean;
    icon?: string;
  }> = ({ label, value, field, editable = true, icon }) => (
    <View style={styles.detailRow}>
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color="#4A6FFF" />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      {editingField === field ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            autoFocus
            onSubmitEditing={() => handleEdit(editValue)}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (editable && field) {
              setEditingField(field);
              setEditValue(value);
            }
          }}
          disabled={!editable}
        >
          <Text style={[styles.value, editable && styles.editableValue]}>
            {value}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const router = useRouter();

  useEffect(() => {
    const backHandler = () => {
      router.push("/UserList");
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      backSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        keyboardShouldPersistTaps="always" 
        style={styles.container}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#4A6FFF', '#77A5FF']}
          style={styles.header}
        >
          <View
            style={[
              styles.imageContainer,
              { width: imageSize, height: imageSize },
            ]}
          >
            <View style={styles.placeholderContainer}>
              <Ionicons name="person" size={imageSize/2} color="#FFF" />
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: userData?.status === "active" ? "#4CAF50" : "#FF5252" }]} />
              <Text style={styles.userStatus}>
                {userData?.status}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={22} color="#4A6FFF" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <DetailRow 
              label="Email" 
              value={userData?.email || ''} 
              field="email"
              icon="mail-outline" 
            />
            <DetailRow
              label="Phone"
              value={userData?.phone || "Not set"}
              field="phone"
              icon="call-outline"
            />
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={22} color="#4A6FFF" />
              <Text style={styles.sectionTitle}>Plan Details</Text>
            </View>
            <DetailRow
              label="Plan"
              value={userData?.plan?.name || "No Plan"}
              editable={false}
              icon="bookmark-outline"
            />
            <DetailRow
              label="Visits"
              value={String(userData?.visits || 0)}
              editable={false}
              icon="walk-outline"
            />
            <DetailRow
              label="Join Date"
              value={userData?.joinDate ? formatTime.formatDate(userData.joinDate) : "Not set"}
              editable={false}
              icon="calendar-outline"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  imageContainer: {
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  userStatus: {
    fontSize: 14,
    color: "#FFF",
    textTransform: "capitalize",
  },
  cardsContainer: {
    padding: 16,
    marginTop: -30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#4A6FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(74,111,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  editableValue: {
    color: "#4A6FFF",
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#4A6FFF",
    borderRadius: 8,
    padding: 8,
    textAlign: "right",
    color: "#333",
    backgroundColor: "#f8f9ff",
  },
});

export default UserDetailScreen;
