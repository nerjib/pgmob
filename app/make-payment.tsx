import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';

interface Loan {
  id: string;
  deviceType: string;
  totalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  nextPaymentDate: string;
  status: string;
}

export default function MakePaymentScreen() {
  const { customerId } = useLocalSearchParams();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Default to cash
  const [transactionId, setTransactionId] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerLoans = async () => {
      try {
        const response = await api.get(`/loans/customer/${customerId}`);
        setLoans(response.data);
        console.log({response})

      } catch (err) {
        console.error('Failed to fetch customer loans:', err);
        setError('Failed to load customer loans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (customerId) {
      fetchCustomerLoans();
    }
  }, [customerId]);

  const handleMakePayment = async () => {
    if (!amount || !selectedLoanId) {
      Alert.alert('Error', 'Please enter amount and select a loan.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/payments/manual', {
        user_id: customerId,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        transaction_id: transactionId || null,
        loan_id: selectedLoanId,
      });
      Alert.alert('Success', 'Payment recorded successfully!');
      router.back(); // Go back to customer details
    } catch (err) {
      console.error('Failed to record payment:', err);
      Alert.alert('Error', 'Failed to record payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: 'Record Payment' }} />
      <ScrollView className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Record Payment</Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Amount</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Payment Method</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="e.g., Cash, Bank Transfer"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
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

        <Text className="text-gray-700 text-base mb-2">Select Loan</Text>
        {loans.length > 0 ? (
          <View className="mb-6">
            {loans.map((loan) => (
              <TouchableOpacity
                key={loan.id}
                className={`p-3 border rounded-lg mb-2 ${selectedLoanId === loan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                onPress={() => setSelectedLoanId(loan.id)}
              >
                <Text className="font-semibold">Loan ID: {loan.id}</Text>
                <Text>Device: {loan.deviceType}</Text>
                <Text>Remaining: {loan.remainingAmount}</Text>
                <Text>Next Payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500 mb-6">No active loans for this customer.</Text>
        )}

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleMakePayment}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Record Payment</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
}
