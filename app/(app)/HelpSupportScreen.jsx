import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Phone, Mail, Info } from "lucide-react-native";

const HelpSupportScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Help & Support</Text>
      
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <View style={styles.contactOptions}>
        <TouchableOpacity style={styles.contactItem}>
          <Phone size={24} color="#2563EB" />
          <Text style={styles.contactText}>Call Us</Text>
          <Text style={styles.contactDetail}>+1 (123) 456-7890</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem}>
          <Mail size={24} color="#2563EB" />
          <Text style={styles.contactText}>Email Us</Text>
          <Text style={styles.contactDetail}>support@ecommerceapp.com</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <View style={styles.faqContainer}>
        <TouchableOpacity style={styles.faqItem}>
          <Info size={24} color="#64748B" />
          <View style={styles.faqTextContainer}>
            <Text style={styles.faqQuestion}>How can I track my order?</Text>
            <Text style={styles.faqAnswer}>
              You can track your order in the Orders section under "My Orders" in your account.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <Info size={24} color="#64748B" />
          <View style={styles.faqTextContainer}>
            <Text style={styles.faqQuestion}>What is the return policy?</Text>
            <Text style={styles.faqAnswer}>
              You can return your item within 30 days of purchase if it meets our return criteria.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}>
          <Info size={24} color="#64748B" />
          <View style={styles.faqTextContainer}>
            <Text style={styles.faqQuestion}>How can I contact customer support?</Text>
            <Text style={styles.faqAnswer}>
              You can contact us via phone or email. Our details are listed above.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 20,
    marginBottom: 12,
  },
  contactOptions: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contactText: {
    fontSize: 18,
    color: "#334155",
    fontWeight: "bold",
    marginLeft: 12,
  },
  contactDetail: {
    fontSize: 16,
    color: "#64748B",
    marginLeft: 12,
  },
  faqContainer: {
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  faqTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  faqQuestion: {
    fontSize: 18,
    color: "#334155",
    fontWeight: "bold",
  },
  faqAnswer: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 4,
  },
});

export default HelpSupportScreen;
