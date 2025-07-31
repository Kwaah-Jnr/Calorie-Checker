import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../components';
import { colors } from '../constants/colors';
import { MealContext } from '../context/MealContext';

const LogScreen = ({ navigation }) => {
  const { meals, deleteMeal } = useContext(MealContext);

  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealType}>{item.mealType}</Text>
        <Text style={styles.mealTime}>{item.time}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteMeal(item.id)}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
      
      {item.foods?.map((food, index) => (
        <View key={index} style={styles.foodItem}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodDetails}>
            {food.quantity} {food.unit} • {food.calories || '--'} kcal
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Meal Log"
        onBackPress={() => navigation.goBack()}
      />
      
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
        contentContainerStyle={[styles.listContent, {paddingBottom: 16} ]}
        ListEmptyComponent={
          <Text style={styles.noMealsText}>No meals logged yet. Add a new meal!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  mealCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  mealTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  foodName: {
    fontSize: 16,
    color: colors.text,
  },
  foodDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noMealsText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: colors.textSecondary,
  }
});

export default LogScreen;