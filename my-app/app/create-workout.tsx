import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuthHeaders } from '../utils/auth';

const API_URL = 'http://localhost:3000'; // Gerekirse IP adresiyle değiştirin

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveWorkout = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Workout name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
        router.replace('/login');
        return;
      }

      if (response.ok) {
        Alert.alert('Success', 'Workout created successfully!');
        router.back(); // Geri dön: önceki ekrana
      } else {
        Alert.alert('Creation Failed', data.message || 'An error occurred while creating the workout.');
      }
    } catch (error) {
      console.error('Create workout error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Workout</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Workout Description (e.g., exercises, reps, rounds)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <Button title="Save Workout" onPress={handleSaveWorkout} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 5,
  },
  loader: {
    marginTop: 10,
  }
});
