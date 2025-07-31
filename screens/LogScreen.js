// screens/LogScreen.js (create this file if it doesn't exist)
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LogScreen = ({ navigation, route }) => {
  // State to hold all the logged meals
  const [loggedMeals, setLoggedMeals] = useState([]);

  // UseEffect to update loggedMeals when a new meal is passed via route params
  useEffect(() => {
    if (route.params?.newMeal) {
      const newMeal = route.params.newMeal;
      setLoggedMeals(prevMeals => [...prevMeals, newMeal]);

      // Clear the parameter to prevent re-adding on subsequent renders
      navigation.setParams({ newMeal: null });
    }
  }, [route.params?.newMeal]); // Dependency array ensures this runs only when newMeal param changes

  // Function to render each meal item in the FlatList
  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <Text style={styles.mealName}>{item.mealName}</Text>
      <Text style={styles.mealTime}>Time: {item.time}</Text>
      {/* Conditionally render food details if available */}
      {item.foods && item.foods.length > 0 && (
        <View style={styles.foodList}>
          {item.foods.map((food, index) => (
            <Text key={index} style={styles.foodItem}>- {food.foodName} ({food.calories} kcal)</Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Log</Text>
      {loggedMeals.length > 0 ? (
        <FlatList
          data={loggedMeals}
          keyExtractor={(item, index) => index.toString()} // Using index as key, consider a unique ID if available
          renderItem={renderMealItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noMealsText}>No meals logged yet. Add a new meal!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20, // Add some padding at the bottom for scrolling
  },
  mealCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  mealTime: {
    fontSize: 15,
    color: '#777',
    marginBottom: 8,
  },
  foodList: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  foodItem: {
    fontSize: 14,
    marginLeft: 10,
    color: '#555',
    lineHeight: 20,
  },
  noMealsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 17,
    color: '#999',
    fontStyle: 'italic',
  }
});

export default LogScreen;