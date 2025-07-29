// components/BottomNavigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

// Only import Ionicons if that's the only type you're using.
// If you use FontAwesome5 for other icons, keep it.
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Remove if not needed for any other icon

const BottomNavigation = ({
  items = [],
  activeItem,
  style,
}) => {
  const getIconComponent = (iconName, iconType, iconSize, iconColor) => {
    switch (iconType) {
      case 'Ionicons':
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
      // If you removed FontAwesome5, remove its case too:
      // case 'FontAwesome5':
      //   return <FontAwesome5 name={iconName} size={iconSize} color={iconColor} />;
      default:
        // Fallback for plain text icons (e.g., if type is not recognized)
        return <Text style={{ fontSize: iconSize, color: iconColor }}>{iconName}</Text>;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {items.map((item) => {
        const isActive = activeItem === item.name;

        if (item.isCentral) {
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.centralButtonContainer}
              onPress={item.onPress}
            >
              <View style={styles.centralButton}>
                {/* Ensure the size and color here are correct for your '+' icon */}
                {getIconComponent(item.icon, item.type, 30, colors.white)}
              </View>
              <Text style={styles.centralButtonLabel}>NEW</Text>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={item.onPress}
            >
              {getIconComponent(
                item.icon,
                item.type,
                24,
                isActive ? colors.primary : colors.textSecondary
              )}
              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                ]}
              >
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
  centralButtonIcon: {
    // These styles are handled by the getIconComponent now
  },
  centralButtonLabel: {
    fontSize: 12,
    color: colors.orange,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;