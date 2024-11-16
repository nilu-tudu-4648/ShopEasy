import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View, Text, Card, Button, Avatar, Colors, Typography, BorderRadiuses
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

Colors.loadColors({
  primary: '#4A6FFF',
  secondary: '#FF6B6B',
  success: '#4CAF50',
  textGrey: '#666666',
  backgroundGrey: '#F8FAFC',
  cardBg: '#FFFFFF'
});

Typography.loadTypographies({
  heading: { fontSize: 28, fontWeight: '700' },
  subheading: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16 },
  small: { fontSize: 13 }
});

const HomeScreen = () => {
  const router = useRouter();

  const quickActions = [
    { icon: 'login-variant', label: 'Check In', route: 'stacks/CheckInOutScreen', color: Colors.primary },
    { icon: 'calendar-clock', label: 'My Plans', route: '/(app)/MyPlansScreen', color: Colors.secondary },
    { icon: 'account-cog', label: 'Profile', route: '/(app)/ProfileScreen', color: Colors.success }
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4A6FFF', '#6B8AFF']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Avatar
              size={70}
              source={{ uri: 'https://via.placeholder.com/70' }}
              containerStyle={styles.avatar}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Hours Left</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card elevation={2} style={styles.quickActionsCard}>
          <View style={styles.actionButtons}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                link
                style={styles.actionButton}
                onPress={() => router.push(action.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                  <Icon name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Button>
            ))}
          </View>
        </Card>

        <Card elevation={2} style={styles.planCard}>
          <Text style={styles.cardTitle}>Premium Monthly</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '70%' }]} />
          </View>
          <Text style={styles.timeRemaining}>42 hours remaining</Text>
        </Card>

        <Card elevation={2} style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {[
            { type: 'login', time: 'Today, 9:30 AM', location: 'Main Library' },
            { type: 'logout', time: 'Yesterday, 5:30 PM', location: 'Main Library' }
          ].map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Icon 
                name={activity.type === 'login' ? 'login' : 'logout'} 
                size={24} 
                color={activity.type === 'login' ? Colors.primary : Colors.secondary}
              />
              <View style={styles.activityDetails}>
                <Text style={styles.activityText}>
                  {activity.type === 'login' ? 'Checked in at' : 'Checked out from'} {activity.location}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </Card>
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
    paddingHorizontal: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  welcomeText: {
    marginLeft: 15,
  },
  greeting: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
  },
  content: {
    padding: 15,
    marginTop: -20,
  },
  quickActionsCard: {
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: Colors.cardBg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 8,
  },
  actionLabel: {
    color: Colors.textGrey,
    fontSize: 14,
  },
  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    backgroundColor: Colors.cardBg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  timeRemaining: {
    color: Colors.textGrey,
    fontSize: 14,
  },
  activityCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: Colors.cardBg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  activityDetails: {
    marginLeft: 15,
  },
  activityText: {
    fontSize: 15,
  },
  activityTime: {
    color: Colors.textGrey,
    fontSize: 13,
    marginTop: 3,
  },
});

export default HomeScreen;