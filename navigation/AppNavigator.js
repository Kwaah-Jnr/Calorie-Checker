// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import GoalsScreen from '../screens/GoalsScreen';
import CalorieDashboardScreen from '../screens/CalorieDashboardScreen';
import MealTrackerScreen from '../screens/MealTrackerScreen';
import NewMealEntryScreen from '../screens/NewMealEntryScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LogScreen from '../screens/LogScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,
      animation: 'slide_from_right'
     }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      {/* <Stack.Screen name="CalorieDashboard" component={CalorieDashboardScreen} /> */}
      <Stack.Screen name="MealTracker" component={MealTrackerScreen} />
      <Stack.Screen name="LogScreen" component={LogScreen} />
      <Stack.Screen name="NewMealEntry" component={NewMealEntryScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;