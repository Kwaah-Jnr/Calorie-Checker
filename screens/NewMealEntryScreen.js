import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { Button, Header, TextInput } from '../components';
import { Picker } from '@react-native-picker/picker';

const NewMealEntryScreen = ({ navigation, route }) => {
  // Check if there's prefill data from route params
  const prefillData = route.params?.prefillData || null;
  
  // State to manage a dynamic list of food entries
  const [foodEntries, setFoodEntries] = useState([
    { name: 'Grilled chicken', quantity: '250', unit: 'grams' },
  ]);

  // Simplified time state to match the new UI
  const [time, setTime] = useState({ hour: '07', minute: '00' });
  const [mealName, setMealName] = useState('Lunch');

  // Handle prefill data when component mounts
  useEffect(() => {
    if (prefillData && prefillData.foods) {
      setFoodEntries(prefillData.foods);
    }
  }, [prefillData]);

  // Current time initialization
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTime({ hour: hours, minute: minutes });

    // Auto-detect meal type based on current time
    const hour = now.getHours();
    if (hour >= 5 && hour < 11) {
      setMealName('Breakfast');
    } else if (hour >= 11 && hour < 16) {
      setMealName('Lunch');
    } else if (hour >= 16 && hour < 21) {
      setMealName('Dinner');
    } else {
      setMealName('Snack');
    }
  }, []);

  // --- Time Management ---
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

  // --- Handlers for Dynamic List ---

  // Updates a specific field (name, quantity, unit) of a food item
  const handleUpdateEntry = (index, field, value) => {
    const newEntries = [...foodEntries];
    newEntries[index][field] = value;
    setFoodEntries(newEntries);
  };

  // Adds a new, empty food item to the list
  const handleAddEntry = () => {
    setFoodEntries([...foodEntries, { name: '', quantity: '', unit: 'grams' }]);
  };

  // Removes a food item from the list
  const handleRemoveEntry = (index) => {
    if (foodEntries.length > 1) {
      const newEntries = foodEntries.filter((_, i) => i !== index);
      setFoodEntries(newEntries);
    }
  };

  // Handle icon selection to prefill food name
  const handleIconSelect = (foodName) => {
    const iconFoods = {
      '☕': 'Coffee',
      '🍴': 'Meal',
      '🍎': 'Apple',
      '🥕': 'Carrot'
    };
    
    const newEntry = { name: iconFoods[foodName] || 'New Item', quantity: '1', unit: 'serving' };
    setFoodEntries([...foodEntries, newEntry]);
  };

  // --- Main Log Handler ---
  const handleLogMeal = () => {
    // Basic validation
    const isInvalid = foodEntries.some(
      (entry) => !entry.name.trim() || !entry.quantity.trim()
    );
    if (isInvalid) {
      Alert.alert(
        'Missing Information',
        'Please make sure every food item has a name and quantity.'
      );
      return;
    }

    const newMealLog = {
      id: Date.now().toString(), // Simple ID generation
      mealType: mealName,
      time: `${time.hour}:${time.minute}`,
      foods: foodEntries.filter(entry => entry.name.trim()), // Remove empty entries
      dateLogged: new Date().toISOString(),
    };

    Alert.alert('Meal Logged!', `Successfully logged ${mealName}.`, [
      {
        text: 'OK',
        onPress: () => {
          // Navigate back to MealTracker with the new meal data
          navigation.navigate('MealTracker', { newMeal: newMealLog });
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header title="New Meal Entry" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Enhanced Time Picker Display --- */}
        <View style={styles.timePicker}>
          <TouchableOpacity onPress={incrementTime}>
            <Text style={styles.timeScroller}>
              {(parseInt(time.hour) + 1).toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{time.hour}</Text>
            <Text style={styles.timeText}>:</Text>
            <Text style={styles.timeText}>{time.minute}</Text>
          </View>
          <TouchableOpacity onPress={decrementTime}>
            <Text style={styles.timeScroller}>
              {(parseInt(time.hour) - 1 < 0 ? 23 : parseInt(time.hour) - 1).toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Meal Type Selector --- */}
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

        <Text style={styles.mealNameTitle}>{mealName}</Text>

        {/* --- Dynamic Food Entries List --- */}
        {foodEntries.map((item, index) => (
          <View key={index} style={styles.foodEntryContainer}>
            <View style={styles.foodEntryHeader}>
              <TextInput
                placeholder="e.g., Avocado Toast"
                value={item.name}
                onChangeText={(text) => handleUpdateEntry(index, 'name', text)}
                style={styles.foodNameInput}
              />
              {foodEntries.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveEntry(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.quantityRow}>
              <View style={styles.halfInput}>
                <TextInput
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={item.quantity}
                  onChangeText={(text) => handleUpdateEntry(index, 'quantity', text)}
                />
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={item.unit}
                  onValueChange={(itemValue) => handleUpdateEntry(index, 'unit', itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
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
          </View>
        ))}

        <TouchableOpacity style={styles.addItemButton} onPress={handleAddEntry}>
          <Text style={styles.addItemButtonText}>+ Add another item</Text>
        </TouchableOpacity>

        {/* --- Icon Shortcuts --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleIconSelect('☕')}
            >
              <Text style={styles.iconEmoji}>☕</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleIconSelect('🍴')}
            >
              <Text style={styles.iconEmoji}>🍴</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleIconSelect('🍎')}
            >
              <Text style={styles.iconEmoji}>🍎</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleIconSelect('🥕')}
            >
              <Text style={styles.iconEmoji}>🥕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Log Meal Button --- */}
        <Button
          title="Log Meal"
          onPress={handleLogMeal}
          style={styles.logMealButton}
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
    alignItems: 'center',
    marginBottom: 20,
  },
  timeScroller: {
    fontSize: 20,
    color: colors.textSecondary || '#9CA3AF',
    marginVertical: 4,
    padding: 8,
  },
  timeDisplay: {
    backgroundColor: colors.primary || '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  timeText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: ui.borderRadius || 8,
    borderWidth: 1,
    borderColor: colors.grayDark || '#D1D5DB',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primary || '#F59E0B',
    borderColor: colors.primary || '#F59E0B',
  },
  mealTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text || '#2D2D2D',
  },
  mealTypeButtonTextActive: {
    color: colors.white,
  },
  mealNameTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text || '#2D2D2D',
    marginBottom: 16,
  },
  foodEntryContainer: {
    marginBottom: 16,
  },
  foodEntryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodNameInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grayDark || '#D1D5DB',
    borderRadius: ui.borderRadius || 8,
    justifyContent: 'center',
    backgroundColor: colors.gray || '#F3F4F6',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  pickerItem: {
    height: 50,
  },
  addItemButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary || '#F59E0B',
    borderStyle: 'dashed',
    borderRadius: ui.borderRadius || 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  addItemButtonText: {
    color: colors.primary || '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: colors.primary || '#F59E0B',
    flex: 1,
    marginHorizontal: 5,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 28,
  },
  logMealButton: {
    marginTop: 10,
  },
});

export default NewMealEntryScreen;