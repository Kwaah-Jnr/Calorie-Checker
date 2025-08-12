// constants/defaultData.js
export const defaultUser = {
  name: 'New User',
  email: 'user@example.com',
  age: 25,
  gender: 'male',
  height: 175, // cm
  weight: 70,  // kg
};

export const defaultGoals = {
  dailyCalories: 2000,
  dailyMealGoal: 3,
  targetWeight: 70,
  selectedGoal: 'maintain',
  activityLevel: 1.55, // Moderately active
  bmr: 1650, // Will be calculated based on user stats
  tdee: 2558  // Will be calculated based on activity level
};

export const defaultMeals = [
  {
    id: '1',
    mealType: 'Breakfast',
    time: '08:30',
    dateLogged: new Date().toISOString(),
    foods: [
      {
        name: 'Oatmeal',
        quantity: '1',
        unit: 'cup',
        calories: '150'
      },
      {
        name: 'Banana',
        quantity: '1',
        unit: 'medium',
        calories: '105'
      }
    ],
    totalCalories: 255
  },
  {
    id: '2',
    mealType: 'Lunch',
    time: '12:45',
    dateLogged: new Date().toISOString(),
    foods: [
      {
        name: 'Grilled Chicken',
        quantity: '150',
        unit: 'grams',
        calories: '248'
      },
      {
        name: 'Brown Rice',
        quantity: '100',
        unit: 'grams',
        calories: '111'
      }
    ],
    totalCalories: 359
  }
];

export const defaultQuickFoods = [
  { emoji: '☕', name: 'Coffee', calories: 2, unit: 'cup' },
  { emoji: '🍎', name: 'Apple', calories: 95, unit: 'medium' },
  { emoji: '🍗', name: 'Chicken Breast', calories: 165, unit: '100g' },
  { emoji: '🍚', name: 'White Rice', calories: 130, unit: '100g' }
];

export const defaultCategories = [
  { name: 'Breakfast', icon: '🍳' },
  { name: 'Lunch', icon: '🍲' },
  { name: 'Dinner', icon: '🍛' },
  { name: 'Snacks', icon: '🍪' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Desserts', icon: '🍰' }
];

export const defaultPopularMeals = [
  {
    id: '1',
    name: 'Avocado Toast',
    calories: 220,
    chef: 'Healthy Chef',
    rating: 4.8,
    image: require('../assets/images/Avocado Toast.jpg'),
    isPremium: false
  },
  {
    id: '2',
    name: 'Protein Smoothie',
    calories: 320,
    chef: 'Fit Kitchen',
    rating: 4.6,
    image: require('../assets/images/Berry Smoothie.jpg'),
    isPremium: true
  }
];