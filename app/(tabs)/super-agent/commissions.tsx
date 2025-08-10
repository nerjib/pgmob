import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import api from '@/services/api';

interface SuperAgentCommissionData {
  id: string;
  name: string;
  totalCommissionsEarned: string;
  commissionPaid: string;
  commissionBalance: string;
  withdrawalHistory: Withdrawal[];
}

interface Withdrawal {
  id: string;
  amount: number;
  date: string;
  transactionId: string | null;
}

export default function SuperAgentCommissionsScreen() {
  const router = useRouter();
  const [commissionData, setCommissionData] = useState<SuperAgentCommissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        // Assuming the backend can identify the super-agent from the auth token (req.user.id)
        // and the /super-agents/:id endpoint can return the current super-agent's data if :id is 'me' or the actual ID
        // For now, we'll use a placeholder ID or assume the backend handles it if no ID is provided.
        // A more robust solution would involve getting the super-agent ID from a global auth context.
        const response = await api.get('/super-agents/me'); // Assuming /super-agents/me returns current super-agent data
        setCommissionData(response.data);
      } catch (err) {
        console.error('Failed to fetch commission data:', err);
        setError('Failed to load commission data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissionData();
  }, []);

  const handleWithdrawCommission = () => {
    router.push('/withdraw-commission');
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

  if (!commissionData) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-center">No commission data found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: 'My Commissions' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">My Commissions</Text>

        {/* Commission Summary */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Summary</Text>
          <Text className="text-gray-600 mb-1">Total Earned: {commissionData.totalCommissionsEarned}</Text>
          <Text className="text-gray-600 mb-1">Commission Paid: {commissionData.commissionPaid}</Text>
          <Text className="text-gray-600 mb-1">Balance: {commissionData.commissionBalance}</Text>
        </View>

        {/* Withdrawal History */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Withdrawal History</Text>
          {commissionData.withdrawalHistory && commissionData.withdrawalHistory.length > 0 ? (
            <FlatList
              data={commissionData.withdrawalHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item: withdrawal }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">Amount: {withdrawal.amount}</Text>
                  <Text className="text-gray-600">Date: {new Date(withdrawal.date).toLocaleDateString()}</Text>
                  <Text className="text-gray-600">Transaction ID: {withdrawal.transactionId || 'N/A'}</Text>
                </View>
              )}
            />
          ) : (
            <Text className="text-gray-500">No withdrawal history found.</Text>
          )}
        </View>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleWithdrawCommission}
        >
          <Text className="text-white text-lg font-semibold">Withdraw Commission</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}