import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { colors } from './constants/colors';
import { MealProvider } from './context/MealContext';

function App() {
  return (
    <MealProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </MealProvider>
  );
}

export default App;