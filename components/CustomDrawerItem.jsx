import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from "expo-router";
import { compPadding, radius, radius1, Size4 } from '../constants/Sizes';

const CustomDrawerItem = ({ icon, label, route }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <TouchableOpacity
      style={[
        styles.drawerItem,
        isActive && styles.activeDrawerItem
      ]}
      onPress={() => router.push(route)}
    >
      <View style={[
        styles.iconContainer,
        isActive && styles.activeIconContainer
      ]}>
        {icon}
      </View>
      <Text style={[
        styles.drawerLabel,
        isActive && styles.activeDrawerLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: compPadding,
    marginHorizontal: Size4,
    borderRadius: radius,
  },
  activeDrawerItem: {
    backgroundColor: '#4A6FFF15',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F8FAFC',
  },
  activeIconContainer: {
    backgroundColor: '#4A6FFF20',
  },
  drawerLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeDrawerLabel: {
    color: '#4A6FFF',
    fontWeight: '600',
  },
});

export default CustomDrawerItem;