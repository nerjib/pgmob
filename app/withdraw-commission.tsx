import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import api from '@/services/api';

export default function WithdrawCommissionScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter the withdrawal amount.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/super-agents/withdraw-commission', {
        amount: parseFloat(amount),
        transaction_id: transactionId || null,
      });
      Alert.alert('Success', 'Commission withdrawal requested successfully!');
      router.back(); // Go back to commissions screen
    } catch (err) {
      console.error('Failed to withdraw commission:', err);
      Alert.alert('Error', 'Failed to withdraw commission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: 'Withdraw Commission' }} />
      <ScrollView className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Withdraw Commission</Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Amount</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter amount to withdraw"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Transaction ID (Optional)</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
          />
        </View>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleWithdraw}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Request Withdrawal</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
