// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import MyCalorieGoals from '../screens/MyCalorieGoals';
import CalorieDashboardScreen from '../screens/CalorieDashboardScreen';
import MealTrackerScreen from '../screens/MealTrackerScreen';
import NewMealEntryScreen from '../screens/NewMealEntryScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MyCalorieGoals" component={MyCalorieGoals} />
      <Stack.Screen name="CalorieDashboard" component={CalorieDashboardScreen} />
      <Stack.Screen name="MealTracker" component={MealTrackerScreen} />
      <Stack.Screen name="NewMealEntry" component={NewMealEntryScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;