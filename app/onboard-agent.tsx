
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/services/api';

export default function OnboardAgentScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    state: '',
    city: '',
    address: '',
    landmark: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const response = await api.post('/admin/create-agent', formData);
      if (response.status === 200) {
        Alert.alert('Success', 'Agent created successfully');
        router.back();
      } else {
        Alert.alert('Error', response.data.msg || 'Could not create agent');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.msg || 'An error occurred.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Onboard New Agent</Text>
      
      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Username</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.username}
          onChangeText={(val) => handleInputChange('username', val)}
        />
      </View>
      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Name</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.name}
          onChangeText={(val) => handleInputChange('name', val)}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.email}
          onChangeText={(val) => handleInputChange('email', val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Password</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.password}
          onChangeText={(val) => handleInputChange('password', val)}
          secureTextEntry
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Phone Number</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.phone_number}
          onChangeText={(val) => handleInputChange('phone_number', val)}
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">State</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.state}
          onChangeText={(val) => handleInputChange('state', val)}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">City</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.city}
          onChangeText={(val) => handleInputChange('city', val)}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-1">Address</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.address}
          onChangeText={(val) => handleInputChange('address', val)}
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-600 mb-1">Landmark</Text>
        <TextInput
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
          value={formData.landmark}
          onChangeText={(val) => handleInputChange('landmark', val)}
        />
      </View>

      <TouchableOpacity
        onPress={handleOnboard}
        className="w-full bg-blue-600 rounded-lg py-4 items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-lg">Onboard Agent</Text>
        )}
      </TouchableOpacity>
      <View style={{ height: 30}} />
    </ScrollView>
  );
}
