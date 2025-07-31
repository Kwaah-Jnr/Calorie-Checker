import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Load data from storage on startup
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('@meals');
        if (storedMeals) setMeals(JSON.parse(storedMeals));
        
        const storedProfile = await AsyncStorage.getItem('@user_profile');
        if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@meals', JSON.stringify(meals));
        if (userProfile) {
          await AsyncStorage.setItem('@user_profile', JSON.stringify(userProfile));
        }
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [meals, userProfile]);

  const addMeal = (newMeal) => {
    setMeals(prev => [newMeal, ...prev]); // Newest meals first
  };

  const deleteMeal = (mealId) => {
    setMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const updateMeal = (updatedMeal) => {
    setMeals(prev => prev.map(meal => 
      meal.id === updatedMeal.id ? updatedMeal : meal
    ));
  };

  const getTodaysMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(meal => 
      meal.dateLogged && meal.dateLogged.split('T')[0] === today
    );
  };

  const updateProfile = (profileData) => {
    setUserProfile(profileData);
  };

  return (
    <MealContext.Provider value={{ 
      meals,
      userProfile,
      addMeal,
      deleteMeal,
      updateMeal,
      getTodaysMeals,
      updateProfile
    }}>
      {children}
    </MealContext.Provider>
  );
};