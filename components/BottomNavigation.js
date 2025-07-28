import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * A reusable bottom navigation component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items with icon, name, and onPress
 * @param {string} props.activeItem - Key of the currently active item
 * @param {Object} props.style - Additional styles for the container
 */
const BottomNavigation = ({ 
  items = [], 
  activeItem,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item) => (
        <TouchableOpacity 
          key={item.name} 
          style={styles.navItem} 
          onPress={item.onPress}
        >
          <Text 
            style={[
              styles.navIcon, 
              activeItem === item.name && styles.navIconActive
            ]}
          >
            {item.icon}
          </Text>
          <Text 
            style={[
              styles.navLabel, 
              activeItem === item.name && styles.navLabelActive
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    height: 80,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: colors.textSecondary,
  },
  navIconActive: {
    color: colors.primary,
  },
  navLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  navLabelActive: {
    color: colors.primary,
  },
});

export default BottomNavigation;