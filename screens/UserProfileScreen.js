import React, { useState,useEffect,useContext } from 'react';
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
import { MealContext } from '../context/MealContext';

const UserProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, goals } = useContext(MealContext);

  const  [goal,setGoal] = useState(goals || {
    dailyCalories: 2000,
    dailyMealGoal: 3,
    targetWeight: 70, 
    selectedGoal: 'maintain',
    activityLevel: 1.55, // Moderately active 
    bmr: 1650, // Will be calculated based on user stats
    tdee: 2558  // Will be calculated based on activity level   
    });
  
  const [profile, setProfile] = useState(userProfile || {
    name: 'John Doe',
    email: 'jd@dummy.com',
    age:0,
    gender: 'male',
    height: 175,
    weight: 70,
  });

  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const updateProfileField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getBMI = () => {
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = getBMI();
    if (bmi < 18.5) return { category: 'Underweight', color: colors.blue, bg: colors.blueLight };
    if (bmi < 25) return { category: 'Normal', color: colors.green, bg: colors.greenLight };
    if (bmi < 30) return { category: 'Overweight', color: colors.yellow, bg: colors.yellowLight };
    return { category: 'Obese', color: colors.error, bg: colors.errorLight };
  };
  
    const handleSave = () => {
    updateProfile(profile);
    
    setIsEditing(false);
    Alert.alert('Success', 'Profile saved successfully!');
    navigation.navigate({
      name: 'Dashboard',
      params: { updatedName: profile.name },
      merge: true,
    });
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
    } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
    }
  };

  const calculateTDEE = (bmr, activityLevel) => {
    return Math.round(bmr * activityLevel);
  };

  const handleSetGoals = () => {

    const bmr = calculateBMR(
      profile.weight,
      profile.height,
      profile.age,
      profile.gender
    );
    const tdee = calculateTDEE(bmr, goals?.activityLevel || 1.55);
        navigation.navigate('Goals', { 
      updatedStats: {
        currentWeight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        bmr,
        tdee
      },
      updateGoals: navigation.navigate('Goals', {
              screen: 'MealTracker',
            params: { updatedName: profile.name },})
 // Pass through if needed
    });
  };
  

  const handleViewProgress = () => {
    navigation.navigate('MainTabs', {screen: 'Dashboard'});
  };

  const TabButton = ({ id, label }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(id)}
      style={[
        styles.tabButton,
        activeTab === id ? styles.activeTabButton : styles.inactiveTabButton
      ]}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === id ? styles.activeTabButtonText : styles.inactiveTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="User Profile" 
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderContent}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}> {profile.name && profile.name.length > 0 ? profile.name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profileDetails}>
                {profile.age} years • {profile.gender === 'male' ? 'Male' : 'Female'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              style={styles.settingsButton}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
         

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.blueLight }]}>
              <Text style={styles.statIconText}>📏</Text>
            </View>
            <Text style={styles.statValue}>{profile.height}</Text>
            <Text style={styles.statLabel}>cm</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.greenLight }]}>
              <Text style={styles.statIconText}>❤️</Text>
            </View>
            <Text style={styles.statValue}>{profile.weight}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.purpleLight }]}>
              <Text style={styles.statIconText}>📅</Text>
            </View>
            <Text style={styles.statValue}>{profile.age}</Text>
            <Text style={styles.statLabel}>years</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: getBMICategory().bg }]}>
              <Text style={styles.statIconText}>ℹ️</Text>
            </View>
            <Text style={styles.statValue}>{getBMI()}</Text>
            <Text style={[styles.statLabel, { color: getBMICategory().color }]}>
              {getBMICategory().category}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton id="personal" label="Personal Info" />
         

        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'personal' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput
                    ]}
                    value={profile.name}
                    onChangeText={(value) => updateProfileField('name', value)}
                    editable={isEditing}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput
                    ]}
                    value={profile.email}
                    onChangeText={(value) =>updateProfileField('email', value)}
                    editable={isEditing}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput
                    ]}
                    value={profile.age ? profile.age.toString() : '0'}
                    onChangeText={(value) => updateProfileField('age', parseInt(value) || 0)}
                    editable={isEditing}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <View style={styles.genderButtons}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        profile.gender === 'male' && styles.activeGenderButton
                      ]}
                      onPress={() => updateProfileField('gender', 'male')}
                      disabled={!isEditing}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        profile.gender === 'male' && styles.activeGenderButtonText
                      ]}>
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        profile.gender === 'female' && styles.activeGenderButton
                      ]}
                      onPress={() => updateProfileField('gender', 'female')}
                      disabled={!isEditing}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        profile.gender === 'female' && styles.activeGenderButtonText
                      ]}>
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput
                    ]}
                    value={profile.height ? profile.height.toString() : '0'}
                    onChangeText={(value) => updateProfileField('height', parseInt(value) || 0)}
                    editable={isEditing}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !isEditing && styles.disabledInput
                    ]}
                    value={profile.weight ? profile.weight.toString() : '0'}
                    onChangeText={(value) => updateProfileField('weight', parseInt(value) || 0)}
                    editable={isEditing}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}
          
          {isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.footerButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>💾 Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

{/*      
{activeTab === 'goals' && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Goals</Text>

    
    <Text style={styles.subsectionTitle}>Daily Calorie Goal</Text>
    <View style={styles.inputRow}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Calories</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={goals.dailyCalories ? goals.dailyCalories.toString() : '0'}
          onChangeText={(value) =>
            updateProfileField('dailyCalories', parseInt(value) || 0)
          }
          editable={isEditing}
          keyboardType="numeric"
        />
      </View>
    </View>

    
    <Text style={styles.subsectionTitle}>Daily Meal Goal</Text>
    <View style={styles.inputRow}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Meals</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={goals.dailyMealGoal ? goals.dailyMealGoal.toString() : '0'}
          onChangeText={(value) =>
            updateProfileField('dailyMealGoal', parseInt(value) || 0)
          }
          editable={isEditing}
          keyboardType="numeric"
        />
      </View>
    </View>

    
    <Text style={styles.subsectionTitle}>Target Weight</Text>
    <View style={styles.inputRow}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Weight (kg)</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={goals.targetWeight ? goals.targetWeight.toString() : '0'}
          onChangeText={(value) =>
            updateProfileField('targetWeight', parseInt(value) || 0)
          }
          editable={isEditing}
          keyboardType="numeric"
        />
      </View>

      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Activity Level</Text>
        <View style={styles.checkboxGrid}>
          {['sedentary', 'lightly active', 'moderately active', 'very active', 'super active'].map(
            (level, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.checkboxOption,
                  goals.activityLevel === index + 1 && styles.checkboxOptionSelected,
                  !isEditing && styles.checkboxOptionDisabled
                ]}
                onPress={() => isEditing && updateProfileField('activityLevel', index + 1)}
                disabled={!isEditing}
              >
                <Text
                  style={[
                    styles.checkboxOptionText,
                    goals.activityLevel === index + 1 && styles.checkboxOptionTextSelected
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  </View>
)}*/}
    



        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleViewProgress}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.blueLight }]}>
              <Text style={styles.quickActionIconText}>👀</Text>
            </View>
            <Text style={styles.quickActionTitle}>View Progress</Text>
            <Text style={styles.quickActionSubtitle}>See your journey so far</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction} onPress={handleSetGoals}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.greenLight }]}>
              <Text style={styles.quickActionIconText}>⚙️</Text>
            </View>
            <Text style={styles.quickActionTitle}>Set Goals</Text>
            <Text style={styles.quickActionSubtitle}>Configure your targets</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>

      {/* Save Button */}
  
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
    paddingBottom: 200,
  },
  profileHeader: {
    backgroundColor: colors.primary,
    borderRadius: ui.borderRadius,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.whiteOpacity90,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 12,
    color: colors.whiteOpacity70,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 8,
    marginBottom: 20,
    elevation: 2,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: ui.borderRadius,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  inactiveTabButton: {
    backgroundColor: colors.white,
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: colors.white,
  },
  inactiveTabButtonText: {
    color: colors.textSecondary,
  },
  tabContent: {
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    // height: 'auto',
    minHeight: 200,
  },
  section: {
    marginBottom: 20,
    height: 'auto',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: ui.borderRadius,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: colors.backgroundLight,
    borderColor: colors.borderLight,
    color: colors.textSecondary,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginRight: 8,
  },
  activeGenderButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  activeGenderButtonText: {
    color: colors.white,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  toggleLabel: {
    fontSize: 15,
    color: colors.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxOption: {
    width: '48%',
    padding: 12,
    borderRadius: ui.borderRadius,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  checkboxOptionSelected: {
    backgroundColor: colors.primaryLight10,
    borderColor: colors.primary,
  },
  checkboxOptionDisabled: {
    opacity: 0.5,
  },
  checkboxOptionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  checkboxOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: ui.borderRadius,
    padding: 16,
    elevation: 2,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
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
    flexDirection: 'row',
    zIndex: 10,
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    padding: 16,
    borderRadius: ui.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    color: colors.success,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default UserProfileScreen;