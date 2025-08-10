import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import api from '@/services/api';

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  customer_name: string;
  loan_id: string;
  agent_name: string;
  device_serial_number: string;
  device_type: string;
}

export default function SuperAgentPaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/super-agents/payments');
        setPayments(response.data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setError('Failed to load payments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Network Payments</Text>
        <FlatList
          data={payments}
          renderItem={({ item }) => (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
              <Text className="text-lg font-bold text-gray-800">Amount: {item.amount}</Text>
              <Text className="text-gray-600">Customer: {item.customer_name}</Text>
              <Text className="text-gray-600">Agent: {item.agent_name}</Text>
              <Text className="text-gray-600">Device: {item.device_type} ({item.device_serial_number})</Text>
              <Text className="text-gray-600">Date: {new Date(item.payment_date).toLocaleDateString()}</Text>
              <Text className="text-gray-600">Method: {item.payment_method}</Text>
              <Text className="text-gray-600">Status: {item.status}</Text>
              {item.transaction_id && <Text className="text-gray-600">Transaction ID: {item.transaction_id}</Text>}
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">No payments found in your network.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}