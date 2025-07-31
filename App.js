import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { colors } from './constants/colors';
import { MealProvider } from './context/MealContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <MealProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
          <AppNavigator />
        </NavigationContainer>
      </MealProvider>
    </SafeAreaProvider>
  );
}

export default App;