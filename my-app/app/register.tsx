import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useRouter } from 'expo-router';

export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoading, error: authError } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (authError && !isLoading) {
      setRegistrationError(authError);
      Alert.alert('Registration Failed', authError);
    }
  }, [authError, isLoading]);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    setRegistrationError(null);

    try {
      Alert.alert('Success', 'Registration successful! Please login.');
      router.replace('/login');
    } catch (rejectedValue: any) {
      setRegistrationError(rejectedValue);
      // Alert is already handled in useEffect
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {!isLoading && (
        <>
          <Button title="Register" onPress={handleRegister} />
          <View style={styles.navigationButton}>
            <Button title="Already have an account? Login" onPress={navigateToLogin} />
          </View>
        </>
      )}
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  navigationButton: {
    marginTop: 10,
  },
});
