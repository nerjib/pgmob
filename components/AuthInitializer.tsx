import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { login, userRole } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const inAuthGroup = segments[0] === '(auth)';

      if (token && user) {
        login(user.role); // Set user role in AuthContext
        if (inAuthGroup) {
            switch (user.role) {
                case 'customer':
                    router.replace('/(tabs)/customer');
                    break;
                case 'agent':
                    router.replace('/(tabs)/agent');
                    break;
                case 'super-agent':
                    router.replace('/(tabs)/super-agent');
                    break;
                default:
                    router.replace('/(auth)/login');
            }
        }
      } else if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, [segments, userRole]);

  return <>{children}</>;
}
