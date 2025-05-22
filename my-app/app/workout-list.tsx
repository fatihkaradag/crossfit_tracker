import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Button,
  StyleSheet, Alert
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAuthHeaders } from '../utils/auth';

type Workout = {
  id: number;
  name: string;
  description?: string;
};

const API_URL = 'http://localhost:3000';

export default function WorkoutListScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async (refreshing = false) => {
    if (refreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
        router.replace('/login');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch workouts.');
      }

      const data: Workout[] = await response.json();
      setWorkouts(data);

      if (refreshing) Alert.alert('Success', 'Workouts refreshed!');
    } catch (err: any) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
      if (workouts.length === 0 || refreshing) {
        Alert.alert('Error', err.message || 'Could not fetch workouts.');
      }
    } finally {
      if (refreshing) setIsRefreshing(false);
      else setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/workout-detail',
          params: {
            workoutId: item.id.toString(),
            workoutName: item.name,
            workoutDescription: item.description || '',
          },
        })
      }
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>
        {item.description ? `${item.description.slice(0, 75)}...` : 'No description.'}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && workouts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading workouts...</Text>
      </View>
    );
  }

  if (error && workouts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={() => fetchWorkouts()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isRefreshing}
        onRefresh={() => fetchWorkouts(true)}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.buttonWrapper}>
        <Button title="Create Workout" onPress={() => router.push('/create-workout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#2c3e50' },
  cardDescription: { fontSize: 14, color: '#555', marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', marginBottom: 10 },
  buttonWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f2f5',
  },
});
