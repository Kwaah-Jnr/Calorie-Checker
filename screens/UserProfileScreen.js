// screens/UserProfileScreen.js
// ONLY USE THIS VERSION AFTER INSTALLING: npm install @react-native-async-storage/async-storage

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { TextInput, Card, Header } from '../components';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({ navigation }) => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [bmr, setBmr] = useState(null);

  const USER_DATA_KEY = '@user_profile_data';

  // Load user data from AsyncStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
        if (jsonValue != null) {
          const loadedData = JSON.parse(jsonValue);
          setAge(loadedData.age || 30);
          setGender(loadedData.gender || 'male');
          setWeight(loadedData.weight || '');
          setHeight(loadedData.height || '');
          setActivityLevel(loadedData.activityLevel || 'sedentary');
        }
      } catch (e) {
        console.error('Failed to load user data:', e);
      }
    };
    loadUserData();
  }, []);

  // Save user data to AsyncStorage and calculate BMR whenever relevant state changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        const dataToSave = { age, gender, weight, height, activityLevel };
        const jsonValue = JSON.stringify(dataToSave);
        await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
      } catch (e) {
        console.error('Failed to save user data:', e);
      }
    };
    
    // Only save and calculate if we have some data (avoid saving initial empty state)
    if (weight || height) {
      saveUserData();
    }
    
    // Recalculate BMR if inputs are valid
    if (parseFloat(weight) > 0 && parseFloat(height) > 0 && parseInt(age) > 0) {
      calculateBMR();
    } else {
      setBmr(null);
    }
  }, [age, gender, weight, height, activityLevel]);

  // BMR Calculation (Mifflin-St Jeor Equation)
  const calculateBMR = () => {
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    const parsedAge = parseInt(age);

    if (isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedAge) || parsedWeight <= 0 || parsedHeight <= 0 || parsedAge <= 0) {
      return;
    }

    let calculatedBMR;
    if (gender === 'male') {
      calculatedBMR = (10 * parsedWeight) + (6.25 * parsedHeight) - (5 * parsedAge) + 5;
    } else {
      calculatedBMR = (10 * parsedWeight) + (6.25 * parsedHeight) - (5 * parsedAge) - 161;
    }

    let tdee;
    switch (activityLevel) {
      case 'sedentary':
        tdee = calculatedBMR * 1.2;
        break;
      case 'lightly_active':
        tdee = calculatedBMR * 1.375;
        break;
      case 'moderately_active':
        tdee = calculatedBMR * 1.55;
        break;
      case 'very_active':
        tdee = calculatedBMR * 1.725;
        break;
      case 'extra_active':
        tdee = calculatedBMR * 1.9;
        break;
      default:
        tdee = calculatedBMR * 1.2;
    }

    setBmr(Math.round(tdee));
  };

  const ages = Array.from({ length: 90 }, (_, i) => i + 10);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="User Profile"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Card style={styles.inputCard}>
          <Text style={styles.inputLabel}>Gender:</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>

          <Text style={styles.inputLabel}>Age (Years):</Text>
          <Picker
            selectedValue={age}
            onValueChange={(itemValue) => setAge(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {ages.map((a) => (
              <Picker.Item key={a} label={a.toString()} value={a} />
            ))}
          </Picker>

          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="e.g., 70"
            style={styles.textInput}
          />
          <TextInput
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="e.g., 175"
            style={styles.textInput}
          />

          <Text style={styles.inputLabel}>Activity Level:</Text>
          <Picker
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" />
            <Picker.Item label="Lightly Active (light exercise/sports 1-3 days/week)" value="lightly_active" />
            <Picker.Item label="Moderately Active (moderate exercise/sports 3-5 days/week)" value="moderately_active" />
            <Picker.Item label="Very Active (hard exercise/sports 6-7 days a week)" value="very_active" />
            <Picker.Item label="Extra Active (very hard exercise/physical job)" value="extra_active" />
          </Picker>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateBMR}>
            <Text style={styles.calculateButtonText}>Recalculate Maintenance Calories</Text>
          </TouchableOpacity>
        </Card>

        {bmr !== null && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Your Estimated Daily Calorie Needs:</Text>
            <Text style={styles.bmrResult}>{bmr} Calories/day</Text>
            <Text style={styles.resultText}>
              This is your estimated Total Daily Energy Expenditure (TDEE).
              Consuming this amount of calories should help you maintain your current weight,
              based on your inputs and activity level.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    fontSize: 24,
    color: colors.text,
    paddingHorizontal: ui.padding,
  },
  scrollContent: {
    padding: ui.padding,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: colors.white,
    padding: ui.padding,
    borderRadius: ui.borderRadius,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    marginTop: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: colors.gray,
    borderRadius: ui.borderRadius,
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 16,
    color: colors.text,
  },
  textInput: {
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: ui.borderRadius,
    alignItems: 'center',
    marginTop: 20,
  },
  calculateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: colors.white,
    padding: ui.padding,
    borderRadius: ui.borderRadius,
    marginTop: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  bmrResult: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default UserProfileScreen;