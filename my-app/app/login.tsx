import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useRouter } from 'expo-router';
import type { RootState, AppDispatch } from '../store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isLoading) {
      router.replace('/home'); // Oturum açıldıysa otomatik yönlendirme
    }

    if (error && !isLoading && !token) {
      Alert.alert('Login Failed', error);
    }
  }, [token, error, isLoading]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Login</Text>

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
          <Button title="Login" onPress={handleLogin} />
          <View style={styles.navigationButton}>
            <Button title="Don't have an account? Register" onPress={navigateToRegister} />
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
