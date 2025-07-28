import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

/**
 * A reusable header component with back button and optional right action
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {Function} props.onBackPress - Function to call when back button is pressed
 * @param {React.ReactNode} props.rightComponent - Optional component to render on the right side
 * @param {Object} props.style - Additional styles for the header container
 */
const Header = ({ 
  title, 
  onBackPress, 
  rightComponent,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      
      {rightComponent ? (
        rightComponent
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ui.padding,
    paddingVertical: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: ui.backIconSize,
    color: colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});

export default Header;