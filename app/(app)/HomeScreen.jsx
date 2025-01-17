import React from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

Colors.loadColors({
  primary: '#4A6FFF',
  secondary: '#6B8AFF',
  success: '#4CAF50', 
  warning: '#FFC107',
  error: '#FF5252',
  textGrey: '#666666',
  cardBg: '#FFFFFF'
});

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  // Sample data for charts
  const membershipData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43]
    }]
  };

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2500, 3200, 2800, 4500, 3800, 2900, 3300]
    }]
  };

  const membershipTypeData = {
    labels: ['Basic', 'Premium', 'Gold'],
    data: [30, 45, 25]
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card style={styles.statCard}>
      <View style={styles.statContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Admin!</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Members"
            value="1,234"
            icon="account-group"
            color={Colors.primary}
          />
          <StatCard
            title="New Members"
            value="+56"
            icon="account-plus"
            color={Colors.success}
          />
          <StatCard
            title="Revenue"
            value="$15,678"
            icon="currency-usd"
            color={Colors.warning}
          />
          <StatCard
            title="Active Plans"
            value="890"
            icon="clipboard-check"
            color={Colors.error}
          />
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Membership Growth</Text>
          <LineChart
            data={membershipData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundColor: Colors.cardBg,
              backgroundGradientFrom: Colors.cardBg,
              backgroundGradientTo: Colors.cardBg,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 111, 255, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Revenue</Text>
          <BarChart
            data={revenueData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              backgroundColor: Colors.cardBg,
              backgroundGradientFrom: Colors.cardBg,
              backgroundGradientTo: Colors.cardBg,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }}
            style={styles.chart}
          />
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Membership Distribution</Text>
          <PieChart
            data={[
              { name: 'Basic', population: 30, color: Colors.primary, legendFontColor: '#7F7F7F' },
              { name: 'Premium', population: 45, color: Colors.success, legendFontColor: '#7F7F7F' },
              { name: 'Gold', population: 25, color: Colors.warning, legendFontColor: '#7F7F7F' }
            ]}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    padding: 15,
    backgroundColor: Colors.cardBg,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.textGrey,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartCard: {
    padding: 15,
    marginBottom: 20,
    backgroundColor: Colors.cardBg,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textGrey,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});
