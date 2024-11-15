import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const OtpScreen = () => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendTimer > 0) {
        setResendTimer(resendTimer - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      const user = { user: { id: 1, name: "Test User" } };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
    } catch (error) {
      console.log(error);
    }
  };
  const handleResendCode = () => {
    if (resendTimer === 0) {
      // Logic for resending OTP
      setResendTimer(30); // Reset timer
    }
  };

  const handleSignIn = () => {
    // Logic for OTP verification
    console.log("OTP Entered: ", otp);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter OTP Code</Text>
        <Text style={styles.subtitle}>
          Please enter your OTP Code sent to your email
        </Text>

        <TextInput
          style={styles.otpInput}
          placeholder="******"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendCode}
          disabled={resendTimer > 0}
          style={styles.resendContainer}
        >
          <Text style={styles.resendText}>
            Resend code? {resendTimer > 0 ? `${resendTimer}s` : 'Resend Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5887F9', // blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#5887F9',
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 15,
  },
  resendText: {
    textAlign: 'center',
    color: '#5887F9',
    fontSize: 14,
  },
});

export default OtpScreen;
