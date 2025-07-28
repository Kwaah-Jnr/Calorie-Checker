import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Button, Card, Header, BottomNavigation } from '../components';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';

const CalorieDashboardScreen = ({ route }) => {
  const navigation = useNavigation();
  
  // Get calculated values from navigation params
  const { bmr, tdee, userDetails } = route?.params || {};

  // Use actual user input data
  const currentWeight = userDetails?.weight || 0;
  const userAge = userDetails?.age || 0;
  const userHeight = userDetails?.height || 0;
  const userGender = userDetails?.gender || 'male';
  const desiredWeight = Math.round(currentWeight * 0.93); // Example: 7% weight loss goal

  const handleStartTracking = () => {
    navigation.navigate('MealTracker');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Chart data simulation
  const chartData = [0.6, 0.8, 0.4, 0.9, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.3, 0.6];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <Header 
        title="Calorie" 
        showBackButton={true} 
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚡</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <Card style={styles.profileCardContent}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarIcon}>
                {userGender === 'male' ? '👨' : '👩'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>User Profile</Text>
              <Text style={styles.profileDetails}>
                {userGender === 'male' ? 'Male' : 'Female'}, {userAge} years old
              </Text>
            </View>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current weight</Text>
              <Text style={styles.statValue}>{currentWeight} kg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Desired weight</Text>
              <Text style={styles.statValue}>{desiredWeight}kg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statValue}>Maintain</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current diet plan</Text>
              <Text style={styles.statValue}>N/A</Text>
            </View>
          </View>
        </Card>

        {/* Measurements Card */}
        <Card style={styles.measurementsCardContent}>
          <Text style={styles.cardTitle}>Measurements</Text>
          
          <View style={styles.measurementsList}>
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Weight</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>{currentWeight} kg</Text>
                <Text style={styles.measurementChange}>-</Text>
              </View>
            </View>
            
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Body fat</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>15%</Text>
                <Text style={[styles.measurementChange, styles.negativeChange]}>-2%</Text>
              </View>
            </View>
            
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Waist</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>95 cm</Text>
                <Text style={[styles.measurementChange, styles.positiveChange]}>+2cm</Text>
              </View>
            </View>
            
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Chest</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>90 cm</Text>
                <Text style={[styles.measurementChange, styles.negativeChange]}>-3cm</Text>
              </View>
            </View>

            <View style={[styles.measurementRow, styles.borderTop]}>
              <Text style={styles.measurementLabel}>Daily Calorie Goal</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={[styles.measurementValue, styles.calorieGoal]}>
                  {tdee?.toLocaleString() || '0'} cal
                </Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>BMR (Rest)</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>
                  {bmr?.toLocaleString() || '0'} cal
                </Text>
              </View>
            </View>
            
            <View style={styles.measurementRow}>
              <Text style={styles.measurementLabel}>Height</Text>
              <View style={styles.measurementValueContainer}>
                <Text style={styles.measurementValue}>{userHeight} cm</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Statistics Card */}
        <Card style={styles.statisticsCardContent}>
          <Text style={styles.cardTitle}>Statistics</Text>
          
          {/* Chart representation */}
          <View style={styles.chartContainer}>
            {chartData.map((height, index) => (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  { height: Math.max(height * 80, 8) }
                ]}
              />
            ))}
          </View>
          
          <Text style={styles.chartDescription}>
            Daily calorie intake over the last 2 weeks
          </Text>
        </Card>

        {/* Action Button */}
        <Button 
          title="Start Tracking Meals" 
          onPress={handleStartTracking} 
          style={styles.actionButton}
        />

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation 
        items={[
          { icon: '🏠', label: 'Home' },
          { icon: '🔍', label: 'Search' },
          { icon: '❤️', label: 'Health', active: true },
          { icon: '👤', label: 'Profile' },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: ui.padding,
    paddingTop: ui.padding,
  },
  profileCardContent: {
    marginBottom: ui.padding,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666666',
  },
  profileStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  measurementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  measurementsList: {
    gap: 12,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#666666',
  },
  measurementValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  measurementChange: {
    fontSize: 14,
    color: '#999999',
  },
  positiveChange: {
    color: '#10b981',
  },
  negativeChange: {
    color: '#ef4444',
  },
  calorieGoal: {
    color: '#ff6b35',
  },
  statisticsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: 8,
  },
  chartBar: {
    backgroundColor: '#ff6b35',
    width: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    minHeight: 8,
  },
  chartDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacing: {
    height: 80,
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

export default CalorieDashboardScreen;