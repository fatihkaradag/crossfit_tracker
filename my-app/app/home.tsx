import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { useRouter } from 'expo-router';
import type { RootState, AppDispatch } from '../store';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);


  const handleLogout = () => {
    dispatch(logoutUser());
    // yönlendirme otomatik olacak çünkü token null olunca layout değişiyor
  };

  const navigateToWorkouts = () => {
    router.push('/workout-list');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.email || 'User'}!</Text>
      <Text style={styles.jwtText}>Token: {token ? token.substring(0, 30) + '...' : 'No Token'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Manage Workouts" onPress={navigateToWorkouts} />
      </View>


      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  jwtText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: '90%',
  },
  buttonContainer: {
    marginTop: 10,
    width: '80%',
  },
});
