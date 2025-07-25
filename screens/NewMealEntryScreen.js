import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import CheckBox from '@react-native-community/checkbox'; // Fixed import
import DateTimePicker from '@react-native-community/datetimepicker'; // Fixed import

// You might want to define these in a separate data file if they grow
const mealTypes = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
];

const NewMealEntryScreen = ({ navigation }) => {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealType, setMealType] = useState('breakfast'); // Default to breakfast
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickLog, setIsQuickLog] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const handleLogMeal = () => {
    if (!mealName || !calories) {
      Alert.alert('Missing Information', 'Please enter meal name and calories.');
      return;
    }

    const newMeal = {
      name: mealName,
      calories: parseFloat(calories),
      protein: parseFloat(protein || 0),
      carbs: parseFloat(carbs || 0),
      fats: parseFloat(fats || 0),
      type: mealType,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      time: time.toTimeString().split(' ')[0].substring(0, 5), // HH:MM
      isFavorite,
      isQuickLog,
    };

    Alert.alert('Meal Logged!', `Successfully logged: ${newMeal.name} - ${newMeal.calories} kcal`);
    console.log('Logged Meal:', newMeal);
    // In a real app, you would save this to state, a database, or send to an API.
    // For now, we'll just go back.
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Meal Entry</Text>
        <View style={{ width: 40 }} /> {/* Placeholder for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Meal Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Meal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Grilled Chicken Salad"
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        {/* Nutritional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Calories (kcal)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={protein}
                onChangeText={setProtein}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Fats (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={fats}
                onChangeText={setFats}
              />
            </View>
          </View>
        </View>

        {/* Meal Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeButtonsContainer}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.mealTypeButton,
                  mealType === type.value && styles.mealTypeButtonSelected,
                ]}
                onPress={() => setMealType(type.value)}
              >
                <Text
                  style={[
                    styles.mealTypeButtonText,
                    mealType === type.value && styles.mealTypeButtonTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner" // Use spinner for time wheel
                onChange={onTimeChange}
              />
            )}
          </View>
        </View>

        {/* Options (Checkboxes) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isFavorite}
              onValueChange={setIsFavorite}
              tintColors={{ true: colors.primary, false: colors.textSecondary }}
            />
            <Text style={styles.checkboxLabel}>Mark as Favorite</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isQuickLog}
              onValueChange={setIsQuickLog}
              tintColors={{ true: colors.primary, false: colors.textSecondary }}
            />
            <Text style={styles.checkboxLabel}>Quick Log (No details needed)</Text>
          </View>
        </View>

        {/* Log Meal Button */}
        <TouchableOpacity style={styles.logMealButton} onPress={handleLogMeal}>
          <Text style={styles.logMealButtonText}>Log Meal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayDark,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Extra padding for scroll
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  pickerContainer: {
    backgroundColor: colors.gray,
    borderRadius: 8,
    overflow: 'hidden', // Ensures the picker respects border radius
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.text,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  logMealButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logMealButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealTypeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap to next line
    justifyContent: 'flex-start', // Align to start
  },
  mealTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayDark,
    marginRight: 10,
    marginBottom: 10, // For wrapping
  },
  mealTypeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mealTypeButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  mealTypeButtonTextSelected: {
    color: colors.white,
  },
});

export default NewMealEntryScreen;