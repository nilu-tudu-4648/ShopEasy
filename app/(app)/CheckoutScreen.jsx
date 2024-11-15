import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CheckoutScreen = ({ navigation }) => {
  // State for shipping information
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Dummy total price
  const totalPrice = 99.99;

  const handlePlaceOrder = () => {
    if (address && city && state && zipCode) {
      alert("Order placed successfully!");
      // You can add navigation to an Order Confirmation screen here
      navigation.navigate("OrderConfirmationScreen");
    } else {
      alert("Please fill out all required fields.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <Text style={styles.sectionTitle}>Shipping Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={state}
        onChangeText={(text) => setState(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={(text) => setZipCode(text)}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Credit Card" && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod("Credit Card")}
        >
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "Credit Card" && styles.selectedPaymentText,
            ]}
          >
            Credit Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "PayPal" && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod("PayPal")}
        >
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "PayPal" && styles.selectedPaymentText,
            ]}
          >
            PayPal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "Cash on Delivery" && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod("Cash on Delivery")}
        >
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "Cash on Delivery" && styles.selectedPaymentText,
            ]}
          >
            Cash on Delivery
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orderSummary}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedPaymentOption: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  paymentOptionText: {
    color: "#64748B",
    fontWeight: "bold",
  },
  selectedPaymentText: {
    color: "#FFFFFF",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: "#334155",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  placeOrderButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
