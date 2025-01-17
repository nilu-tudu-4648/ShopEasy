import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  View,
  Text,
  Card,
  Button,
  Colors,
  Dialog,
  TextField,
  PanningProvider
} from 'react-native-ui-lib';
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
  accent: '#FFB74D',
  gold: '#FFD700'
});

const MyPlansScreen = () => {
  const { loggedUser } = useSelector((state) => state.entities.authReducer);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editedPlan, setEditedPlan] = useState({
    name: '',
    price: '',
    features: []
  });
  const [gymStats, setGymStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    revenue: 0,
    premiumMembers: 0,
    basicMembers: 0,
    goldMembers: 0
  });

  const [plans, setPlans] = useState([
    {
      name: 'Gold Membership',
      price: '$49.99',
      features: [
        { icon: 'crown', text: 'VIP Access' },
        { icon: 'dumbbell', text: '24/7 Gym Access' },
        { icon: 'account-supervisor', text: 'Personal Training' },
        { icon: 'star', text: 'All Classes' },
        { icon: 'spa', text: 'Spa & Sauna' }
      ],
      memberCount: 0,
      color: Colors.gold
    },
    {
      name: 'Premium Membership', 
      price: '$29.99',
      features: [
        { icon: 'dumbbell', text: 'Full Gym Access' },
        { icon: 'account-supervisor', text: 'Personal Training' },
        { icon: 'star', text: 'Group Classes' },
        { icon: 'shower', text: 'Locker Room Access' },
        { icon: 'water', text: 'Swimming Pool' }
      ],
      memberCount: 0,
      color: Colors.primary
    },
    {
      name: 'Basic Membership',
      price: '$19.99', 
      features: [
        { icon: 'dumbbell', text: 'Basic Gym Access' },
        { icon: 'clock', text: 'Limited Hours' },
        { icon: 'account-group', text: 'Group Classes' },
        { icon: 'shower', text: 'Basic Amenities' },
        { icon: 'lock', text: 'No Pool Access' }
      ],
      memberCount: 0,
      color: Colors.accent
    }
  ]);

  useEffect(() => {
    if (loggedUser?.user?.gymData) {
      const gymData = loggedUser.user.gymData;
      
      setGymStats({
        totalMembers: gymData.totalMembers || 0,
        activeMembers: gymData.activeMembers || 0,
        revenue: gymData.monthlyRevenue || 0,
        premiumMembers: gymData.premiumMembers || 0,
        basicMembers: gymData.basicMembers || 0,
        goldMembers: gymData.goldMembers || 0
      });

      // Update member counts in plans
      setPlans(prevPlans => prevPlans.map(plan => {
        if (plan.name === 'Gold Membership') {
          return {...plan, memberCount: gymData.goldMembers || 0};
        } else if (plan.name === 'Premium Membership') {
          return {...plan, memberCount: gymData.premiumMembers || 0};
        } else if (plan.name === 'Basic Membership') {
          return {...plan, memberCount: gymData.basicMembers || 0};
        }
        return plan;
      }));
    }
  }, [loggedUser]);

  const handlePlanManage = async (plan) => {
    setSelectedPlan(plan);
    setEditedPlan({
      name: plan.name,
      price: plan.price,
      features: [...plan.features]
    });
    setShowDialog(true);
  };

  const handleSaveChanges = () => {
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.name === selectedPlan.name ? {
          ...plan,
          name: editedPlan.name,
          price: editedPlan.price,
          features: editedPlan.features
        } : plan
      )
    );
    setShowDialog(false);
  };

  const calculateMembershipPercentage = (memberCount) => {
    return Math.round((memberCount / gymStats.totalMembers) * 100) || 0;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Membership Plans Overview */}
        <Text style={styles.sectionTitle}>Membership Plans Overview</Text>
        {plans.map((plan, index) => (
          <Card key={index} style={styles.planCard}>
            <View style={[styles.planBadge, { backgroundColor: plan.color + '15' }]}>
              <Text style={[styles.planBadgeText, { color: plan.color }]}>
                {plan.memberCount} Members
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

            <View style={styles.membershipStats}>
              <Text style={styles.membershipText}>
                {calculateMembershipPercentage(plan.memberCount)}% of total members
              </Text>
              <View style={styles.usageBar}>
                <View 
                  style={[
                    styles.usageProgress, 
                    { 
                      backgroundColor: plan.color,
                      width: `${calculateMembershipPercentage(plan.memberCount)}%`
                    }
                  ]} 
                />
              </View>
            </View>
            
            <Button
              label="Edit Plan"
              backgroundColor={plan.color}
              style={styles.selectButton}
              labelStyle={styles.buttonLabel}
              onPress={() => handlePlanManage(plan)}
            />
          </Card>
        ))}
      </View>

      <Dialog
        visible={showDialog}
        onDismiss={() => setShowDialog(false)}
        panDirection={PanningProvider.Directions.DOWN}
      >
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>Edit Plan</Text>
          
          <TextField
            placeholder="Plan Name"
            value={editedPlan.name}
            onChangeText={(text) => setEditedPlan({...editedPlan, name: text})}
            style={styles.input}
          />
          
          <TextField
            placeholder="Price"
            value={editedPlan.price}
            onChangeText={(text) => setEditedPlan({...editedPlan, price: text})}
            style={styles.input}
          />

          {editedPlan.features.map((feature, index) => (
            <View key={index} style={styles.featureInput}>
              <TextField
                placeholder="Feature Text"
                value={feature.text}
                onChangeText={(text) => {
                  const newFeatures = [...editedPlan.features];
                  newFeatures[index].text = text;
                  setEditedPlan({...editedPlan, features: newFeatures});
                }}
                style={styles.input}
              />
            </View>
          ))}

          <View style={styles.dialogButtons}>
            <Button
              label="Cancel"
              outline
              onPress={() => setShowDialog(false)}
              style={styles.dialogButton}
            />
            <Button
              label="Save Changes"
              backgroundColor={Colors.primary}
              onPress={handleSaveChanges}
              style={styles.dialogButton}
            />
          </View>
        </View>
      </Dialog>
    </ScrollView>
  );
};

export default MyPlansScreen;

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
    marginVertical: 8,
  },
  usageProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  membershipStats: {
    marginTop: 16,
  },
  membershipText: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 4,
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
  },
  dialogContent: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textGrey,
  },
  input: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
  },
  featureInput: {
    marginBottom: 12,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dialogButton: {
    flex: 1,
    marginHorizontal: 8,
  }
});