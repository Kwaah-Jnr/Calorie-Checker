import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  defaultUser, 
  defaultGoals, 
  defaultMeals,
  defaultQuickFoods,
  defaultCategories,
  defaultPopularMeals
} from '../constants/defaultData';

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  // Initialize state with defaults
  const [state, setState] = useState({
    meals: defaultMeals,
    userProfile: defaultUser,
    goals: defaultGoals,
    quickFoods: defaultQuickFoods,
    categories: defaultCategories,
    popularMeals: defaultPopularMeals
  });

  const setUserName = (newName) => {
    setState(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        name: newName
      }
    }));
  };
   
  return (
    <MealContext.Provider value={{ 
      ...state,
      setUserName,
      setState,
      deleteMeal: (mealId) => {
        setState(prev => ({
          ...prev,
          meals: prev.meals.filter(meal => meal.id !== mealId)
        }));
      },
    }}>
      {children}
    </MealContext.Provider>
  );

  // Load data from storage on startup
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@app_data');
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setState(prev => ({
            ...prev,
            meals: parsedData.meals || defaultMeals,
            userProfile: parsedData.userProfile || defaultUser,
            goals: parsedData.goals || defaultGoals,
            // Keep the other defaults if not in storage
          }));
        }
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
        // Only save what needs persistence
        await AsyncStorage.setItem('@app_data', JSON.stringify({
          meals: state.meals,
          userProfile: state.userProfile,
          goals: state.goals
        }));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [state.meals, state.userProfile, state.goals]);

  // Helper function to update state
  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  // Meal functions
  const addMeal = (newMeal) => {
    updateState('meals', [newMeal, ...state.meals]);
  };

  const deleteMeal = (mealId) => {
    updateState('meals', state.meals.filter(meal => meal.id !== mealId));
  };

  const updateMeal = (updatedMeal) => {
    updateState('meals', state.meals.map(meal => 
      meal.id === updatedMeal.id ? updatedMeal : meal
    ));
  };

  const getTodaysMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return state.meals.filter(meal => 
      meal.dateLogged && meal.dateLogged.split('T')[0] === today
    );
  };

  // Profile functions
  const updateProfile = (profileData) => {
    updateState('userProfile', profileData);
  };

  // Goals functions
  const updateGoals = (goalsData) => {
    updateState('goals', goalsData);
  };

  return (
    <MealContext.Provider value={{ 
      ...state,
      addMeal,
      deleteMeal,
      updateMeal,
      getTodaysMeals,
      updateProfile,
      updateGoals
    }}>
      {children}
    </MealContext.Provider>
  );
};