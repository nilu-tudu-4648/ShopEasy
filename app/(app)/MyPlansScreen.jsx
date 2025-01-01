import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  View,
  Text,
  Card,
  Button,
  Colors,
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

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

export default MyPlansScreen = () => {
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  console.log(JSON.stringify(loggedUser, null, 2));
  const [userStats, setUserStats] = useState({
    hoursLeft: 0,
    daysLeft: 0,
    totalStudyTime: 0,
    visits: 0,
    currentPlan: null,
    planExpiry: null
  });

  useEffect(() => {
    if (loggedUser?.user?.plan) {
      const plan = loggedUser.user.plan;
      const hoursLeft = plan.hoursTotal - plan.hoursUsed;
      const today = new Date();
      
      // Handle the endDate from Firestore timestamp
      const endDate = plan.endDate ? new Date(plan.endDate) : null;
      const daysLeft = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : 0;

      setUserStats({
        hoursLeft: Math.max(0, Math.round(hoursLeft || 0)),
        daysLeft: Math.max(0, daysLeft),
        totalStudyTime: loggedUser.user.totalStudyTime || 0,
        visits: loggedUser.user.visits || 0,
        currentPlan: plan.name || 'No Active Plan',
        planExpiry: endDate ? endDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }) : 'Not Started'
      });
    }
  }, [loggedUser]);

  const plans = [
    {
      name: 'Premium Monthly',
      price: '$29.99',
      features: [
        { icon: 'clock-check', text: 'Unlimited Hours' },
        { icon: 'map-marker-multiple', text: 'All Locations' },
        { icon: 'star', text: 'Priority Booking' },
        { icon: 'desk', text: 'Reserved Seating' },
        { icon: 'wifi', text: 'High-Speed WiFi' }
      ],
      current: loggedUser?.user?.plan?.name === 'Premium Monthly',
      color: Colors.primary
    },
    {
      name: 'Basic Monthly',
      price: '$19.99',
      features: [
        { icon: 'clock', text: '40 Hours/Month' },
        { icon: 'map-marker', text: 'Main Location Only' },
        { icon: 'bookmark', text: 'Standard Booking' },
        { icon: 'desk', text: 'Open Seating' },
        { icon: 'wifi', text: 'Standard WiFi' }
      ],
      current: loggedUser?.user?.plan?.name === 'Basic Monthly',
      color: Colors.accent
    }
  ];

  const handlePlanSelect = async (planName) => {
    // TODO: Implement plan selection logic
    console.log('Selected plan:', planName);
  };

  const calculateUsagePercentage = () => {
    const hoursUsed = loggedUser?.user?.plan?.hoursUsed || 0;
    const hoursTotal = loggedUser?.user?.plan?.hoursTotal || 1;
    return Math.min((hoursUsed / hoursTotal) * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4A6FFF', '#83B9FF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Plans</Text>
          <Text style={styles.headerSubtitle}>Manage your subscription</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.hoursLeft}</Text>
              <Text style={styles.statLabel}>Hours Left</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.daysLeft}</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Current Plan Card */}
        <View style={styles.currentPlanSection}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <Card style={styles.currentPlanCard}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{userStats.currentPlan}</Text>
                <Text style={styles.planExpiry}>Active until {userStats.planExpiry}</Text>
              </View>
              <Text style={styles.planPrice}>
                {loggedUser?.user?.plan?.price 
                  ? `$${loggedUser.user.plan.price}` 
                  : 'N/A'
                }
              </Text>
            </View>
            <View style={styles.usageBar}>
              <View 
                style={[
                  styles.usageProgress, 
                  { width: `${calculateUsagePercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.usageText}>
              {userStats.hoursLeft} hours remaining this month
            </Text>
          </Card>
        </View>

        {/* Available Plans */}
        <Text style={styles.sectionTitle}>Available Plans</Text>
        {plans.map((plan, index) => (
          <Card key={index} style={styles.planCard}>
            <View style={[styles.planBadge, { backgroundColor: plan.color + '15' }]}>
              <Text style={[styles.planBadgeText, { color: plan.color }]}>
                {plan.current ? 'Current Plan' : 'Available'}
              </Text>
            </View>
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
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
            
            {!plan.current && (
              <Button
                label="Select Plan"
                backgroundColor={plan.color}
                style={styles.selectButton}
                labelStyle={styles.buttonLabel}
                onPress={() => handlePlanSelect(plan.name)}
              />
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGrey,
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
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textGrey,
    marginBottom: 16,
  },
  currentPlanCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginBottom: 24,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  planBadgeText: {
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
  planExpiry: {
    fontSize: 14,
    color: Colors.textGrey,
    marginTop: 4,
  },
  usageBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginVertical: 16,
  },
  usageProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  usageText: {
    fontSize: 14,
    color: Colors.textGrey,
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
  selectButton: {
    height: 48,
    borderRadius: 24,
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});