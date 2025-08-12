import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, FlatList, Alert, Modal, ScrollView, TextInput } from 'react-native'; // Added Modal
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'; // Added useLocalSearchParams
import api from '@/services/api';

interface Device {
  id: string;
  serialNumber: string;
  type: string;
  model: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

export default function AssignDeviceToCustomerScreen() {
  const router = useRouter();
  const { customerId: paramCustomerId } = useLocalSearchParams(); // Get customerId from params
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [preselectedCustomer, setPreselectedCustomer] = useState<Customer | null>(null); // For pre-populated customer
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevicePickerVisible, setDevicePickerVisible] = useState(false); // State for device dropdown modal

  // Loan details state variables
  const [termMonths, setTermMonths] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorAddress, setGuarantorAddress] = useState('');
  const [guarantorPhoneNumber, setGuarantorPhoneNumber] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly'); // Default

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devicesRes = await api.get('/agents/available-devices');
        setAvailableDevices(devicesRes.data);

        if (paramCustomerId) {
          // Fetch customer details if customerId is provided
          const customerRes = await api.get(`/customers/${paramCustomerId}`);
          setPreselectedCustomer(customerRes.data);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paramCustomerId]); // Re-fetch if customerId changes

  const customerToAssign = paramCustomerId ? preselectedCustomer : null;

  const handleCreateLoan = async () => { // Renamed function
    if (!selectedDevice || !customerToAssign || !termMonths || !downPayment) { // Added validation
      Alert.alert('Error', 'Please fill all required fields: Device, Term Months, Down Payment.');
      return;
    }

    const selectedDeviceDetails = availableDevices.find(d => d.id === selectedDevice.id);
    if (!selectedDeviceDetails) {
      Alert.alert('Error', 'Selected device not found.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/loans', {
        customer_id: customerToAssign.id,
        device_id: selectedDevice.id,
        device_price: selectedDeviceDetails.model, // Assuming model can be used as price, or add a price field to Device interface
        term_months: parseInt(termMonths),
        down_payment: parseFloat(downPayment),
        guarantor_details: {
          name: guarantorName || null,
          address: guarantorAddress || null,
          phone_number: guarantorPhoneNumber || null,
        },
        payment_frequency: paymentFrequency,
      });
      Alert.alert('Success', 'Device assigned and loan created successfully!');
      router.back(); // Go back to previous screen (e.g., devices list)
    } catch (err) {
      Alert.alert('Error', 'Failed to assign device and create loan. Please try again.');
      console.error(err);
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
      <Stack.Screen options={{ title: 'Create New Loan' }} /> {/* Changed title */}
      <ScrollView className="p-4 flex-1"> {/* Changed View to ScrollView */}
        <Text className="text-2xl font-bold text-gray-800 mb-4">Create New Loan</Text>

        {/* Customer Details Section */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Customer Details</Text>
        {customerToAssign ? (
          <View className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">{customerToAssign.name}</Text>
            <Text className="text-gray-600">Phone: {customerToAssign.phone}</Text>
            {/* Add more customer details if needed */}
          </View>
        ) : (
          <Text className="text-gray-500 mb-6">Loading customer details...</Text>
        )}

        {/* Device Selection Dropdown */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Select Device</Text>
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-300 mb-6 flex-row justify-between items-center"
          onPress={() => setDevicePickerVisible(true)}
        >
          <Text className="text-gray-700">
            {selectedDevice ? `${selectedDevice.type} - ${selectedDevice.model} (SN: ${selectedDevice.serialNumber})` : 'Tap to select a device'}
          </Text>
          <Text className="text-gray-500">▼</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isDevicePickerVisible}
          onRequestClose={() => setDevicePickerVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-4/5 max-h-96">
              <Text className="text-xl font-bold mb-4">Select Device</Text>
              <FlatList
                data={availableDevices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`p-3 mb-2 rounded-lg border ${selectedDevice?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                    onPress={() => {
                      setSelectedDevice(item);
                      setDevicePickerVisible(false);
                    }}
                  >
                    <Text className="font-semibold">{item.type} - {item.model}</Text>
                    <Text className="text-gray-600">SN: {item.serialNumber}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => <Text className="text-gray-500">No available devices.</Text>}
              />
              <TouchableOpacity
                className="w-full bg-red-500 p-3 rounded-lg mt-4"
                onPress={() => setDevicePickerVisible(false)}
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Loan Details Input Fields */}
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
          className={`w-full p-4 rounded-lg ${!selectedDevice || !customerToAssign || submitting ? 'bg-gray-400' : 'bg-blue-600'}`}
          onPress={handleCreateLoan}
          disabled={!selectedDevice || !customerToAssign || submitting}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {submitting ? 'Assigning...' : 'Create Loan'} {/* Changed button text */}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 50}} /> {/* Added for scroll padding */}
      </ScrollView>
    </SafeAreaView>
  );
}