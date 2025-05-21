import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserSession } from '../store/authSlice';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import type { RootState, AppDispatch } from '../store';

export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="home" />
          <Stack.Screen name="workout-list" options={{ title: 'Workouts' }} />
          <Stack.Screen name="workout-detail" options={{ title: 'Workout Details' }} />
          <Stack.Screen name="create-workout" options={{ title: 'Create Workout' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" options={{ title: 'Create Account' }} />
        </>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
