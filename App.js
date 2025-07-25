// Example App.js using Stack Navigator
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MealTrackerScreen from './src/screens/MealTrackerScreen'; // Adjust path
import NewMealEntryScreen from './src/screens/NewMealEntryScreen'; // Adjust path

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MealTracker" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MealTracker" component={MealTrackerScreen} />
        <Stack.Screen name="NewMealEntry" component={NewMealEntryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;