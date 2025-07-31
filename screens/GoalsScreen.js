import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView
} from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import Header from '../components/Header';

const GoalsScreen = ({ navigation }) => {
  // Basic user stats
  const [currentWeight, setCurrentWeight] = useState('70');
  const [targetWeight, setTargetWeight] = useState('65');
  const [timeframe, setTimeframe] = useState('12');
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('30');

  // Goal selection
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [dailyCalories, setDailyCalories] = useState('2200');

  // Activity level options
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (6-7 days/week)' },
    { value: 'extra_active', label: 'Extra Active (2x/day)' }
  ];

  // Goal options
  const goalOptions = [
    { id: 'maintain', label: 'Maintain Weight', calories: dailyCalories },
    { id: 'lose_slow', label: 'Lose 0.25kg/week', calories: parseInt(dailyCalories) - 250 },
    { id: 'lose_moderate', label: 'Lose 0.5kg/week', calories: parseInt(dailyCalories) - 500 },
    { id: 'gain_slow', label: 'Gain 0.25kg/week', calories: parseInt(dailyCalories) + 250 },
    { id: 'gain_moderate', label: 'Gain 0.5kg/week', calories: parseInt(dailyCalories) + 500 }
  ];

  // Calculate estimated time to reach goal
  const calculateTimeToGoal = () => {
    const weightDiff = Math.abs(parseFloat(currentWeight) - parseFloat(targetWeight));
    const weeklyLoss = selectedGoal.includes('lose') ? 0.5 : selectedGoal.includes('gain') ? -0.5 : 0;
    return weeklyLoss > 0 ? Math.ceil(weightDiff / weeklyLoss) : 0;
  };

  const handleSaveGoals = () => {
    const timeToGoal = calculateTimeToGoal();
    
    Alert.alert(
      'Goals Saved',
      `Daily calories: ${dailyCalories}\nTarget weight: ${targetWeight}kg\nEstimated time: ${timeToGoal} weeks`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <Header 
        title="Set Goals" 
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Stats</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Target Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'male' && styles.activeGender]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderText, gender === 'male' && styles.activeGenderText]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderButton, gender === 'female' && styles.activeGender]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderText, gender === 'female' && styles.activeGenderText]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.activityButtons}>
            {activityLevels.map(level => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.activityButton,
                  activityLevel === level.value && styles.activeActivityButton
                ]}
                onPress={() => setActivityLevel(level.value)}
              >
                <Text style={[
                  styles.activityText,
                  activityLevel === level.value && styles.activeActivityText
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Goal</Text>
          <View style={styles.goalButtons}>
            {goalOptions.map(goal => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalButton,
                  selectedGoal === goal.id && styles.activeGoalButton
                ]}
                onPress={() => {
                  setSelectedGoal(goal.id);
                  setDailyCalories(goal.calories.toString());
                }}
              >
                <Text style={[
                  styles.goalText,
                  selectedGoal === goal.id && styles.activeGoalText
                ]}>
                  {goal.label}
                </Text>
                <Text style={[
                  styles.goalCalories,
                  selectedGoal === goal.id && styles.activeGoalText
                ]}>
                  {goal.calories} cal/day
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Calories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Calories</Text>
          <TextInput
            style={styles.calorieInput}
            value={dailyCalories}
            onChangeText={setDailyCalories}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveGoals}
        >
          <Text style={styles.saveButtonText}>Save Goals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: ui.padding,
    // paddingBottom: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeGender: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    color: colors.text,
  },
  activeGenderText: {
    color: colors.white,
  },
  activityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityButton: {
    width: '48%',
    padding: 12,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  activeActivityButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activityText: {
    color: colors.text,
    textAlign: 'center',
  },
  activeActivityText: {
    color: colors.white,
  },
  goalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalButton: {
    width: '100%',
    padding: 15,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  activeGoalButton: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  goalText: {
    color: colors.text,
    fontWeight: '500',
  },
  activeGoalText: {
    color: colors.primary,
  },
  goalCalories: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
  calorieInput: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: ui.borderRadius,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,

  },
});

export default GoalsScreen;