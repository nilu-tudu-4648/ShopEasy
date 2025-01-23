import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import {
  View,
  Text,
  Card,
  Button,
  Colors,
  TextField,
  Dialog,
  PanningProvider,
} from 'react-native-ui-lib';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { doc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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
  const isAdmin = loggedUser?.user?.userType === 'admin';
  const [userStats, setUserStats] = useState({
    hoursLeft: 0,
    daysLeft: 0,
    totalStudyTime: 0,
    visits: 0,
    currentPlan: null,
    planExpiry: null
  });

  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    features: [
      { icon: '', text: '' },
      { icon: '', text: '' },
      { icon: '', text: '' },
      { icon: '', text: '' },
      { icon: '', text: '' }
    ],
    color: Colors.primary
  });

  const [plans, setPlans] = useState([]);
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

  useEffect(() => {
    if (loggedUser?.user?.plan && !isAdmin) {
      const plan = loggedUser.user.plan;
      const hoursLeft = plan.hoursTotal - plan.hoursUsed;
      const today = new Date();
      const isInfinite = plan.name === 'Premium Monthly';
      const endDate = plan.endDate ? new Date(plan.endDate.seconds * 1000) : null;
      const daysLeft = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : 0;

      setUserStats({
        hoursLeft: isInfinite ? 'Unlimited' : Math.max(0, Math.round(hoursLeft || 0)),
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

  const handlePlanSelect = async (planName) => {
    if (isAdmin) return;
    // TODO: Implement plan selection logic for users
    console.log('Selected plan:', planName);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan({
      ...plan,
      features: [...plan.features]
    });
  };

  const handleSavePlan = async () => {
    try {
      const updatedPlans = plans.map(p => 
        p.id === editingPlan.id ? editingPlan : p
      );
      setPlans(updatedPlans);

      const planRef = doc(db, 'plans', editingPlan.id);
      const { id, ...planData } = editingPlan;
      await updateDoc(planRef, planData);

      Alert.alert('Success', 'Plan updated successfully');
      setEditingPlan(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update plan');
      console.error(error);
    }
  };

  const handleAddPlan = async () => {
    try {
      if (!newPlan.name || !newPlan.price) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const plansRef = collection(db, 'plans');
      const docRef = await addDoc(plansRef, {
        ...newPlan,
        current: false,
        createdAt: new Date()
      });

      const addedPlan = {
        id: docRef.id,
        ...newPlan,
        current: false
      };

      setPlans([...plans, addedPlan]);

      Alert.alert('Success', 'New plan added successfully');
      setShowAddPlanDialog(false);
      setNewPlan({
        name: '',
        price: '',
        features: [
          { icon: '', text: '' },
          { icon: '', text: '' },
          { icon: '', text: '' },
          { icon: '', text: '' },
          { icon: '', text: '' }
        ],
        color: Colors.primary
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add new plan');
      console.error(error);
    }
  };

  const handleNewFeatureChange = (index, field, value) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setNewPlan({
      ...newPlan,
      features: updatedFeatures
    });
  };

  const calculateUsagePercentage = () => {
    const hoursUsed = loggedUser?.user?.plan?.hoursUsed || 0;
    const hoursTotal = loggedUser?.user?.plan?.hoursTotal || 1;
    return Math.min((hoursUsed / hoursTotal) * 100, 100);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...editingPlan.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setEditingPlan({
      ...editingPlan,
      features: updatedFeatures
    });
  };

  if (isAdmin) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#4A6FFF', '#83B9FF']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Manage Plans</Text>
            <Text style={styles.headerSubtitle}>Edit subscription plans</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Button
            label="Add New Plan"
            backgroundColor={Colors.success}
            style={styles.addButton}
            onPress={() => setShowAddPlanDialog(true)}
          />

          {plans.map((plan, index) => (
            <Card key={index} style={styles.planCard}>
              {editingPlan?.id === plan.id ? (
                <View>
                  <TextField
                    value={editingPlan.name}
                    onChangeText={name => setEditingPlan({...editingPlan, name})}
                    label="Plan Name"
                    placeholder="Enter plan name"
                  />
                  <TextField
                    value={editingPlan.price}
                    onChangeText={price => setEditingPlan({...editingPlan, price})}
                    label="Price"
                    placeholder="Enter price"
                    keyboardType="numeric"
                  />
                  {editingPlan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureEditContainer}>
                      <TextField
                        value={feature.icon}
                        onChangeText={(value) => handleFeatureChange(idx, 'icon', value)}
                        label={`Feature ${idx + 1} Icon`}
                        placeholder="Enter icon name"
                        style={styles.featureInput}
                      />
                      <TextField
                        value={feature.text}
                        onChangeText={(value) => handleFeatureChange(idx, 'text', value)}
                        label={`Feature ${idx + 1} Text`}
                        placeholder="Enter feature text"
                        style={styles.featureInput}
                      />
                    </View>
                  ))}
                  <Button
                    label="Save Changes"
                    backgroundColor={Colors.success}
                    style={styles.selectButton}
                    onPress={handleSavePlan}
                  />
                  <Button
                    label="Cancel"
                    backgroundColor={Colors.error}
                    style={styles.selectButton}
                    onPress={() => setEditingPlan(null)}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}> ₹{plan.price}</Text>
                  <View style={styles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Icon name={feature.icon} size={20} color={plan.color} />
                        <Text style={styles.featureText}>{feature.text}</Text>
                      </View>
                    ))}
                  </View>
                  <Button
                    label="Edit Plan"
                    backgroundColor={Colors.primary}
                    style={styles.selectButton}
                    onPress={() => handleEditPlan(plan)}
                  />
                </>
              )}
            </Card>
          ))}
        </View>

        <Dialog
          visible={showAddPlanDialog}
          onDismiss={() => setShowAddPlanDialog(false)}
          panDirection={PanningProvider.Directions.DOWN}
          containerStyle={{maxHeight: '90%'}}
        >
          <ScrollView>
            <View style={styles.dialogContent}>
              <Text style={styles.dialogTitle}>Add New Plan</Text>
              <TextField
                value={newPlan.name}
                onChangeText={name => setNewPlan({...newPlan, name})}
                label="Plan Name"
                placeholder="Enter plan name"
                style={styles.dialogInput}
              />
              <TextField
                value={newPlan.price}
                onChangeText={price => setNewPlan({...newPlan, price})}
                label="Price"
                placeholder="Enter price"
                keyboardType="numeric"
                style={styles.dialogInput}
              />
              {newPlan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureEditContainer}>
                  <TextField
                    value={feature.icon}
                    onChangeText={(value) => handleNewFeatureChange(idx, 'icon', value)}
                    label={`Feature ${idx + 1} Icon`}
                    placeholder="Enter icon name"
                    style={styles.featureInput}
                  />
                  <TextField
                    value={feature.text}
                    onChangeText={(value) => handleNewFeatureChange(idx, 'text', value)}
                    label={`Feature ${idx + 1} Text`}
                    placeholder="Enter feature text"
                    style={styles.featureInput}
                  />
                </View>
              ))}
              <View style={styles.dialogButtons}>
                <Button
                  label="Add Plan"
                  backgroundColor={Colors.success}
                  style={styles.dialogButton}
                  onPress={handleAddPlan}
                />
                <Button
                  label="Cancel"
                  backgroundColor={Colors.error}
                  style={styles.dialogButton}
                  onPress={() => setShowAddPlanDialog(false)}
                />
              </View>
            </View>
          </ScrollView>
        </Dialog>
      </ScrollView>
    );
  }

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
                  ? `₹${loggedUser.user.plan.price}` 
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
              <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price} ₹</Text>
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
  },
  featureEditContainer: {
    marginVertical: 8,
  },
  featureInput: {
    marginVertical: 4,
  },
  addButton: {
    marginBottom: 20,
    height: 48,
    borderRadius: 24,
  },
  dialogContent: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textGrey,
  },
  dialogInput: {
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
    height: 48,
    borderRadius: 24,
  }
});