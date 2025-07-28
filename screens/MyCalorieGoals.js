import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const CalorieCalculatorScreen = () => {
  const [selectedGender, setSelectedGender] = useState('male');
  const navigation = useNavigation();
  const [selectedActivityMultiplier, setSelectedActivityMultiplier] = useState(1.55);
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  

  const activityLevels = [
    {
      title: 'Sedentary',
      description: 'Little to no exercise, desk job',
      multiplier: 1.2,
    },
    {
      title: 'Lightly Active',
      description: 'Light exercise/sports 1-3 days/week',
      multiplier: 1.375,
    },
    {
      title: 'Moderately Active',
      description: 'Moderate exercise/sports 3-5 days/week',
      multiplier: 1.55,
    },
    {
      title: 'Very Active',
      description: 'Hard exercise/sports 6-7 days a week',
      multiplier: 1.725,
    },
    {
      title: 'Extra Active',
      description: 'Very hard exercise, physical job, or training 2x per day',
      multiplier: 1.9,
    },
  ];

  const calculateCalories = () => {
    const ageNum = parseInt(age) || 30;
    const weightNum = parseFloat(weight) || 70;
    const heightNum = parseFloat(height) || 175;

    let calculatedBmr;
    if (selectedGender === 'male') {
      calculatedBmr = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
    } else {
      calculatedBmr = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
    }

    const calculatedTdee = calculatedBmr * selectedActivityMultiplier;

    setBmr(Math.round(calculatedBmr));
    setTdee(Math.round(calculatedTdee));
  };

  useEffect(() => {
    calculateCalories();
  }, [selectedGender, selectedActivityMultiplier, age, weight, height]);

  const renderGenderOption = (gender, label) => (
    <TouchableOpacity
      key={gender}
      style={[
        styles.genderOption,
        selectedGender === gender && styles.genderOptionSelected,
      ]}
      onPress={() => setSelectedGender(gender)}
    >
      <Text
        style={[
          styles.genderOptionText,
          selectedGender === gender && styles.genderOptionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderActivityOption = (level) => (
    <TouchableOpacity
      key={level.multiplier}
      style={[
        styles.activityOption,
        selectedActivityMultiplier === level.multiplier && styles.activityOptionSelected,
      ]}
      onPress={() => setSelectedActivityMultiplier(level.multiplier)}
    >
      <Text
        style={[
          styles.activityTitle,
          selectedActivityMultiplier === level.multiplier && styles.activityTitleSelected,
        ]}
      >
        {level.title}
      </Text>
      <Text style={styles.activityDescription}>{level.description}</Text>
    </TouchableOpacity>
  );

  const handleCalculatePress = () => {
  navigation.navigate('CalorieDashboard', {
    bmr: bmr,
    tdee: tdee,
    userDetails: {
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender: selectedGender
    }
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Calorie Needs</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Details Section */}
        <Text style={styles.sectionHeader}>My Details</Text>
        
        <View style={styles.inputCard}>
          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderOptions}>
              {renderGenderOption('male', 'Male')}
              {renderGenderOption('female', 'Female')}
            </View>
          </View>

          {/* Age Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.inputField}
              value={age}
              onChangeText={setAge}
              placeholder="30 years"
              keyboardType="numeric"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight</Text>
            <TextInput
              style={styles.inputField}
              value={weight}
              onChangeText={setWeight}
              placeholder="70 kg"
              keyboardType="numeric"
            />
          </View>

          {/* Height Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height</Text>
            <TextInput
              style={styles.inputField}
              value={height}
              onChangeText={setHeight}
              placeholder="175 cm"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Activity Level Section */}
        <Text style={styles.sectionHeader}>My Activity Level</Text>
        
        <View style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>How active are you?</Text>
            <View style={styles.activityOptions}>
              {activityLevels.map(renderActivityOption)}
            </View>
          </View>
        </View>

        {/* Results Section */}
        <Text style={styles.sectionHeader}>Your Estimated Daily Needs</Text>
        
        <View style={styles.resultsCard}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>BMR (Calories at Rest)</Text>
            <Text style={styles.resultValue}>{bmr.toLocaleString()} calories/day</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>TDEE (Total Calories per Day)</Text>
            <Text style={styles.resultValue}>{tdee.toLocaleString()} calories/day</Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          These are estimates. Consult a professional for precise assessments.
        </Text>

        {/* Bottom spacing for scroll */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculatePress}>
  <Text style={styles.calculateButtonText}>Calculate</Text>
</TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    height: 60,
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    fontSize: 20,
    color: '#333333',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 20,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    marginTop: 24,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  inputField: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  genderOptionSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff5f2',
  },
  genderOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  genderOptionTextSelected: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  activityOptions: {
    gap: 8,
  },
  activityOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  activityOptionSelected: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff5f2',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  activityTitleSelected: {
    color: '#ff6b35',
  },
  activityDescription: {
    fontSize: 13,
    color: '#666666',
  },
  resultsCard: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  resultItem: {
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 100,
  },
  calculateButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    paddingVertical: 16,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 12,
    height: 80,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {},
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#666666',
  },
  navIconActive: {
    color: '#ff6b35',
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
  },
  navLabelActive: {
    color: '#ff6b35',
  },
});

export default CalorieCalculatorScreen;