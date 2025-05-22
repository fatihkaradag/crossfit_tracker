import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function WorkoutDetailScreen() {
  const { workoutName, workoutDescription, workoutId } = useLocalSearchParams();

  const nameToDisplay = typeof workoutName === 'string' ? workoutName : 'Workout';
  const descriptionToDisplay = typeof workoutDescription === 'string' ? workoutDescription : 'No description provided.';

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [setsCompleted, setSetsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleStopwatch = () => setIsActive(!isActive);
  const resetStopwatch = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const incrementSets = () => setSetsCompleted(prev => prev + 1);
  const decrementSets = () => setSetsCompleted(prev => (prev > 0 ? prev - 1 : 0));


  return (
    <View style={styles.container}>
      <Text style={styles.name}>{nameToDisplay}</Text>
      <Text style={styles.description}>{descriptionToDisplay}</Text>

      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>Stopwatch</Text>
      <Text style={styles.stopwatchTime}>{formatTime(time)}</Text>
      <View style={styles.buttonRow}>
        <Button title={isActive ? 'Pause' : 'Start'} onPress={toggleStopwatch} />
        <Button title="Reset" onPress={resetStopwatch} disabled={time === 0 && !isActive} />
      </View>

      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>Sets/Rounds Completed</Text>
      <Text style={styles.setsCounter}>{setsCompleted}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.counterButton} onPress={decrementSets}>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.counterButton} onPress={incrementSets}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
      <View style={styles.buttonContainer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  stopwatchTime: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  setsCounter: { fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  counterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  counterButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  buttonContainer: { marginTop: 10, marginHorizontal: 20 },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 15 },
});
