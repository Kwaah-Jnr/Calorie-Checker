export const mealCategories = [
  { icon: '☕', name: 'Breakfast' },
  { icon: '🍴', name: 'Lunch' },
  { icon: '🍎', name: 'Snacks' },
  { icon: '🍽️', name: 'Dinner' }
];

export const bottomNavItems = [
  { id: '1', name: 'Dashboard', icon: 'home', routeName: 'MealTracker', type: 'Ionicons' },
  { id: '2', name: 'Log', icon: 'clipboard-outline', routeName: 'LogScreen', type: 'Ionicons' },
  { id: '3', name: '+', icon: 'add-circle-outline', routeName: 'NewMealEntry', isCentral: true, type: 'Ionicons' }, // Changed to a plus icon from Ionicons
  { id: '4', name: 'Goals', icon: 'trophy-outline', routeName: 'GoalsScreen', type: 'Ionicons' },
  { id: '5', name: 'User', icon: 'person', routeName: 'UserProfile', type: 'Ionicons' },
];

const images = {
  avocadoToast: require('../assets/images/Avocado Toast.jpg'),
  berrySmoothie: require('../assets/images/Berry Smoothie.jpg'),
  quinoaSalad: require('../assets/images/Quinoa Salad.jpg'),
};

export const popularMeals = [
  {
    id: 1,
    name: "Avocado Toast",
    chef: "Chef Sarah",
    rating: 4.8,
    image: images.avocadoToast, // Use the imported image
    isPremium: true,
  },
  {
    id: 2,
    name: "Berry Smoothie",
    chef: "Chef Mike",
    rating: 4.6,
    image: images.berrySmoothie,
    isPremium: true,
  },
  {
    id: 3,
    name: "Quinoa Salad",
    chef: "Chef Anna",
    rating: 4.9,
    image: images.quinoaSalad,
    isPremium: true,
  },
];