// context/initialState.js
import { 
  defaultUser, 
  defaultGoals, 
  defaultMeals,
  defaultQuickFoods,
  defaultCategories,
  defaultPopularMeals
} from '../constants/defaultData';

export const initialState = {
  user: defaultUser,
  goals: defaultGoals,
  meals: defaultMeals,
  quickFoods: defaultQuickFoods,
  categories: defaultCategories,
  popularMeals: defaultPopularMeals
};