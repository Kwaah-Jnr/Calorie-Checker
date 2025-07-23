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

// Colors and constants
const colors = {
  background: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  primary: '#f59e0b',
  primaryDark: '#d97706',
  white: '#ffffff',
  gray: '#f3f4f6',
  grayDark: '#e5e7eb',
  grayLight: '#d1d5db',
};

const constants = {
  iconSize: 48,
  backIconSize: 24,
};

// Welcome Screen Component
const WelcomeScreen = ({ onStartTracking }) => {
  const handleStartNow = () => {
    onStartTracking();
  };

  const handleGoBack = () => {
    Alert.alert('Go Back', 'This would navigate to the previous screen');
  };

  return (
    <SafeAreaView style={welcomeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
     
      {/* Header with back button */}
      <View style={welcomeStyles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={welcomeStyles.backButton}>
          <Text style={welcomeStyles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>
 
      {/* Main content */}
      <View style={welcomeStyles.centerContent}>
        {/* Icon container */}
        <View style={welcomeStyles.iconContainer}>
          <View style={welcomeStyles.iconCircle}>
            <Text style={welcomeStyles.restaurantIcon}>🍽️</Text>
          </View>
        </View>
 
        {/* Title and subtitle */}
        <View style={welcomeStyles.textContainer}>
          <Text style={welcomeStyles.title}>
            Track Your Meals
          </Text>
          <Text style={welcomeStyles.subtitle}>
            Log your meals here to track your calories
          </Text>
        </View>
      </View>
 
      {/* Start button */}
      <View style={welcomeStyles.buttonContainer}>
        <TouchableOpacity 
          style={welcomeStyles.primaryButton}
          onPress={handleStartNow}
        >
          <Text style={welcomeStyles.primaryButtonText}>
            Start now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Meal Tracker Interface Component
const MealTrackerInterface = ({ onGoBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Explore');
  const [mealsLogged, setMealsLogged] = useState(5);
  const [progressPercentage, setProgressPercentage] = useState(85);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for: ${searchQuery}`);
    }
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    Alert.alert('Tab Selected', `Switched to ${tabName} tab`);
  };

  const handleMealPress = (mealName) => {
    Alert.alert('Meal Selected', `You selected: ${mealName}`);
  };

  const handleCategoryPress = (category) => {
    Alert.alert('Category Selected', `Browse ${category} meals`);
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new meal suggestions!');
  };

  const handleNavPress = (navItem) => {
    if (navItem === 'Home') {
      onGoBack();
    } else {
      Alert.alert('Navigation', `Navigating to ${navItem}`);
    }
  };

  const handleLogMeal = () => {
    const newMealsLogged = mealsLogged + 1;
    const newPercentage = Math.min(100, Math.round((newMealsLogged / 6) * 100));
    setMealsLogged(newMealsLogged);
    setProgressPercentage(newPercentage);
    Alert.alert('Meal Logged', `Great! You've now logged ${newMealsLogged} meals today.`);
  };

  return (
    <SafeAreaView style={trackerStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Status bar dot */}
      <View style={trackerStyles.statusBarDot}>
        <View style={trackerStyles.dot} />
      </View>
      
      {/* Header */}
      <View style={trackerStyles.header}>
        <TouchableOpacity 
          style={trackerStyles.backButton}
          onPress={onGoBack}
        >
          <Text style={trackerStyles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={trackerStyles.profileSection}>
          <TouchableOpacity style={trackerStyles.profileIcon}>
            <Text style={trackerStyles.profileIconText}>👤</Text>
          </TouchableOpacity>
          <View>
            <Text style={trackerStyles.greeting}>Hello,</Text>
            <Text style={trackerStyles.username}>Calorie Tracker User</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={trackerStyles.notificationIcon}
          onPress={handleNotificationPress}
        >
          <Text style={trackerStyles.notificationText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <TouchableOpacity style={trackerStyles.progressCard} onPress={handleLogMeal}>
        <Text style={trackerStyles.progressText}>
          You've logged {mealsLogged} meals today!
        </Text>
        <Text style={trackerStyles.progressSubtext}>
          {progressPercentage}% of your daily goal met.
        </Text>
        <View style={trackerStyles.progressBar}>
          <View style={[trackerStyles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={trackerStyles.tapToLog}>Tap to log another meal</Text>
      </TouchableOpacity>

      {/* Navigation Tabs */}
      <View style={trackerStyles.tabContainer}>
        {['Explore', 'Recipes', 'My goals'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[trackerStyles.tab, activeTab === tab && trackerStyles.activeTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Text style={[trackerStyles.tabText, activeTab === tab && trackerStyles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={trackerStyles.searchContainer}>
        <View style={trackerStyles.searchBar}>
          <Text style={trackerStyles.searchIcon}>🔍</Text>
          <TextInput 
            placeholder="Search meals" 
            style={trackerStyles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={trackerStyles.filterButton}>
          <Text style={trackerStyles.filterIcon}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={trackerStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Most Popular meals */}
        <View style={trackerStyles.section}>
          <Text style={trackerStyles.sectionTitle}>Most Popular meals</Text>
          <TouchableOpacity 
            style={trackerStyles.mealCard}
            onPress={() => handleMealPress('Avocado Toast')}
          >
            <View style={trackerStyles.mealImageLarge}>
              <Text style={trackerStyles.mealImageText}>🥑🍞</Text>
            </View>
            <View style={trackerStyles.mealInfo}>
              <Text style={trackerStyles.mealName}>Avocado Toast</Text>
              <Text style={trackerStyles.mealChef}>Chef Alex</Text>
              <Text style={trackerStyles.mealCalories}>320 calories</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick meals */}
        <View style={trackerStyles.section}>
          <Text style={trackerStyles.sectionTitle}>Quick meals</Text>
          <View style={trackerStyles.quickMealsContainer}>
            <TouchableOpacity 
              style={trackerStyles.quickMealCard}
              onPress={() => handleMealPress('Avocado Toast')}
            >
              <View style={trackerStyles.quickMealImage}>
                <Text style={trackerStyles.mealImageText}>🥑🍞</Text>
              </View>
              <Text style={trackerStyles.quickMealName}>Avocado Toast</Text>
              <Text style={trackerStyles.quickMealChef}>Chef Alex</Text>
              <Text style={trackerStyles.quickMealCalories}>320 cal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={trackerStyles.quickMealCard}
              onPress={() => handleMealPress('Greek Salad')}
            >
              <View style={trackerStyles.quickMealImage}>
                <Text style={trackerStyles.mealImageText}>🥗🧀</Text>
              </View>
              <Text style={trackerStyles.quickMealName}>Greek Salad</Text>
              <Text style={trackerStyles.quickMealChef}>Chef Maria</Text>
              <Text style={trackerStyles.quickMealCalories}>250 cal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={trackerStyles.section}>
          <Text style={trackerStyles.sectionTitle}>Categories</Text>
          <View style={trackerStyles.categoriesGrid}>
            {[
              { icon: '☕', name: 'Breakfast' },
              { icon: '🍴', name: 'Lunch' },
              { icon: '🍎', name: 'Snacks' },
              { icon: '🍽️', name: 'Dinner' }
            ].map((category) => (
              <TouchableOpacity 
                key={category.name}
                style={trackerStyles.categoryItem}
                onPress={() => handleCategoryPress(category.name)}
              >
                <View style={trackerStyles.categoryIcon}>
                  <Text style={trackerStyles.categoryIconText}>{category.icon}</Text>
                </View>
                <Text style={trackerStyles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={trackerStyles.bottomNav}>
        {[
          { icon: '🏠', name: 'Home' },
          { icon: '🔍', name: 'Search' },
          { icon: '❤️', name: 'Favorites' },
          { icon: '👤', name: 'Profile' }
        ].map((navItem) => (
          <TouchableOpacity 
            key={navItem.name}
            style={trackerStyles.navItem}
            onPress={() => handleNavPress(navItem.name)}
          >
            <Text style={trackerStyles.navIcon}>{navItem.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

// Main App Component
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const navigateToTracker = () => {
    setCurrentScreen('tracker');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
  };

  return currentScreen === 'welcome' ? (
    <WelcomeScreen onStartTracking={navigateToTracker} />
  ) : (
    <MealTrackerInterface onGoBack={navigateToWelcome} />
  );
};

// Welcome Screen Styles
const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: constants.backIconSize,
    color: colors.text,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 48,
  },
  iconCircle: {
    width: 120,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantIcon: {
    fontSize: constants.iconSize,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

// Tracker Screen Styles
const trackerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusBarDot: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#111827',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginRight: 40, // Compensate for the back button space
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileIconText: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 20,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
  },
  tapToLog: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f59e0b',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
  },
  mealImageLarge: {
    width: '100%',
    height: 96,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealImageText: {
    fontSize: 32,
  },
  mealInfo: {
    paddingHorizontal: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mealChef: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  mealCalories: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  quickMealsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickMealCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  quickMealImage: {
    width: '100%',
    height: 64,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickMealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  quickMealChef: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  quickMealCalories: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
  },
});

export default App;