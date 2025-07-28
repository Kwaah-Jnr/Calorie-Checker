import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

/**
 * A reusable card component with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional styles for the card
 * @param {boolean} props.noPadding - If true, removes default padding
 */
const Card = ({ 
  children, 
  style, 
  noPadding = false,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.card,
        noPadding ? null : styles.padding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  padding: {
    padding: ui.padding,
  },
});

export default Card;