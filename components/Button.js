import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * A reusable button component with primary and secondary variants
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {boolean} props.secondary - If true, renders as secondary button
 * @param {Object} props.style - Additional styles for the button
 * @param {Object} props.textStyle - Additional styles for the button text
 * @param {boolean} props.disabled - If true, button is disabled
 */
const Button = ({ 
  title, 
  onPress, 
  secondary = false, 
  style, 
  textStyle,
  disabled = false,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        secondary ? styles.secondaryButton : styles.primaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text 
        style={[
          styles.buttonText, 
          secondary ? styles.secondaryButtonText : styles.primaryButtonText,
          disabled && styles.disabledButtonText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.grayDark,
    borderColor: colors.grayDark,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
});

export default Button;