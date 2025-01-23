import React, { useEffect, useState } from 'react';
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
  Animated,
} from 'react-native';
import { Card, Colors } from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc, serverTimestamp, Timestamp, collection, getDocs } from 'firebase/firestore';
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
  const [plans, setPlans] = useState([]);
  const [scaleAnim] = useState(new Animated.Value(1));

  const getPlans = async () => {
    try {
      const plansRef = collection(db, 'plans');
      const plansSnapshot = await getDocs(plansRef);
      const plansData = plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlans(plansData);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlanSelection = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan to continue');
      return;
    }

    try {
      setLoading(true);
      animatePress();
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
      <LinearGradient 
        colors={['#4A6FFF', '#83B9FF']} 
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
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
              <Animated.View
                key={plan.id}
                style={[
                  {transform: [{scale: selectedPlan === plan.id ? scaleAnim : 1}]},
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPlan(plan.id);
                    animatePress();
                  }}
                  activeOpacity={0.9}
                >
                  <Card style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedCard
                  ]}>
                    <View style={[styles.recommendedBadge, { backgroundColor: plan.color + '15' }]}>
                      {plan.recommended && (
                        <>
                          <Icon name="star" size={16} color={plan.color} />
                          <Text style={[styles.recommendedText, { color: plan.color }]}>
                            Recommended
                          </Text>
                        </>
                      )}
                    </View>
                    
                    <View style={styles.planHeader}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={[styles.planPrice, { color: plan.color }]}>
                        ₹{plan.price}
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
              </Animated.View>
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
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Continue</Text>
                  <Icon name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
                </>
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
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
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
    flex: 1,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  }
});

export default SelectPlanScreen;