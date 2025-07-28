import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * A reusable text input component with label and error handling
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Function to call when text changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.error - Error message to display
 * @param {Object} props.style - Additional styles for the input container
 * @param {Object} props.inputStyle - Additional styles for the input field
 * @param {boolean} props.required - If true, shows a required indicator
 */
const TextInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  error, 
  style,
  inputStyle,
  required = false,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredIndicator}>*</Text>}
        </View>
      )}
      
      <RNTextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  requiredIndicator: {
    color: '#e53e3e',
    marginLeft: 4,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.gray,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    marginTop: 4,
  },
});

export default TextInput;