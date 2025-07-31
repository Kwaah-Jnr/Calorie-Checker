import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Alert, ImageBackground, Image } from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { mealCategories, bottomNavItems, popularMeals } from '../constants/data';
import { MealContext } from '../context/MealContext';
import { Button, Card, Header, TextInput, BottomNavigation } from '../components';

const MealTrackerScreen = ({ navigation, route }) => {
    const { meals, addMeal } = useContext(MealContext);
    const [searchQuery, setSearchQuery] = useState('');
    const totalMealsLogged = meals.length;
  
  // Daily goal (can be made configurable)
  const dailyMealGoal = 6;
  const progressPercentage = Math.min(100, Math.round((totalMealsLogged / dailyMealGoal) * 100));

  
  const getTodaysMeals = () => {
    const mealsByType = {};
    meals.forEach(meal => {
      if (!mealsByType[meal.mealType]) {
        mealsByType[meal.mealType] = [];
      }
      mealsByType[meal.mealType].push(meal);
    });
    return mealsByType;
  };

  const todaysMeals = getTodaysMeals();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header 
        title="Meal Tracker" 
        rightComponent={
          <TouchableOpacity onPress={() => Alert.alert('Notifications!')}>
            <Text style={styles.notificationText}>🔔</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.userGreeting}>
        <View style={styles.profileIcon}><Text>👤</Text></View>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>Calorie Tracker User</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('NewMealEntry')}>
        <Card style={styles.progressCard}>
          <Text style={styles.progressText}>You've logged {totalMealsLogged} meals today!</Text>
          <Text style={styles.progressSubtext}>{progressPercentage}% of your daily goal met.</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.tapToLog}>Tap to log another meal</Text>
        </Card>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            label=""
            placeholder="Search meals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        

        {/* Most Popular meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Popular meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularMealsContainer}>
            {popularMeals.map((meal) => (
              <TouchableOpacity 
                key={meal.id} 
                style={styles.popularMealCard} 
                onPress={() => {
                  // Navigate to NewMealEntry with pre-filled data
                  navigation.navigate('NewMealEntry', { 
                    prefillData: {
                      foods: [{ name: meal.name, quantity: '1', unit: 'serving' }]
                    }
                  });
                }}
              >
                <ImageBackground 
                    source={meal.image} 
                    style={styles.popularMealImage} 
                    imageStyle={styles.popularMealImageStyle}
                    resizeMode="cover"
                    onError={(error) => console.log('Image loading error:', error)}>
                  {meal.isPremium && (
                    <View style={styles.premiumTag}>
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {meal.rating}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.popularMealDetails}>
                  <Text style={styles.popularMealName}>{meal.name}</Text>
                  <Text style={styles.popularMealChef}>{meal.chef}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {mealCategories.map((cat) => (
              <TouchableOpacity key={cat.name} style={styles.categoryItem} onPress={() => Alert.alert(`Selected: ${cat.name}`)}>
                <View style={styles.categoryIcon}><Text style={styles.categoryIconText}>{cat.icon}</Text></View>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
  items={bottomNavItems.map(item => ({
    ...item,
    onPress: () => navigation.navigate(item.routeName)
  }))}
  activeItem="Dashboard" // Set the active item to 'Dashboard'
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: colors.white 
    },
    userGreeting: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: ui.padding,
      marginBottom: ui.padding 
    },
    profileIcon: { 
      width: 40, 
      height: 40, 
      backgroundColor: colors.gray, 
      borderRadius: 20, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginRight: 12 
    },
    greeting: { 
      color: colors.textSecondary 
    },
    username: { 
      fontWeight: 'bold', 
      color: colors.text 
    },
    notificationText: { 
      fontSize: 24 
    },
    progressCard: { 
      marginHorizontal: ui.padding, 
      backgroundColor: colors.gray, 
      marginBottom: ui.padding 
    },
    progressText: { 
      fontWeight: '600', 
      color: colors.text 
    },
    progressSubtext: { 
      color: colors.textSecondary, 
      fontSize: 12, 
      marginVertical: 4 
    },
    progressBar: { 
      height: 4, 
      backgroundColor: colors.grayDark, 
      borderRadius: 2, 
      marginTop: 8 
    },
    progressFill: { 
      height: '100%', 
      backgroundColor: colors.primary, 
      borderRadius: 2 
    },
    tapToLog: { 
      fontSize: 12, 
      color: colors.primaryDark, 
      fontStyle: 'italic', 
      marginTop: 8 
    },
    scrollContainer: { 
      paddingHorizontal: ui.padding 
    },
    searchContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 24 
    },
    searchInput: { 
      flex: 1, 
      marginRight: 12 
    },
    filterButton: { 
      backgroundColor: colors.primary, 
      padding: 12, 
      borderRadius: ui.borderRadius 
    },
    filterIcon: { 
      color: colors.white, 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    section: { 
      marginBottom: 24 
    },
    sectionTitle: { 
      fontSize: 18, 
      fontWeight: '600', 
      marginBottom: 12 
    },
    categoriesGrid: { 
      flexDirection: 'row', 
      justifyContent: 'space-between' 
    },
    categoryItem: { 
      alignItems: 'center', 
      flex: 1 
    },
    categoryIcon: { 
      width: 60, 
      height: 60, 
      backgroundColor: colors.gray, 
      borderRadius: 30, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginBottom: 8 
    },
    categoryIconText: { 
      fontSize: 24 
    },
    categoryText: { 
      color: colors.textSecondary, 
      fontSize: 12 
    },
    // Styles for "Most Popular meals" section
    popularMealsContainer: {
        paddingBottom: 10,
    },
    popularMealCard: {
        width: 250,
        marginRight: 15,
        borderRadius: ui.borderRadius,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    popularMealImage: {
        width: '100%',
        height: 150,
        justifyContent: 'space-between',
        padding: 10,
    },
    popularMealImageStyle: {
        borderRadius: ui.borderRadius,
    },
    premiumTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    premiumText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    ratingContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    popularMealDetails: {
        padding: ui.padding,
        backgroundColor: colors.gray,
        borderBottomLeftRadius: ui.borderRadius,
        borderBottomRightRadius: ui.borderRadius,
    },
    popularMealName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    popularMealChef: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    // New styles for logged meals
    mealTypeContainer: {
        marginBottom: 16,
    },
    mealTypeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    loggedMealCard: {
        marginBottom: 12,
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: ui.borderRadius,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    mealTime: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    editIcon: {
        fontSize: 16,
    },
    foodItemsList: {
        gap: 4,
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
    },
    foodName: {
        fontSize: 14,
        color: colors.text,
        flex: 1,
    },
    foodQuantity: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default MealTrackerScreen;