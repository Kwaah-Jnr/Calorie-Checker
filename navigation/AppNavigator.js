import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import MealTrackerScreen from '../screens/MealTrackerScreen';
import NewMealEntryScreen from '../screens/NewMealEntryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MealTracker" component={MealTrackerScreen} />
      <Stack.Screen name="NewMealEntry" component={NewMealEntryScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;