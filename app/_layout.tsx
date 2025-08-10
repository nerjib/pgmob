import { Slot } from 'expo-router';
import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import AuthInitializer from '../components/AuthInitializer';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthInitializer>
        <Slot />
      </AuthInitializer>
    </AuthProvider>
  );
}