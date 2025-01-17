import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Checkbox } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "@/store/reducers/authReducer";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: "Nilesh",
    email: "tudunilesh3@gmail.com",
    phone: "9155186701",
    password: "Apple4648@",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Password validation helper
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      requirements: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
      },
    };
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password =
        "Password must contain at least:\n• 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Update the handleSignup function in SignupScreen
const handleSignup = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    setLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email.trim(),
      formData.password
    );

    const userDoc = {
      uid: userCredential.user.uid,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      userType: 'user',
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
        status: 'pending',
        autoRenew: true
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
          preferredRoom: null
        }
      },

      // Initialize billing information
      billing: {
        customerId: null,
        subscriptionId: null,
        paymentMethod: null,
        billingHistory: []
      }
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

    const userData = {
      user: {
        ...userDoc,
        id: userCredential.user.uid,
      }
    };

    await AsyncStorage.setItem('user', JSON.stringify(userData));
    dispatch(setUser(userData));
    
    // Navigate to plan selection instead of home
    router.replace({
      pathname: "/(auth)/SelectPlanScreen",
      params: { 
        userId: userCredential.user.uid,
        userData: userData.user
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    Alert.alert(
      'Registration Failed',
      error.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Please try signing in.'
        : 'An error occurred during registration. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  const PasswordRequirements = () => {
    const reqs = validatePassword(formData.password).requirements;
    return (
      <View style={styles.passwordRequirements}>
        {Object.entries(reqs).map(([key, met]) => (
          <View key={key} style={styles.requirementRow}>
            <View style={[styles.dot, met ? styles.dotMet : styles.dotUnmet]} />
            <Text
              style={[
                styles.requirementText,
                met ? styles.reqMet : styles.reqUnmet,
              ]}
            >
              {key === "minLength" && "8 characters minimum"}
              {key === "hasUpper" && "One uppercase letter"}
              {key === "hasLower" && "One lowercase letter"}
              {key === "hasNumber" && "One number"}
              {key === "hasSpecial" && "One special character"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  Join GymGenius to manage your gym workouts efficiently
                </Text>
              </View>

              <InputField
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) {
                    setErrors({ ...errors, name: null });
                  }
                }}
                error={errors.name}
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <InputField
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
                error={errors.email}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <InputField
                label="Phone Number"
                icon="call-outline"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  if (cleaned.length <= 10) {
                    setFormData({ ...formData, phone: cleaned });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: null });
                    }
                  }
                }}
                error={errors.phone}
                maxLength={10}
                returnKeyType="next"
                blurOnSubmit={false}
              />

              <InputField
                label="Password"
                icon="lock-closed-outline"
                placeholder="Create password"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
                error={errors.password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                returnKeyType="done"
                blurOnSubmit={true}
              />

              {formData.password.length > 0 && <PasswordRequirements />}

              <View style={styles.termsContainer}>
                <Checkbox
                  style={[
                    styles.checkbox,
                    errors.terms && styles.checkboxError,
                  ]}
                  color="#4A6FFF"
                  value={acceptTerms}
                  onValueChange={(value) => {
                    setAcceptTerms(value);
                    if (errors.terms) {
                      setErrors({ ...errors, terms: null });
                    }
                  }}
                />
                <Text style={styles.termsText}>
                  I accept the{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  (!acceptTerms || loading) && styles.disabledButton,
                ]}
                onPress={handleSignup}
                disabled={!acceptTerms || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.signupText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/LoginScreen")}
                  disabled={loading}
                >
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: height * 0.04,
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
  passwordRequirements: {
    marginTop: -10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  dotMet: {
    backgroundColor: "#4CAF50",
  },
  dotUnmet: {
    backgroundColor: "#FF5252",
  },
  requirementText: {
    fontSize: 12,
  },
  reqMet: {
    color: "#4CAF50",
  },
  reqUnmet: {
    color: "#666",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: height * 0.02,
    paddingRight: width * 0.05,
  },
  checkbox: {
    borderColor: "#4A6FFF",
    marginRight: width * 0.02,
    transform: [{ scale: isSmallDevice ? 0.8 : 1 }],
    marginTop: 3,
  },
  checkboxError: {
    borderColor: "#FF5252",
  },
  termsText: {
    flex: 1,
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
    lineHeight: Math.min(width * 0.05, 20),
  },
  termsLink: {
    color: "#4A6FFF",
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#4A6FFF",
    borderRadius: Math.min(width * 0.03, 12),
    height: Math.min(height * 0.07, 56),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signupText: {
    color: "white",
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.01,
  },
  loginText: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
  },
  loginLink: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#4A6FFF",
    fontWeight: "600",
  },
});

export default SignupScreen;
