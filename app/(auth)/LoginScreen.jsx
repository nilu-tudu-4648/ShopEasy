import { setUser } from "@/store/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/InputField";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: "nilunilesh84@gmail.com",
    // email: "tudunilesh3@gmail.com",
    password: "Apple4648@",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const userData = userDoc.data();

      // Update last login time
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLoginAt: new Date(),
      });
      console.log(userData, "Login");
      // Save to local storage if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            user: {
              ...userData,
              id: userCredential.user.uid,
            },
          })
        );
      }

      // Update Redux state
      dispatch(
        setUser({
          user: {
            ...userData,
            id: userCredential.user.uid,
          },
        })
      );

      if (userData.userType === "admin") {
        router.replace("/(app)/AdminHome");
      } else {
        router.replace("/(app)/HomeScreen");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();

      // Use signInWithRedirect instead of signInWithPopup for React Native
      await signInWithRedirect(auth, provider);

      // Get the sign-in result
      const result = await getRedirectResult(auth);

      if (!result) {
        throw new Error("Google sign in failed");
      }

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        // Create new user document if first time login
        const newUser = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          phone: result.user.phoneNumber || "",
          userType: "user",
          isActive: true,
          visits: 0,
          totalStudyTime: 0,
          currentBooking: null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),

          // Initialize with empty plan
          plan: {
            name: null,
            price: null,
            hoursTotal: null,
            hoursUsed: 0,
            features: [],
            startDate: null,
            endDate: null,
            status: "pending",
            autoRenew: true,
          },

          // Initialize usage statistics
          usage: {
            currentMonthHours: 0,
            totalHours: 0,
            averageSessionLength: 0,
            lastVisit: null,
            visitHistory: [],
            favoriteLocations: [],
            preferences: {
              preferredLocation: null,
              preferredFloor: null,
              preferredRoom: null,
            },
          },
        };

        await setDoc(doc(db, "users", result.user.uid), newUser);

        dispatch(setUser({ user: { ...newUser, id: result.user.uid } }));
      } else {
        // Update existing user's last login
        await updateDoc(doc(db, "users", result.user.uid), {
          lastLoginAt: serverTimestamp(),
        });

        dispatch(
          setUser({
            user: {
              ...userDoc.data(),
              id: result.user.uid,
            },
          })
        );
      }

      router.replace("/(app)/HomeScreen");
    } catch (error) {
      console.error("Google Sign In error:", error);
      Alert.alert("Error", "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue using DeskTime
            </Text>
          </View>

          <InputField
            label="Email"
            icon="mail-outline"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            returnKeyType="next"
            blurOnSubmit={false}
          />

          <InputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            returnKeyType="done"
            blurOnSubmit
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              color="#4A6FFF"
              value={rememberMe}
              onValueChange={setRememberMe}
            />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Ionicons
                name="logo-google"
                size={Math.min(width * 0.06, 24)}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/SignupScreen")}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A6FFF",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    margin: width * 0.05,
    borderRadius: Math.min(width * 0.06, 24),
    padding: width * 0.06,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: "700",
    color: "#000",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
    textAlign: "center",
    paddingHorizontal: width * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  label: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: "500",
    color: "#000",
    marginBottom: height * 0.01,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: Math.min(width * 0.03, 12),
    paddingHorizontal: width * 0.04,
    height: Math.min(height * 0.07, 56),
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: Math.min(width * 0.04, 16),
    color: "#000",
  },
  eyeIcon: {
    padding: width * 0.02,
  },
  forgotPassword: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#4A6FFF",
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.025,
  },
  checkbox: {
    borderColor: "#4A6FFF",
    marginRight: width * 0.02,
    transform: [{ scale: isSmallDevice ? 0.8 : 1 }],
  },
  checkboxLabel: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
  },
  signInButton: {
    backgroundColor: "#4A6FFF",
    borderRadius: Math.min(width * 0.03, 12),
    height: Math.min(height * 0.07, 56),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  signInText: {
    color: "white",
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    marginHorizontal: width * 0.04,
    color: "#666",
    fontSize: Math.min(width * 0.035, 14),
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: width * 0.04,
    marginBottom: height * 0.02,
  },
  socialButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.01,
  },
  registerText: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
  },
  registerLink: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#4A6FFF",
    fontWeight: "600",
  },
});

export default LoginScreen;
