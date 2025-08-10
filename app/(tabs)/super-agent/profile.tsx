import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import api from '@/services/api';
import { useLogout } from '@/hooks/useLogout';

interface SuperAgentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  landmark: string;
  gps: string;
  status: string;
  joinDate: string;
  last_active: string;
  commissionRate: number;
  totalCommissionsEarned: string;
  commissionPaid: string;
  commissionBalance: string;
}

export default function SuperAgentProfileScreen() {
  const router = useRouter();
  const logout = useLogout();
  const [profileData, setProfileData] = useState<SuperAgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Assuming /super-agents/me returns the current super-agent's profile data
        const response = await api.get('/super-agents/me');
        setProfileData(response.data);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleMyCommissions = () => {
    router.push('/super-agent-nested/commissions');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout() },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-center">No profile data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: 'My Profile' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">{profileData.name}'s Profile</Text>

        {/* Basic Information */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Basic Information</Text>
          <Text className="text-gray-600 mb-1">Email: {profileData.email || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Phone: {profileData.phone || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Status: {profileData.status || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Join Date: {new Date(profileData.joinDate).toLocaleDateString()}</Text>
          <Text className="text-gray-600 mb-1">Last Active: {profileData.last_active ? new Date(profileData.last_active).toLocaleString() : 'N/A'}</Text>
        </View>

        {/* Commission Summary (from profile data) */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Commission Summary</Text>
          <Text className="text-gray-600 mb-1">Total Earned: {profileData.totalCommissionsEarned}</Text>
          <Text className="text-gray-600 mb-1">Commission Paid: {profileData.commissionPaid}</Text>
          <Text className="text-gray-600 mb-1">Balance: {profileData.commissionBalance}</Text>
        </View>

        {/* Navigation Buttons */}
        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center mb-3"
          onPress={handleMyCommissions}
        >
          <Text className="text-white text-lg font-semibold">My Commissions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-red-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleLogout}
        >
          <Text className="text-white text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
