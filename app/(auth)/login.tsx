
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { Logo } from '../../components/Logo';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert('Error', 'Please enter both username and password.');
    }
    try {
      const response = await api.post('/auth/login', { username, password });
      const data = response.data;

      if (response.status === 200) {
        await SecureStore.setItemAsync('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        switch (data.user.role) {
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
      } else {
        Alert.alert('Login Failed', data.msg || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'An error occurred during login.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center p-4">
            <View className="w-full max-w-sm items-center">
              <Logo />
              <Text className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</Text>
              <TextInput
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TextInput
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity
                className="w-full bg-blue-600 rounded-lg py-3 items-center"
                onPress={handleLogin}
              >
                <Text className="text-white font-bold text-lg">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
