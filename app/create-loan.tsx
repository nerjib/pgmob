import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';

interface Device {
  id: string;
  serialNumber: string;
  status: string;
  type: string;
  model: string;
  price: number; // Added price
  amount: number;
}

export default function CreateLoanScreen() {
  const { customerId } = useLocalSearchParams();
  const router = useRouter();
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [termMonths, setTermMonths] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorAddress, setGuarantorAddress] = useState('');
  const [guarantorPhoneNumber, setGuarantorPhoneNumber] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly'); // Default

  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        const response = await api.get('/super-agents/devices');
        const filtered = response.data.filter((device: Device) => device.status === 'available');
        setAvailableDevices(filtered);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
        setError('Failed to load available devices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDevices();
  }, []);

  const handleCreateLoan = async () => {
    if (!customerId || !selectedDeviceId || !termMonths ) {
      Alert.alert('Error', 'Please fill all required fields: Device, Term Months, Down Payment.');
      return;
    }

    const selectedDevice = availableDevices.find(d => d.id === selectedDeviceId);
    if (!selectedDevice) {
      Alert.alert('Error', 'Selected device not found.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/loans', {
        customer_id: customerId,
        device_id: selectedDeviceId,
        device_price: selectedDevice.amount,
        term_months: parseInt(termMonths),
        down_payment: parseFloat(downPayment),
        guarantor_details: {
          name: guarantorName || null,
          address: guarantorAddress || null,
          phone_number: guarantorPhoneNumber || null,
        },
        payment_frequency: paymentFrequency,
      });
      Alert.alert('Success', 'Loan created and device assigned successfully!');
      router.back(); // Go back to customer details
    } catch (err) {
      console.error('Failed to create loan:', err);
      Alert.alert('Error', 'Failed to create loan. Please try again.');
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
      <Stack.Screen options={{ title: 'Create New Loan' }} />
      <ScrollView className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Create New Loan</Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Select Device</Text>
          <FlatList
            data={availableDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item: device }) => (
              <TouchableOpacity
                className={`bg-white rounded-lg p-4 mb-3 shadow-sm border ${selectedDeviceId === device.id ? 'border-blue-500' : 'border-gray-200'}`}
                onPress={() => setSelectedDeviceId(device.id)}
                disabled={submitting}
              >
                <Text className="text-lg font-bold text-gray-800">{device.serialNumber}</Text>
                <Text className="text-gray-600">Type: {device.type} - Model: {device.model}</Text>
                <Text className="text-gray-600">Price: {device.amount}</Text>
                <Text className="text-gray-600">Status: {device.status}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-gray-500">No available devices found.</Text>
              </View>
            )}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Term (Months)</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="e.g., 12"
            keyboardType="numeric"
            value={termMonths}
            onChangeText={setTermMonths}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Down Payment</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="e.g., 5000"
            keyboardType="numeric"
            value={downPayment}
            onChangeText={setDownPayment}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Guarantor Name (Optional)</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter guarantor's name"
            value={guarantorName}
            onChangeText={setGuarantorName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Guarantor Address (Optional)</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter guarantor's address"
            value={guarantorAddress}
            onChangeText={setGuarantorAddress}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 text-base mb-2">Guarantor Phone Number (Optional)</Text>
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            placeholder="Enter guarantor's phone number"
            keyboardType="phone-pad"
            value={guarantorPhoneNumber}
            onChangeText={setGuarantorPhoneNumber}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base mb-2">Payment Frequency</Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${paymentFrequency === 'daily' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setPaymentFrequency('daily')}
            >
              <Text className={`${paymentFrequency === 'daily' ? 'text-white' : 'text-gray-700'}`}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${paymentFrequency === 'weekly' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setPaymentFrequency('weekly')}
            >
              <Text className={`${paymentFrequency === 'weekly' ? 'text-white' : 'text-gray-700'}`}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${paymentFrequency === 'monthly' ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setPaymentFrequency('monthly')}
            >
              <Text className={`${paymentFrequency === 'monthly' ? 'text-white' : 'text-gray-700'}`}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
          onPress={handleCreateLoan}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Create Loan</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
}