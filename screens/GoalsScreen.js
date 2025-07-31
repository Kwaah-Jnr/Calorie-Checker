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
  // User stats with BMR and TDEE calculations
  const [userStats, setUserStats] = useState({
    bmr: 1800,
    tdee: 2200,
    currentWeight: 70,
    height: 175,
    age: 30,
    gender: 'male'
  });

  const [goalTypes, setGoalTypes] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [customCalories, setCustomCalories] = useState('2200');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [targetWeight, setTargetWeight] = useState('65');
  const [timeframe, setTimeframe] = useState('12');
  const [activityLevel, setActivityLevel] = useState(1.55);

  // Calculate BMR
  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
    } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
    }
  };

  // Calculate TDEE
  const calculateTDEE = (bmr, activity) => {
    return Math.round(bmr * activity);
  };

  // Update calculations when stats change
  useEffect(() => {
    const newBMR = calculateBMR(
      userStats.currentWeight,
      userStats.height,
      userStats.age,
      userStats.gender
    );
    const newTDEE = calculateTDEE(newBMR, activityLevel);
    
    setUserStats(prev => ({
      ...prev,
      bmr: newBMR,
      tdee: newTDEE
    }));
  }, [userStats.currentWeight, userStats.height, userStats.age, userStats.gender, activityLevel]);

  // Update goal types when TDEE changes
  useEffect(() => {
    const newGoalTypes = [
      {
        id: 'maintain',
        title: 'Maintain Weight',
        description: 'Stay at your current weight',
        calories: userStats.tdee,
        adjustment: 0,
        icon: '⚖️'
      },
      {
        id: 'lose_slow',
        title: 'Lose 0.25kg/week',
        description: 'Lose 0.25 kg per week',
        calories: userStats.tdee - 250,
        adjustment: -250,
        icon: '📉'
      },
      {
        id: 'lose_moderate',
        title: 'Lose 0.5kg/week',
        description: 'Lose 0.5 kg per week',
        calories: userStats.tdee - 500,
        adjustment: -500,
        icon: '📉'
      },
      {
        id: 'gain_slow',
        title: 'Gain 0.25kg/week',
        description: 'Gain 0.25 kg per week',
        calories: userStats.tdee + 250,
        adjustment: +250,
        icon: '📈'
      },
      {
        id: 'gain_moderate',
        title: 'Gain 0.5kg/week',
        description: 'Gain 0.5 kg per week',
        calories: userStats.tdee + 500,
        adjustment: +500,
        icon: '📈'
      }
    ];
    setGoalTypes(newGoalTypes);
  }, [userStats.tdee]);

  // Get selected goal data
  const selectedGoalData = goalTypes.find(g => g.id === selectedGoal) || goalTypes[0];
  const dailyCalories = isCustomMode ? parseInt(customCalories) || userStats.tdee : selectedGoalData?.calories || userStats.tdee;

  // Dynamic calculations
  const weeklyCalorieChange = selectedGoalData ? selectedGoalData.adjustment * 7 : 0;
  const estimatedWeightChangePerWeek = Math.abs(weeklyCalorieChange / 7700);
  const weightDifference = Math.abs(parseFloat(targetWeight) - userStats.currentWeight);
  const estimatedTimeToGoal = estimatedWeightChangePerWeek > 0 ? Math.ceil(weightDifference / estimatedWeightChangePerWeek) : 0;

  // Activity level options
  const activityLevels = [
    { value: 1.2, label: 'Sedentary (desk job)' },
    { value: 1.375, label: 'Lightly Active (1-3 days/week)' },
    { value: 1.55, label: 'Moderately Active (3-5 days/week)' },
    { value: 1.725, label: 'Very Active (6-7 days/week)' },
    { value: 1.9, label: 'Extremely Active (2x/day)' }
  ];

  const handleSaveGoals = () => {
    Alert.alert(
      'Goals Set Successfully!',
      `Daily Calorie Target: ${dailyCalories.toLocaleString()} calories\n` +
      `Estimated time to goal: ${estimatedTimeToGoal} weeks\n` +
      `Weekly change: ${selectedGoal.includes('lose') ? '-' : selectedGoal.includes('gain') ? '+' : ''}${estimatedWeightChangePerWeek.toFixed(2)} kg`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Set Your Goals" 
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>Your Current Stats</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.bmr.toLocaleString()}</Text>
              <Text style={styles.statLabel}>BMR</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.tdee.toLocaleString()}</Text>
              <Text style={styles.statLabel}>TDEE</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.currentWeight}kg</Text>
              <Text style={styles.statLabel}>Weight</Text>
            </View>
          </View>
          
          {/* Quick Edit Controls */}
          <View style={styles.editRow}>
            <View style={styles.editInputContainer}>
              <TextInput
                style={styles.editInput}
                value={userStats.currentWeight.toString()}
                onChangeText={value => setUserStats(prev => ({
                  ...prev, 
                  currentWeight: parseFloat(value) || 70
                }))}
                keyboardType="numeric"
                placeholder="Weight (kg)"
                placeholderTextColor={colors.whiteOpacity70}
              />
            </View>
            
            <View style={styles.editInputContainer}>
              <TextInput
                style={styles.editInput}
                value={userStats.age.toString()}
                onChangeText={value => setUserStats(prev => ({
                  ...prev, 
                  age: parseInt(value) || 30
                }))}
                keyboardType="numeric"
                placeholder="Age"
                placeholderTextColor={colors.whiteOpacity70}
              />
            </View>
            
            <View style={styles.editInputContainer}>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton, 
                    userStats.gender === 'male' && styles.activeGender
                  ]}
                  onPress={() => setUserStats(prev => ({...prev, gender: 'male'}))}
                >
                  <Text style={[
                    styles.genderText,
                    userStats.gender === 'male' && styles.activeGenderText
                  ]}>
                    Male
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.genderButton, 
                    userStats.gender === 'female' && styles.activeGender
                  ]}
                  onPress={() => setUserStats(prev => ({...prev, gender: 'female'}))}
                >
                  <Text style={[
                    styles.genderText,
                    userStats.gender === 'female' && styles.activeGenderText
                  ]}>
                    Female
                  </Text>
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
          <Text style={styles.sectionTitle}>Choose Your Goal</Text>
          <View style={styles.goalOptionsContainer}>
            {goalTypes.map(goal => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalOption,
                  selectedGoal === goal.id && styles.activeGoalOption
                ]}
                onPress={() => {
                  setSelectedGoal(goal.id);
                  setIsCustomMode(false);
                  setCustomCalories(goal.calories.toString());
                }}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <View style={styles.goalTextContainer}>
                  <Text style={[
                    styles.goalTitle,
                    selectedGoal === goal.id && styles.activeGoalTitle
                  ]}>
                    {goal.title}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <Text style={[
                  styles.goalCalories,
                  selectedGoal === goal.id && styles.activeGoalCalories
                  ]}>
                  {goal.calories.toLocaleString()} cal/day
                </Text>
                {goal.adjustment !== 0 && (
                  <View style={[
                    styles.adjustmentBadge,
                    goal.adjustment < 0 
                      ? styles.deficitBadge 
                      : styles.surplusBadge
                  ]}>
                    <Text style={styles.adjustmentText}>
                      {goal.adjustment > 0 ? '+' : ''}{goal.adjustment}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Goal Option */}
        <TouchableOpacity
          style={[
            styles.customGoalOption,
            isCustomMode && styles.activeCustomGoal
          ]}
          onPress={() => setIsCustomMode(true)}
        >
          <Text style={styles.customGoalIcon}>🎯</Text>
          <View style={styles.customGoalTextContainer}>
            <Text style={[
              styles.customGoalTitle,
              isCustomMode && styles.activeCustomTitle
            ]}>
              Custom Goal
            </Text>
            <Text style={styles.customGoalDescription}>
              Set your own calorie target
            </Text>
          </View>
        </TouchableOpacity>

        {isCustomMode && (
          <View style={styles.customCaloriesContainer}>
            <Text style={styles.inputLabel}>Daily Calories Target</Text>
            <TextInput
              style={styles.calorieInput}
              value={customCalories}
              onChangeText={setCustomCalories}
              keyboardType="numeric"
              placeholder="Enter calories"
            />
          </View>
        )}

        {/* Target Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Details</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Target Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="numeric"
                placeholder="Enter target weight"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Timeframe (weeks)</Text>
              <TextInput
                style={styles.input}
                value={timeframe}
                onChangeText={setTimeframe}
                keyboardType="numeric"
                placeholder="Enter weeks"
              />
            </View>
          </View>
        </View>

        {/* Progress Estimation */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>📊 Live Progress Estimation</Text>
          
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Daily Calorie Target</Text>
            <Text style={styles.progressValue}>{dailyCalories.toLocaleString()} cal</Text>
          </View>

          {selectedGoal !== 'maintain' && estimatedWeightChangePerWeek > 0 && (
            <>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Weekly Weight Change</Text>
                <Text style={[
                  styles.progressValue,
                  selectedGoal.includes('lose') 
                    ? styles.deficitValue 
                    : styles.surplusValue
                ]}>
                  {selectedGoal.includes('lose') ? '-' : '+'}{estimatedWeightChangePerWeek.toFixed(2)} kg
                </Text>
              </View>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Time to Goal Weight</Text>
                <Text style={styles.progressValue}>{estimatedTimeToGoal} weeks</Text>
              </View>

              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>
                  Daily {selectedGoal.includes('lose') ? 'Deficit' : 'Surplus'}
                </Text>
                <Text style={[
                  styles.progressValue,
                  selectedGoal.includes('lose') 
                    ? styles.deficitValue 
                    : styles.surplusValue
                ]}>
                  {Math.abs(selectedGoalData?.adjustment || 0)} cal
                </Text>
              </View>
            </>
          )}

          {selectedGoal === 'maintain' && (
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Goal</Text>
              <Text style={styles.progressValue}>Maintain Current Weight</Text>
            </View>
          )}
        </View>

        {/* Personalized Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>💡 Personalized Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Create a sustainable {selectedGoal.includes('lose') ? 'deficit' : 'surplus'}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Track your progress weekly, not daily</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Adjust calories based on real progress</Text>
          </View>
          {selectedGoal.includes('lose') && (
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Extreme restrictions often backfire</Text>
            </View>
          )}
          {selectedGoal.includes('gain') && (
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Focus on nutrient-dense foods</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.summaryText}>
            Target: <Text style={styles.calorieHighlight}>{dailyCalories.toLocaleString()} cal/day</Text>
          </Text>
          {estimatedTimeToGoal > 0 && (
            <Text style={styles.summaryText}>
              • {estimatedTimeToGoal} weeks to goal
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveGoals}
        >
          <Text style={styles.saveButtonText}>Set My Goals 🎯</Text>
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
    paddingBottom: 100,
  },
  statsCard: {
    borderRadius: ui.borderRadius,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: colors.primary, // Changed from gradient to solid color
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.whiteOpacity90,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  editInputContainer: {
    flex: 1,
  },
  editInput: {
    backgroundColor: colors.whiteOpacity20,
    borderRadius: ui.borderRadius,
    padding: 10,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.whiteOpacity30,
    fontSize: 14,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.whiteOpacity30,
    alignItems: 'center',
  },
  activeGender: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  genderText: {
    color: colors.white,
    fontSize: 14,
  },
  activeGenderText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
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
    fontSize: 14,
  },
  activeActivityText: {
    color: colors.white,
  },
  goalOptionsContainer: {
    gap: 12,
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  activeGoalOption: {
    backgroundColor: colors.primaryLight10,
    borderColor: colors.primary,
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  activeGoalTitle: {
    color: colors.primary,
  },
  goalDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  goalCalories: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  activeGoalCalories: {
    color: colors.primary,
  },
  adjustmentBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  deficitBadge: {
    backgroundColor: colors.errorLight,
  },
  surplusBadge: {
    backgroundColor: colors.successLight,
  },
  adjustmentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  customGoalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  activeCustomGoal: {
    backgroundColor: colors.primaryLight10,
    borderColor: colors.primary,
  },
  customGoalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  customGoalTextContainer: {
    flex: 1,
  },
  customGoalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  activeCustomTitle: {
    color: colors.primary,
  },
  customGoalDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  customCaloriesContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 0,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  calorieInput: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  progressContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: ui.borderRadius,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  progressLabel: {
    fontSize: 15,
    color: colors.text,
  },
  progressValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  deficitValue: {
    color: colors.error,
  },
  surplusValue: {
    color: colors.success,
  },
  tipsContainer: {
    backgroundColor: colors.infoLight,
    borderRadius: ui.borderRadius,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  calorieHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: ui.borderRadius,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    
  },
});

export default GoalsScreen;