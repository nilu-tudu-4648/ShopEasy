import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View, Text, Card, Button, Avatar, Colors, Typography,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
const isSmallDevice = width < 375;
const isTablet = width > 768;

Colors.loadColors({
  primary: '#4A6FFF',
  secondary: '#FF6B6B',
  success: '#4CAF50',
  textGrey: '#666666',
  backgroundGrey: '#F8FAFC',
  cardBg: '#FFFFFF'
});

Typography.loadTypographies({
  heading: { fontSize: Math.min(28, width * 0.07), fontWeight: '700' },
  subheading: { fontSize: Math.min(20, width * 0.05), fontWeight: '600' },
  body: { fontSize: Math.min(16, width * 0.04) },
  small: { fontSize: Math.min(13, width * 0.035) }
});

const HomeScreen = () => {
  const router = useRouter();

  const {loggedUser} = useSelector((state) => state.entities.authReducer);
  console.log(loggedUser);
  const quickActions = [
    { icon: 'login-variant', label: 'Check In', route: 'stacks/CheckInOutScreen', color: Colors.primary },
    { icon: 'calendar-clock', label: 'My Plans', route: '/(app)/MyPlansScreen', color: Colors.secondary },
    { icon: 'account-cog', label: 'Profile', route: '/(app)/ProfileScreen', color: Colors.success }
  ];

  const formatStudyTime = (totalHours) => {
    const hours = Math.floor(totalHours || 0);
    const minutes = Math.round(((totalHours || 0) - hours) * 60);
    if (hours === 0) {
      return `${minutes} mins`;
    }
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const responsiveStyles = StyleSheet.create({
    content: {
      padding: width * 0.04,
      marginTop: -width * 0.05,
      flexDirection: isTablet ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    mainColumn: {
      width: isTablet ? '48%' : '100%',
    },
    sideColumn: {
      width: isTablet ? '48%' : '100%',
    },
  });

  return (
    <ScrollView 
      style={[styles.container]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient 
        colors={['#4A6FFF', '#6B8AFF']} 
        style={[styles.header]}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Avatar
              size={Math.min(70, width * 0.17)}
              source={{ uri: loggedUser?.user?.photoURL || 'https://via.placeholder.com/70' }}
              containerStyle={styles.avatar}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{loggedUser?.user?.name}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatStudyTime(loggedUser?.user?.usage?.totalHours)}</Text>
              <Text style={styles.statLabel}>Time Studied</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{loggedUser?.user?.visits || 0}</Text>
              <Text style={styles.statLabel}>Total Visits</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={responsiveStyles.content}>
        <View style={responsiveStyles.mainColumn}>
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
                    <Icon name={action.icon} size={Math.min(28, width * 0.07)} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Button>
              ))}
            </View>
          </Card>

          <Card elevation={2} style={styles.planCard}>
            <Text style={styles.cardTitle}>{loggedUser?.user?.plan?.name || 'Basic Plan'}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${(loggedUser?.user?.plan?.hoursUsed / loggedUser?.user?.plan?.hoursTotal * 100) || 0}%` }]} />
            </View>
            <Text style={styles.timeRemaining}>
              {((loggedUser?.user?.plan?.hoursTotal || 0) - (loggedUser?.user?.plan?.hoursUsed || 0)).toFixed(1)} hours remaining
            </Text>
          </Card>
        </View>

        <View style={responsiveStyles.sideColumn}>
          <Card elevation={2} style={styles.activityCard}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            {(loggedUser?.user?.usage?.visitHistory || [
              { type: 'login', time: 'No recent activity', location: 'N/A' }
            ]).map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Icon 
                  name={activity.type === 'login' ? 'login' : 'logout'} 
                  size={Math.min(24, width * 0.06)} 
                  color={activity.type === 'login' ? Colors.primary : Colors.secondary}
                />
                <View style={styles.activityDetails}>
                  <Text style={styles.activityText}>
                    {activity.type === 'login' ? 'Checked in at' : 'Checked out from'} Table {activity.tableId}
                  </Text>
                  <Text style={styles.activityTime}>Room {activity.room}, Floor {activity.floor}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
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
    paddingBottom: height * 0.04,
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
  },
  headerContent: {
    padding: width * 0.05,
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
    marginLeft: width * 0.04,
  },
  greeting: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: Math.min(16, width * 0.04),
  },
  userName: {
    color: '#FFFFFF',
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: height * 0.025,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: width * 0.04,
    padding: width * 0.04,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: width * 0.03,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: Math.min(14, width * 0.035),
  },
  quickActionsCard: {
    borderRadius: width * 0.05,
    marginBottom: height * 0.02,
    backgroundColor: Colors.cardBg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: width * 0.05,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    padding: width * 0.03,
    borderRadius: width * 0.04,
    marginBottom: height * 0.01,
  },
  actionLabel: {
    color: Colors.textGrey,
    fontSize: Math.min(14, width * 0.035),
  },
  planCard: {
    borderRadius: width * 0.05,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    backgroundColor: Colors.cardBg,
  },
  cardTitle: {
    fontSize: Math.min(18, width * 0.045),
    fontWeight: '600',
    marginBottom: height * 0.02,
  },
  progressBar: {
    height: height * 0.01,
    backgroundColor: '#F0F0F0',
    borderRadius: width * 0.01,
    marginVertical: height * 0.015,
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: width * 0.01,
  },
  timeRemaining: {
    color: Colors.textGrey,
    fontSize: Math.min(14, width * 0.035),
  },
  activityCard: {
    borderRadius: width * 0.05,
    padding: width * 0.05,
    backgroundColor: Colors.cardBg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  activityDetails: {
    marginLeft: width * 0.04,
    flex: 1,
  },
  activityText: {
    fontSize: Math.min(15, width * 0.038),
  },
  activityTime: {
    color: Colors.textGrey,
    fontSize: Math.min(13, width * 0.033),
    marginTop: height * 0.005,
  },
});

export default HomeScreen;