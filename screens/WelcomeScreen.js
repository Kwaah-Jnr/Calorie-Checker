import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { Button, Header } from '../components';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header title="Welcome" />
 
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.restaurantIcon}>🍽️</Text>
        </View>
        <Text style={styles.title}>Track Your Meals</Text>
        <Text style={styles.subtitle}>Log your meals here to track your calories</Text>
      </View>
 
      <View style={styles.buttonContainer}>
        <Button
          title="Start now"
          onPress={() => navigation.navigate('MainTabs'/*, { screen: 'MealTracker' }*/)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  centerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 32 
  },
  iconCircle: { 
    width: 120, 
    height: 120, 
    backgroundColor: colors.primary, 
    borderRadius: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 48 
  },
  restaurantIcon: { 
    fontSize: ui.iconSize 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: colors.text, 
    textAlign: 'center', 
    marginBottom: 16 
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    lineHeight: 24 
  },
  buttonContainer: { 
    paddingHorizontal: 32, 
    paddingBottom: 32 
  },
});

export default WelcomeScreen;