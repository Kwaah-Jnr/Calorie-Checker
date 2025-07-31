import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

const Header = ({ 
  title, 
  onBackPress, 
  rightComponent,
  style,
  backIcon = '←',
  variant = 'default',
}) => {
  const variantStyles = {
    large: {
      container: { height: 80 },
      title: { fontSize: 22 },
    },
    transparent: {
      container: { 
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
    },
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background }}>
      <View style={[
        styles.container, 
        variantStyles[variant]?.container, 
        style
      ]}>
        {onBackPress ? (
          <TouchableOpacity 
            onPress={onBackPress} 
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <View style={styles.backButtonInner}>
              <Text style={styles.backIcon}>{backIcon}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <Text style={[
          styles.title,
          variantStyles[variant]?.title
        ]} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onBackPress: PropTypes.func,
  rightComponent: PropTypes.node,
  style: PropTypes.object,
  backIcon: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'large', 'transparent']),
};

Header.defaultProps = {
  onBackPress: null,
  rightComponent: null,
  style: {},
  backIcon: '←',
  variant: 'default',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ui.padding,
    height: 60,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
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
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  rightContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default Header;