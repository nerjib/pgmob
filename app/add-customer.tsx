import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import api from '@/services/api';

export default function AddCustomerScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddCustomer = async () => {
    if (!username || !email || !password || !phoneNumber || !state || !city || !address || !landmark) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/create-customer', {
        username,
        email,
        password,
        phone_number: phoneNumber,
        state,
        city,
        address,
        landmark,
      });
      Alert.alert('Success', 'Customer added successfully!');
      router.back(); // Go back to the previous screen (customers list)
    } catch (error) {
      console.error('Failed to add customer:', error);
      Alert.alert('Error', 'Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: 'Add New Customer' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Add New Customer</Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Username</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Email</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Password</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Phone Number</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">State</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter state"
            value={state}
            onChangeText={setState}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">City</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Address</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2">Landmark</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter landmark"
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleAddCustomer}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Add Customer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
