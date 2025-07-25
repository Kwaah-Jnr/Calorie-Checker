import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => Alert.alert('Back Pressed')} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>
 
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.restaurantIcon}>🍽️</Text>
        </View>
        <Text style={styles.title}>Track Your Meals</Text>
        <Text style={styles.subtitle}>Log your meals here to track your calories</Text>
      </View>
 
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('MealTracker')}
        >
          <Text style={styles.primaryButtonText}>Start now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { paddingHorizontal: ui.padding, paddingTop: ui.padding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: ui.backIconSize, color: colors.text },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 120, height: 120, backgroundColor: colors.primary, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 48 },
  restaurantIcon: { fontSize: ui.iconSize },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  buttonContainer: { paddingHorizontal: 32, paddingBottom: 32 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: ui.borderRadius, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: colors.white, fontSize: 18, fontWeight: '600' },
});

export default WelcomeScreen;