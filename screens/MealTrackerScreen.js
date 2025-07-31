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
  ImageBackground,
  FlatList,
  Dimensions
} from 'react-native';
import { colors } from '../constants/colors';
import { ui } from '../constants/ui';
import { mealCategories, bottomNavItems, popularMeals } from '../constants/data';
import { MealContext } from '../context/MealContext';
import { Button, Card, Header, TextInput, BottomNavigation } from '../components';

const { width } = Dimensions.get('window');

const MealTrackerScreen = ({ navigation }) => {
  const mealContext = useContext(MealContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle case where context might be null/undefined
  const meals = mealContext?.meals || [];
  const goals = mealContext?.goals || {};
  
  const totalMealsLogged = meals.length;
  
  // Calculate daily progress based on goals
  const dailyMealGoal = goals?.dailyMealGoal || 6;
  const progressPercentage = Math.min(100, Math.round((totalMealsLogged / dailyMealGoal) * 100));
  
  // Calculate calorie consumption with proper error handling
  const calculateTotalCalories = () => {
    return meals.reduce((total, meal) => {
      if (!meal || !meal.foods) return total;
      return total + meal.foods.reduce((mealTotal, food) => {
        return mealTotal + (food?.calories || 0);
      }, 0);
    }, 0);
  };

  const totalCaloriesConsumed = calculateTotalCalories();
  const remainingCalories = goals?.dailyCalories ? goals.dailyCalories - totalCaloriesConsumed : 0;

  const getTodaysMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(meal => {
      if (!meal?.dateLogged) return false;
      return meal.dateLogged.split('T')[0] === today;
    });

  };

  const todaysMeals = getTodaysMeals();
  const mealsByType = todaysMeals.reduce((acc, meal) => {
    const mealType = meal?.mealType || 'Other';
    if (!acc[mealType]) {
      acc[mealType] = [];
    }
    acc[mealType].push(meal);
    return acc;
  }, {});

  const navigateToGoals = () => {
    if (navigation?.navigate) {
      navigation.navigate('Goals');
    }
  };

  const handleNewMealEntry = (prefillData = null) => {
    if (navigation?.navigate) {
      navigation.navigate('NewMealEntry', prefillData ? { prefillData } : undefined);
    }
  };

  const handleEditMeal = (meal) => {
    Alert.alert(
      'Edit Meal',
      'This feature will be available soon.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderMealTypeSection = (mealType) => {
    const mealsForType = mealsByType[mealType];
    if (!mealsForType?.length) return null;
    
    return (
      <View style={styles.mealTypeContainer} key={mealType}>
        <Text style={styles.mealTypeTitle}>{mealType}</Text>
        {mealsForType.map((meal, index) => (
          <Card key={`${mealType}-${index}`} style={styles.loggedMealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTime}>{meal?.time || 'Unknown time'}</Text>
              <TouchableOpacity onPress={() => handleEditMeal(meal)}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.foodItemsList}>
              {meal?.foods?.map((food, foodIndex) => (
                <View key={`food-${index}-${foodIndex}`} style={styles.foodItem}>
                  <Text style={styles.foodName}>{food?.name || 'Unknown food'}</Text>
                  <Text style={styles.foodQuantity}>
                    {food?.quantity || '?'} {food?.unit || 'unit'} • {food?.calories || '?'} cal
                  </Text>
                </View>
              )) || (
                <Text style={styles.noFoodsText}>No foods logged</Text>
              )}
            </View>
          </Card>
        ))}
      </View>
    );
  };

  const renderPopularMealItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity 
        style={styles.popularMealCard}
        onPress={() => {
          handleNewMealEntry({
            foods: [{ 
              name: item.name || 'Unknown meal', 
              quantity: '1', 
              unit: 'serving',
              calories: item.calories || 0
            }]
          });
        }}
      >
        <ImageBackground 
          source={item.image} 
          style={styles.popularMealImage}
          imageStyle={styles.popularMealImageStyle}
        >
          {item.isPremium && (
            <View style={styles.premiumTag}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating || '0.0'}</Text>
          </View>
        </ImageBackground>
        <View style={styles.popularMealDetails}>
          <Text style={styles.popularMealName}>{item.name || 'Unknown meal'}</Text>
          <Text style={styles.popularMealCalories}>{item.calories || 0} cal</Text>
          <Text style={styles.popularMealChef}>{item.chef || 'Unknown chef'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = (cat) => {
    if (!cat) return null;
    
    return (
      <TouchableOpacity 
        key={cat.name || Math.random().toString()} 
        style={styles.categoryItem}
        onPress={() => handleNewMealEntry({ mealType: cat.name })}
      >
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryIconText}>{cat.icon || '🍽️'}</Text>
        </View>
        <Text style={styles.categoryText}>{cat.name || 'Category'}</Text>
      </TouchableOpacity>
    );
  };

  const handleBottomNavPress = (item) => {
    if (navigation?.navigate && item?.routeName) {
      navigation.navigate(item.routeName);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <Header 
        title="Meal Tracker" 
        rightComponent={
          <TouchableOpacity onPress={navigateToGoals}>
            <Text style={styles.goalsIcon}>🎯</Text>
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

      <TouchableOpacity onPress={() => handleNewMealEntry()}>
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Today's Progress</Text>
            {goals?.dailyCalories && (
              <Text style={styles.calorieGoal}>
                Goal: {goals.dailyCalories} cal • Remaining: {Math.max(0, remainingCalories)} cal
              </Text>
            )}
          </View>
          <Text style={styles.progressSubtext}>
            You've logged {totalMealsLogged} meals ({totalCaloriesConsumed} cal)
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.tapToLog}>Tap to log another meal</Text>
        </Card>
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContainer, {paddingBottom: 16}]}
      >
        {/* Today's Meals */}
        {Object.keys(mealsByType).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(renderMealTypeSection)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No meals logged today</Text>
            <Button
              title="Log Your First Meal"
              onPress={() => handleNewMealEntry()}
              style={styles.emptyStateButton}
            />
          </View>
        )}

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <TextInput

            placeholder="Search meals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        {/* Most Popular Meals */}
        {popularMeals && popularMeals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Popular Meals</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularMeals}
              keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
              contentContainerStyle={styles.popularMealsContainer}
              renderItem={renderPopularMealItem}
            />
          </View>
        )}

        {/* Categories */}
        {mealCategories && mealCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesGrid}>
              {mealCategories.map(renderCategoryItem)}
            </View>
          </View>
        )}
      </ScrollView>

      {/* {bottomNavItems && bottomNavItems.length > 0 && (
        <BottomNavigation
          items={bottomNavItems.map(item => ({
            ...item,
            onPress: () => handleBottomNavPress(item)
          }))}
          activeItem="MealTracker"
        />
      )} */}
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
  goalsIcon: {
    fontSize: 24
  },
  progressCard: { 
    marginHorizontal: ui.padding, 
    backgroundColor: colors.gray, 
    marginBottom: ui.padding,
    padding: 16
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressText: { 
    fontWeight: '600', 
    color: colors.text,
    fontSize: 16
  },
  calorieGoal: {
    fontSize: 12,
    color: colors.textSecondary
  },
  progressSubtext: { 
    color: colors.textSecondary, 
    fontSize: 14, 
    marginBottom: 8 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: colors.grayDark, 
    borderRadius: 3, 
    marginVertical: 8 
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: colors.primary, 
    borderRadius: 3 
  },
  tapToLog: { 
    fontSize: 12, 
    color: colors.primaryDark, 
    fontStyle: 'italic', 
    marginTop: 4 
  },
  scrollContainer: { 
    paddingHorizontal: ui.padding,
    paddingBottom: 80 
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16
  },
  emptyStateButton: {
    width: '70%'
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  searchInput: { 
    flex: 1, 
    marginRight: 12,
    backgroundColor: colors.grayLight,
    borderRadius: ui.borderRadius,
    paddingHorizontal: 16,
    height: 48
  },
  filterButton: { 
    backgroundColor: colors.primary, 
    padding: 12, 
    borderRadius: ui.borderRadius,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterIcon: { 
    color: colors.white, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  section: { 
    marginBottom: 32 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 16,
    color: colors.text
  },
  mealTypeContainer: {
    marginBottom: 16,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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
  noFoodsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  categoriesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8
  },
  categoryItem: { 
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
    paddingHorizontal: 8
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
    fontSize: 12,
    textAlign: 'center'
  },
  popularMealsContainer: {
    paddingBottom: 10,
  },
  popularMealCard: {
    width: width * 0.65,
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
    backgroundColor: colors.grayLight,
    borderBottomLeftRadius: ui.borderRadius,
    borderBottomRightRadius: ui.borderRadius,
  },
  popularMealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  popularMealCalories: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4
  },
  popularMealChef: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default MealTrackerScreen;