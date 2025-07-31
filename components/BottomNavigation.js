// components/BottomNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavigation = ({ state, descriptors, navigation }) => {
  const route = useRoute();
  
  // Define your tab items
  const items = [
    {
      name: 'Dashboard',
      icon: 'home',
      type: 'Ionicons',
      routeName: 'Dashboard'
    },
    {
      name: 'Log',
      icon: 'list',
      type: 'Ionicons',
      routeName: 'Log'
    },
    {
      name: 'NEW',
      icon: 'add',
      type: 'Ionicons',
      routeName: 'NEW',
      isCentral: true
    },
    {
      name: 'Goals',
      icon: 'flag',
      type: 'Ionicons',
      routeName: 'Goals'
    },
    {
      name: 'User',
      icon: 'person',
      type: 'Ionicons',
      routeName: 'User'
    }
  ];

  const getIconComponent = (iconName, iconType, iconSize, iconColor) => {
    switch (iconType) {
      case 'Ionicons':
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
      default:
        return <Text style={{ fontSize: iconSize, color: iconColor }}>{iconName}</Text>;
    }
  };

  const handleTabPress = (item) => {
    navigation.navigate(item.routeName);
  };

  // Get active route name
  const activeRoute = state.routes[state.index].name;

  return (
    <View style={[styles.container]}>
      {items.map((item) => {
        const isActive = activeRoute === item.routeName;

        if (item.isCentral) {
          return (
            <TouchableOpacity
              key={item.routeName}
              style={styles.centralButtonContainer}
              onPress={() => handleTabPress(item)}
            >
              <View style={styles.centralButton}>
                {getIconComponent(item.icon, item.type, 30, colors.white)}
              </View>
              <Text style={styles.centralButtonLabel}>{item.name}</Text>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              key={item.routeName}
              style={styles.navItem}
              onPress={() => handleTabPress(item)}
            >
              {getIconComponent(
                item.icon,
                item.type,
                24,
                isActive ? colors.primary : colors.textSecondary
              )}
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopLeftRadius: ui.borderRadius * 2,
    borderTopRightRadius: ui.borderRadius * 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  navLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  centralButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    zIndex: 10,
    flex: 1.2,
  },
  centralButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },

  centralButtonLabel: {
    fontSize: 12,
    color: colors.orange,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;