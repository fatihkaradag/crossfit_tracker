import AsyncStorage from '@react-native-async-storage/async-storage';

const JWT_KEY = 'user_jwt';
const USER_KEY = 'user_data';

export const storeJWT = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(JWT_KEY, token);
    console.log('JWT stored successfully');
  } catch (error) {
    console.error('Error storing JWT:', error);
  }
};

export const getJWT = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(JWT_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving JWT:', error);
    return null;
  }
};

export const clearJWT = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(JWT_KEY);
    console.log('JWT cleared successfully');
  } catch (error) {
    console.error('Error clearing JWT:', error);
  }
};

export interface User {
  email: string;
  [key: string]: any;
}

export const storeUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('User data stored successfully');
    } else {
      await AsyncStorage.removeItem(USER_KEY);
      console.log('User data cleared');
    }
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getJWT();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('No JWT token found for authorization header.');
  }

  return headers;
};

export const loadInitialAuthData = async (): Promise<{ token: string | null; user: User | null }> => {
  const token = await getJWT();
  const user = await getUser();
  console.log('Loading initial auth data:', { token, user });
  return { token, user };
};
