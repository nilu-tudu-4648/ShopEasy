import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Users,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

// Card Component
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// StatCard Component
const StatCard = ({ title, value, change, icon, isSelected }) => (
  <Card style={[styles.statCard, isSelected && styles.selectedCard]}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor:'red',
        // width:"100%"
      }}
    >
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
        {icon.component}
      </View>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.changeContainer}>
        <TrendingUp
          size={12}
          color={change.includes("Up") ? "#22C55E" : "#EF4444"}
          style={{ marginRight: 4 }}
        />
        <Text
          style={[
            styles.changeText,
            { color: change.includes("Up") ? "#22C55E" : "#EF4444" },
          ]}
        >
          {change}
        </Text>
      </View>
    </View>
  </Card>
);

// MonthSelector Component
const MonthSelector = ({ currentMonth = "October" }) => (
  <TouchableOpacity style={styles.monthSelector}>
    <Text style={styles.monthText}>{currentMonth}</Text>
    <ChevronDown size={16} color="#6B7280" />
  </TouchableOpacity>
);

// RevenueChart Component
const RevenueChart = ({ data }) => {
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(75, 123, 245, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
  };

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
      },
    ],
  };

  return (
    <Card style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Policy Revenue Details</Text>
        <MonthSelector />
      </View>
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
      />
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const stats = [
    {
      title: "Total Clients",
      value: "40,689",
      change: "8.5% Up from yesterday",
      icon: {
        component: <Users size={24} color="#4B7BF5" />,
        bgColor: "#EEF2FF",
      },
    },
    {
      title: "Total Policy Commission",
      value: "$89,000",
      change: "1.3% Up from past week",
      icon: {
        component: <Package size={24} color="#F59E0B" />,
        bgColor: "#FEF3C7",
      },
    },
    {
      title: "Total Policy Revenue",
      value: "$89,000",
      change: "8.5% Up from yesterday",
      icon: {
        component: <DollarSign size={24} color="#10B981" />,
        bgColor: "#ECFDF5",
      },
    },
    {
      title: "Total Policy Written",
      value: "2040",
      change: "8.5% Up from yesterday",
      icon: {
        component: <Clock size={24} color="#EF4444" />,
        bgColor: "#FEE2E2",
      },
    },
  ];

  const chartData = [
    { name: "5k", value: 20 },
    { name: "10k", value: 30 },
    { name: "15k", value: 45 },
    { name: "20k", value: 35 },
    { name: "25k", value: 64 },
    { name: "30k", value: 50 },
    { name: "35k", value: 30 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} isSelected={index === 0} />
          ))}
        </View>
        <RevenueChart data={chartData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    width: (screenWidth - 48) / 2,
  },
  selectedCard: {
    borderColor: "#4B7BF5",
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    marginBottom: 12,
    width: 40,
    height: 40,
  },
  cardTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 12,
  },
  chartContainer: {
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  monthText: {
    color: "#6B7280",
    fontSize: 14,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default Dashboard;
