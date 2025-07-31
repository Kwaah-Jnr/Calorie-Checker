// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from '../screens/WelcomeScreen';
import GoalsScreen from '../screens/GoalsScreen';
import MealTrackerScreen from '../screens/MealTrackerScreen';
import NewMealEntryScreen from '../screens/NewMealEntryScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LogScreen from '../screens/LogScreen';
import BottomNavigation from '../components/BottomNavigation';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Bottom Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={MealTrackerScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="NEW" component={NewMealEntryScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="User" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="NewMealEntry" component={NewMealEntryScreen} />
      
    </Stack.Navigator>
  );
}

export default AppNavigator;