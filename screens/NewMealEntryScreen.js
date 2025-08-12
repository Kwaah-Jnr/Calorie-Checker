import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { Button, Header } from '../components';
import { Picker } from '@react-native-picker/picker';
import { MealContext } from '../context/MealContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewMealEntryScreen = ({ navigation, route }) => {
  const { addMeal, goals } = useContext(MealContext);
  const prefillData = route.params?.prefillData || null;
  
  // Food entries state with calorie tracking
  const [foodEntries, setFoodEntries] = useState([
    { name: '', quantity: '', unit: 'grams', calories: '' }
  ]);

  // Time and meal type
  const [time, setTime] = useState({ hour: '07', minute: '00' });
  const [mealName, setMealName] = useState('Lunch');
  const [isCalculating, setIsCalculating] = useState(false);

  // Handle prefill data
  useEffect(() => {
    if (prefillData?.foods) {
      setFoodEntries(prefillData.foods.map(food => ({
        name: food.name || '',
        quantity: food.quantity || '',
        unit: food.unit || 'grams',
        calories: food.calories || ''
      })));
    }
    if (prefillData?.mealType) {
      setMealName(prefillData.mealType);
    }
  }, [prefillData]);

  // Initialize current time and meal type
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setTime({ hour: hours, minute: minutes });

    const hour = now.getHours();
    const mealTypes = [
      { name: 'Breakfast', start: 5, end: 11 },
      { name: 'Lunch', start: 12, end: 16 },
      { name: 'Dinner', start: 17, end: 20 },
      { name: 'Snack' }
    ];

    const currentMeal = mealTypes.find(type => {
      if (type.name === 'Snack') return false;
      return hour >= type.start && hour <= type.end;
    }) || mealTypes[3];

    if (!currentMeal || hour >= 21 || hour <= 4) {
      setMealName('Snack');
    } else if (!prefillData?.mealType) {
      setMealName(currentMeal.name);
    }
  }, []);

  // Time management
  const incrementTime = () => {
    const currentHour = parseInt(time.hour);
    const newHour = (currentHour + 1) % 24;
    setTime({ ...time, hour: newHour.toString().padStart(2, '0') });
  };

  const decrementTime = () => {
    const currentHour = parseInt(time.hour);
    const newHour = currentHour === 0 ? 23 : currentHour - 1;
    setTime({ ...time, hour: newHour.toString().padStart(2, '0') });
  };

  // Food entry handlers
  const handleUpdateEntry = (index, field, value) => {
    const newEntries = [...foodEntries];
    newEntries[index][field] = value;
    
    // Auto-calculate calories if quantity changes for certain foods
    if (field === 'quantity' && value && newEntries[index].name) {
      const food = newEntries[index];
      const calorieInfo = getCalorieInfo(food.name);
      if (calorieInfo) {
        newEntries[index].calories = Math.round(parseFloat(value) * calorieInfo.caloriesPerUnit).toString();
      }
    }
    
    setFoodEntries(newEntries);
  };

  const handleAddEntry = () => {
    setFoodEntries([...foodEntries, { name: '', quantity: '', unit: 'grams', calories: '' }]);
  };

  const handleRemoveEntry = (index) => {
    if (foodEntries.length > 1) {
      const newEntries = foodEntries.filter((_, i) => i !== index);
      setFoodEntries(newEntries);
    }
  };

  // Quick add foods with calorie data
  const quickFoods = [
    { emoji: '☕', name: 'Coffee', calories: 2, unit: 'cup' },
    { emoji: '🍎', name: 'Apple', calories: 95, unit: 'medium' },
    { emoji: '🍗', name: 'Chicken Breast', calories: 165, unit: '100g' },
    { emoji: '🍚', name: 'White Rice', calories: 130, unit: '100g' }
  ];

  // Get calorie info for common foods
  const getCalorieInfo = (foodName) => {
    const foodMap = {
      'Coffee': { caloriesPerUnit: 2, unit: 'cup' },
      'Apple': { caloriesPerUnit: 95, unit: 'medium' },
      'Chicken Breast': { caloriesPerUnit: 165, unit: '100g' },
      'White Rice': { caloriesPerUnit: 130, unit: '100g' },
      'Avocado Toast': { caloriesPerUnit: 220, unit: 'slice' }
    };
    return foodMap[foodName];
  };

  // Calculate total calories for the meal
  const calculateTotalCalories = () => {
    return foodEntries.reduce((total, entry) => {
      return total + (parseInt(entry.calories) || 0);
    }, 0);
  };

  // Main log handler
  const handleLogMeal = () => {
    const isInvalid = foodEntries.some(
      entry => !entry.name.trim() || !entry.quantity.trim()
    );

    if (isInvalid) {
      Alert.alert(
        'Missing Information',
        'Please make sure every food item has a name and quantity.'
      );
      return;
    }

    const totalCalories = calculateTotalCalories();
    const remainingCalories = goals?.dailyCalories ? goals.dailyCalories - totalCalories : null;

    const newMealLog = {
      id: Date.now().toString(),
      mealType: mealName,
      time: `${time.hour}:${time.minute}`,
      foods: foodEntries.map(entry => ({
        ...entry,
        calories: entry.calories || '0'
      })),
      totalCalories,
      dateLogged: new Date().toISOString(),
    };

    addMeal(newMealLog);

    Alert.alert(
      'Meal Logged!',
      `Successfully logged ${mealName} (${totalCalories} cal).` +
      (remainingCalories !== null ? `\n\nRemaining daily calories: ${remainingCalories}` : ''),
      [{
        text: 'OK',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Log' })
      }]
    );
  };

  const fetchCaloriesFromAPI = async (foodName, index) => {
  if (!foodName) return;

  try {
    const res = await fetch(`http://192.168.137.136:5000/search?q=${encodeURIComponent(foodName)}`);
    const data = await res.json();

    if (data.length > 0 && data[0].calories) {
      const newEntries = [...foodEntries];
      newEntries[index].calories = data[0].calories.toString();
      setFoodEntries(newEntries);
    } else {
      console.warn(`No calorie data found for ${foodName}`);
    }
  } catch (error) {
    console.error("Error fetching calories:", error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header 
        title="New Meal Entry" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={() => setIsCalculating(!isCalculating)}>
            <Icon 
              name={isCalculating ? 'calculate' : 'calculate'} 
              size={24} 
              color={isCalculating ? colors.primary : colors.text} 
            />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time Picker */}
        <View style={styles.timePicker}>
          <TouchableOpacity onPress={decrementTime} style={styles.timeButton}>
            <Icon name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{time.hour}</Text>
            <Text style={styles.timeText}>:</Text>
            <Text style={styles.timeText}>{time.minute}</Text>
          </View>
          
          <TouchableOpacity onPress={incrementTime} style={styles.timeButton}>
            <Icon name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Meal Type Selector */}
        <View style={styles.mealTypeContainer}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeButtons}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  mealName === type && styles.mealTypeButtonActive
                ]}
                onPress={() => setMealName(type)}
              >
                <Text style={[
                  styles.mealTypeButtonText,
                  mealName === type && styles.mealTypeButtonTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meal Title */}
        <Text style={styles.mealNameTitle}>{mealName}</Text>

        {/* Food Entries List */}
        {foodEntries.map((item, index) => (
          <View key={index} style={styles.foodEntryContainer}>
            <View style={styles.foodEntryHeader}>
              <TextInput
                placeholder="Food name (e.g., Avocado Toast)"
                value={item.name}
                onChangeText={(text) => handleUpdateEntry(index, 'name', text)}
                style={styles.foodNameInput}
                autoCapitalize="words"
              />
              {foodEntries.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveEntry(index)}
                >
                  <Icon name="close" size={20} color={colors.white} />
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.quantityRow}>
              <View style={styles.quantityInput}>
                <TextInput
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={item.quantity}
                  onChangeText={(text) => handleUpdateEntry(index, 'quantity', text)}
                  style={styles.input}
                />
              </View>
              
              <View style={styles.unitPicker}>
                <Picker
                  selectedValue={item.unit}
                  onValueChange={(value) => handleUpdateEntry(index, 'unit', value)}
                  style={styles.picker}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="grams" value="grams" />
                  <Picker.Item label="oz" value="oz" />
                  <Picker.Item label="servings" value="servings" />
                  <Picker.Item label="pcs" value="pcs" />
                  <Picker.Item label="cups" value="cups" />
                  <Picker.Item label="tbsp" value="tbsp" />
                  <Picker.Item label="tsp" value="tsp" />
                </Picker>
              </View>
            </View>

            {isCalculating && (
              <View style={styles.calorieRow}>
                <TextInput
                  placeholder="Calories"
                  keyboardType="numeric"
                  value={item.calories}
                  onChangeText={(text) => handleUpdateEntry(index, 'calories', text)}
                  style={styles.calorieInput}
                />
                <Text style={styles.calorieLabel}>cal</Text>
              </View>
            )}
          </View>
        ))}

        {/* Add Food Button */}
        <TouchableOpacity 
          style={styles.addItemButton} 
          onPress={handleAddEntry}
          activeOpacity={0.7}
        >
          <Icon name="add" size={24} color={colors.primary} />
          <Text style={styles.addItemButtonText}>Add another food</Text>
        </TouchableOpacity>

        {/* Quick Add Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.iconRow}>
            {quickFoods.map((food) => (
              <TouchableOpacity
                key={food.emoji}
                style={styles.iconButton}
                onPress={() => {
                  const newEntry = {
                    name: food.name,
                    quantity: '1',
                    unit: food.unit,
                    calories: food.calories.toString()
                  };
                  setFoodEntries([...foodEntries, newEntry]);
                }}
              >
                <Text style={styles.iconEmoji}>{food.emoji}</Text>
                <Text style={styles.iconText}>{food.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total Calories */}
        {isCalculating && (
          <View style={styles.totalCaloriesContainer}>
            <Text style={styles.totalCaloriesText}>
              Total: {calculateTotalCalories()} calories
            </Text>
            {goals?.dailyCalories && (
              <Text style={styles.remainingCaloriesText}>
                Remaining: {Math.max(0, goals.dailyCalories - calculateTotalCalories())} calories
              </Text>
            )}
          </View>
        )}

        {/* Log Meal Button */}
        <Button
          title={`Log ${mealName}`}
          onPress={handleLogMeal}
          style={styles.logMealButton}
          icon="check"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: ui.padding,
    paddingBottom: 30,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  timeButton: {
    padding: 15,
  },
  timeDisplay: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    minWidth: 120,
  },
  timeText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  mealTypeContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.grayLight,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mealTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  mealTypeButtonTextActive: {
    color: colors.white,
  },
  mealNameTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  foodEntryContainer: {
    marginBottom: 20,
    backgroundColor: colors.grayLight,
    borderRadius: ui.borderRadius,
    padding: 15,
  },
  foodEntryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodNameInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  removeButton: {
    marginLeft: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  quantityInput: {
    flex: 1,
  },
  unitPicker: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.gray,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calorieInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  calorieLabel: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: ui.borderRadius,
    marginBottom: 25,
  },
  addItemButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 25,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    backgroundColor: colors.primaryLight,
    flex: 1,
    minWidth: '22%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  iconText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  totalCaloriesContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: ui.borderRadius,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalCaloriesText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  remainingCaloriesText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  logMealButton: {
    marginTop: 10,
  },
});

export default NewMealEntryScreen;