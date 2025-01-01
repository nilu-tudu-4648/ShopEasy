import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, Colors } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { setUser } from '@/store/reducers/authReducer';

const { width, height } = Dimensions.get('window');

Colors.loadColors({
  primary: '#4A6FFF',
  secondary: '#6B8AFF',
  textGrey: '#666666',
  backgroundGrey: '#F8FAFC',
  cardBg: '#FFFFFF',
  success: '#4CAF50',
  error: '#FF5252',
  accent: '#FFB74D'
});

const SelectPlanScreen = () => {
  const {loggedUser} = useSelector((state) => state.entities.authReducer);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const plans = [
    {
      id: 'premium',
      name: 'Premium Monthly',
      price: 29.99,
      features: [
        { icon: 'clock-check', text: 'Unlimited Hours' },
        { icon: 'map-marker-multiple', text: 'All Locations' },
        { icon: 'star', text: 'Priority Booking' },
        { icon: 'desk', text: 'Reserved Seating' },
        { icon: 'wifi', text: 'High-Speed WiFi' }
      ],
      color: Colors.primary,
      recommended: true
    },
    {
      id: 'basic',
      name: 'Basic Monthly',
      price: 19.99,
      features: [
        { icon: 'clock', text: '40 Hours/Month' },
        { icon: 'map-marker', text: 'Main Location Only' },
        { icon: 'bookmark', text: 'Standard Booking' },
        { icon: 'desk', text: 'Open Seating' },
        { icon: 'wifi', text: 'Standard WiFi' }
      ],
      color: Colors.accent,
      recommended: false
    }
  ];

  const handlePlanSelection = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan to continue');
      return;
    }

    try {
      setLoading(true);
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      const userId = loggedUser.user.uid;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      const planUpdate = {
        plan: {
          name: selectedPlanData.name,
          price: selectedPlanData.price,
          hoursTotal: selectedPlanData.id === 'premium' ? Infinity : 40,
          hoursUsed: 0,
          features: selectedPlanData.features,
          startDate: serverTimestamp(),
          endDate: Timestamp.fromDate(endDate),
          status: 'active',
          autoRenew: true
        },
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'users', userId), planUpdate);

      // Update local user data
      const updatedUserData = {
        ...loggedUser,
        user: {
          ...loggedUser.user,
          plan: {
            ...planUpdate.plan,
            startDate: now,
            endDate: endDate
          }
        }
      };

      dispatch(setUser(updatedUserData));
      router.replace('/(app)/HomeScreen');

    } catch (error) {
      console.error('Plan selection error:', error);
      Alert.alert(
        'Error',
        'Failed to select plan. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#4A6FFF', '#83B9FF']} style={styles.gradient}>
        <ScrollView 
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Choose Your Plan</Text>
            <Text style={styles.headerSubtitle}>
              Select the plan that best fits your study needs
            </Text>
          </View>

          <View style={styles.content}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                <Card style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedCard
                ]}>
                  { (
                    <View style={[styles.recommendedBadge, { backgroundColor: plan.color + '15' }]}>
                      {plan.recommended ? <Icon name="star" size={16} color={plan.color} /> : null}
                      <Text style={[styles.recommendedText, { color: plan.color }]}>
                        {plan.recommended ? 'Recommended' : ''}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={[styles.planPrice, { color: plan.color }]}>
                      ${plan.price}
                    </Text>
                  </View>
                  
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: plan.color + '15' }]}>
                          <Icon name={feature.icon} size={20} color={plan.color} />
                        </View>
                        <Text style={styles.featureText}>{feature.text}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[
                    styles.selectionIndicator,
                    { borderColor: plan.color },
                    selectedPlan === plan.id && { backgroundColor: plan.color }
                  ]}>
                    {selectedPlan === plan.id && (
                      <Icon name="check" size={20} color="white" />
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.continueButton,
                (!selectedPlan || loading) && styles.disabledButton
              ]}
              onPress={handlePlanSelection}
              disabled={!selectedPlan || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingVertical: height * 0.04,
  },
  headerContent: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.84,
    elevation: 5,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 4,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textGrey,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  featuresList: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: Colors.textGrey,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectPlanScreen;