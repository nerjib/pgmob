
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('user');
    router.replace('/(auth)/login');
  };

  return logout;
};
