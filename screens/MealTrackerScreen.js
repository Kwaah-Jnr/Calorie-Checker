import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, Alert, ImageBackground } from 'react-native'; // Import ImageBackground
import { colors } from '../constants/colors';
import { mealCategories, bottomNavItems, popularMeals } from '../constants/data'; // Import popularMeals

const MealTrackerScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mealsLogged, setMealsLogged] = useState(5);
  const progressPercentage = Math.min(100, Math.round((mealsLogged / 6) * 100));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.profileIcon}><Text>👤</Text></TouchableOpacity>
        <View><Text style={styles.greeting}>Hello,</Text><Text style={styles.username}>Calorie Tracker User</Text></View>
        <TouchableOpacity onPress={() => Alert.alert('Notifications!')}><Text style={styles.notificationText}>🔔</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.progressCard} onPress={() => navigation.navigate('NewMealEntry')}>
  <Text style={styles.progressText}>You've logged {mealsLogged} meals today!</Text>
  <Text style={styles.progressSubtext}>{progressPercentage}% of your daily goal met.</Text>
  <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progressPercentage}%` }]} /></View>
  <Text style={styles.tapToLog}>Tap to log another meal</Text>
</TouchableOpacity>


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search meals..." style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
          <TouchableOpacity style={styles.filterButton}><Text style={styles.filterIcon}>≡</Text></TouchableOpacity>
        </View>

        {/* Most Popular meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Popular meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularMealsContainer}>
            {popularMeals.map((meal) => (
              <TouchableOpacity key={meal.id} style={styles.popularMealCard} onPress={() => Alert.alert(`Selected: ${meal.name}`)}>
                <ImageBackground source={{ uri: meal.image }} style={styles.popularMealImage} imageStyle={styles.popularMealImageStyle}>
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

      <View style={styles.bottomNav}>
        {bottomNavItems.map((item) => (
          <TouchableOpacity key={item.name} style={styles.navItem} onPress={() => item.name === 'Home' ? navigation.goBack() : Alert.alert(`Navigating to ${item.name}`)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, padding: 16 },
    profileIcon: { width: 40, height: 40, backgroundColor: colors.gray, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    greeting: { color: colors.textSecondary },
    username: { fontWeight: 'bold', color: colors.text },
    notificationText: { fontSize: 24 },
    progressCard: { marginHorizontal: 16, backgroundColor: colors.gray, borderRadius: 12, padding: 16, marginBottom: 16 },
    progressText: { fontWeight: '600', color: colors.text },
    progressSubtext: { color: colors.textSecondary, fontSize: 12, marginVertical: 4 },
    progressBar: { height: 4, backgroundColor: colors.grayDark, borderRadius: 2, marginTop: 8 },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
    tapToLog: { fontSize: 12, color: colors.primaryDark, fontStyle: 'italic', marginTop: 8 },
    scrollContainer: { paddingHorizontal: 16 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    searchInput: { flex: 1, backgroundColor: colors.gray, borderRadius: 8, padding: 12, marginRight: 12 },
    filterButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 8 },
    filterIcon: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
    categoriesGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    categoryItem: { alignItems: 'center', flex: 1 },
    categoryIcon: { width: 60, height: 60, backgroundColor: colors.gray, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    categoryIconText: { fontSize: 24 },
    categoryText: { color: colors.textSecondary, fontSize: 12 },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.grayDark },
    navItem: { alignItems: 'center' },
    navIcon: { fontSize: 24 },

    // New styles for "Most Popular meals" section
    popularMealsContainer: {
        paddingBottom: 10, // Add some padding at the bottom for shadow
    },
    popularMealCard: {
        width: 250, // Fixed width for the card
        marginRight: 15,
        borderRadius: 12,
        backgroundColor: colors.white,
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
        overflow: 'hidden', // Ensures content respects border radius
    },
    popularMealImage: {
        width: '100%',
        height: 150,
        justifyContent: 'space-between',
        padding: 10,
    },
    popularMealImageStyle: {
        borderRadius: 12, // Apply border radius to the image itself
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
        padding: 12,
        backgroundColor: colors.gray, // Light gray background for details
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
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
});

export default MealTrackerScreen;