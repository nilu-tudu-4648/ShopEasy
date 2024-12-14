import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Phone, Mail, Info, MessageCircle, Clock, ArrowRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const HelpSupportScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4A6FFF", "#83B9FF"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>How can we help you today?</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Help Options */}
        <View style={styles.quickHelp}>
          <TouchableOpacity style={styles.quickHelpItem}>
            <View style={[styles.iconContainer, { backgroundColor: "#4A6FFF15" }]}>
              <MessageCircle size={24} color="#4A6FFF" />
            </View>
            <Text style={styles.quickHelpText}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickHelpItem}>
            <View style={[styles.iconContainer, { backgroundColor: "#4CAF5015" }]}>
              <Clock size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickHelpText}>Support Hours</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Options */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactOptions}>
          <TouchableOpacity style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: "#4A6FFF15" }]}>
              <Phone size={24} color="#4A6FFF" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>+1 (123) 456-7890</Text>
              <Text style={styles.contactHours}>Mon-Fri, 9AM-6PM</Text>
            </View>
            <ArrowRight size={20} color="#66666680" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: "#FF525215" }]}>
              <Mail size={24} color="#FF5252" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@driveLoop.com</Text>
              <Text style={styles.contactHours}>24/7 Support</Text>
            </View>
            <ArrowRight size={20} color="#66666680" />
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Common Questions</Text>
        <View style={styles.faqContainer}>
          {[
            {
              question: "What are the library hours?",
              answer: "Our library is open from 9AM to 9PM on weekdays, and 10AM to 6PM on weekends."
            },
            {
              question: "How do I extend my study time?",
              answer: "You can extend your study time through the app or by visiting the front desk."
            },
            {
              question: "Can I reserve a specific table?",
              answer: "Premium members can reserve tables up to 24 hours in advance."
            }
          ].map((faq, index) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <View style={styles.faqIcon}>
                <Info size={20} color="#4A6FFF" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  quickHelp: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickHelpItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: "#1A1A1A10",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickHelpText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 16,
  },
  contactOptions: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#1A1A1A10",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactIcon: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  contactHours: {
    fontSize: 12,
    color: "#66666680",
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#1A1A1A10",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A6FFF10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});

export default HelpSupportScreen;