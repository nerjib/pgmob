

  import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  county: string;
  idNumber: string | null;
  joinDate: string;
  status: 'active' | 'inactive' | null;
  creditScore: number | null;
  totalLoans: string;
  activeLoans: string;
  completedLoans: string;
  totalBorrowed: string;
  totalPaid: string;
  outstandingBalance: string;
  devices: any; // This can be further typed if needed
  lastPayment: string | null;
  nextPaymentDue: string | null;
  loans: Loan[];
  paymentHistory: Payment[];
  recentActivities: Activity[];
}

interface Loan {
  id: string;
  deviceType: string;
  deviceId: string;
  principalAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentAmountPerCycle: number;
  startDate: string;
  endDate: string | null;
  status: string;
  nextPaymentDate: string;
  progress: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string | null;
  status: string;
  loanId: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: string;
}

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFabOptions, setShowFabOptions] = useState(false);

  const router = useRouter();

  const handleAssignDevice = () => {
    if (customer) {
      router.push({ pathname: '/create-loan', params: { customerId: customer.id } });
    } else {
      Alert.alert('Error', 'Customer data not loaded yet.');
    }
    setShowFabOptions(false);
  };

  const handleMakePayment = () => {
    if (customer) {
      router.push({ pathname: '/make-payment', params: { customerId: customer.id } });
    } else {
      Alert.alert('Error', 'Customer data not loaded yet.');
    }
    setShowFabOptions(false);
  };

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await api.get(`/customers/${id}`); // Using the /customers/:id endpoint
        setCustomer(response.data);
      } catch (err) {
        console.error('Failed to fetch customer details:', err);
        setError('Failed to load customer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

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

  if (!customer) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-center">Customer not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: customer.name || 'Customer Details' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">{customer.name}</Text>

        {/* Basic Information */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Basic Information</Text>
          <Text className="text-gray-600 mb-1">Email: {customer.email || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Phone: {customer.phone || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Status: {customer.status || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Join Date: {new Date(customer.joinDate).toLocaleDateString()}</Text>
          <Text className="text-gray-600 mb-1">ID Number: {customer.idNumber || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Credit Score: {customer.creditScore || 'N/A'}</Text>
        </View>

        {/* Address Details */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Address Details</Text>
          <Text className="text-gray-600 mb-1">Location: {customer.location || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">County: {customer.county || 'N/A'}</Text>
        </View>

        {/* Loan Summary */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Loan Summary</Text>
          <Text className="text-gray-600 mb-1">Total Loans: {customer.totalLoans}</Text>
          <Text className="text-gray-600 mb-1">Active Loans: {customer.activeLoans}</Text>
          <Text className="text-gray-600 mb-1">Completed Loans: {customer.completedLoans}</Text>
          <Text className="text-gray-600 mb-1">Total Borrowed: {customer.totalBorrowed}</Text>
          <Text className="text-gray-600 mb-1">Total Paid: {customer.totalPaid}</Text>
          <Text className="text-gray-600 mb-1">Outstanding Balance: {customer.outstandingBalance}</Text>
          <Text className="text-gray-600 mb-1">Last Payment: {customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString() : 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Next Payment Due: {customer.nextPaymentDue ? new Date(customer.nextPaymentDue).toLocaleDateString() : 'N/A'}</Text>
        </View>

        {/* Loans List */}
        {customer.loans && customer.loans.length > 0 && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Loans</Text>
            <FlatList
              data={customer.loans}
              keyExtractor={(item) => item.id}
              renderItem={({ item: loan }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">{loan.deviceType} ({loan.deviceId})</Text>
                  <Text className="text-gray-600">Amount: {loan.totalAmount} (Paid: {loan.paidAmount}, Remaining: {loan.remainingAmount})</Text>
                  <Text className="text-gray-600">Status: {loan.status} | Progress: {loan.progress}%</Text>
                  <Text className="text-gray-600">Next Payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Payment History */}
        {customer.paymentHistory && customer.paymentHistory.length > 0 && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Payment History</Text>
            <FlatList
              data={customer.paymentHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item: payment }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">{payment.amount} ({payment.method})</Text>
                  <Text className="text-gray-600">Date: {new Date(payment.date).toLocaleDateString()}</Text>
                  <Text className="text-gray-600">Status: {payment.status}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Recent Activities */}
        {customer.recentActivities && customer.recentActivities.length > 0 && (
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Recent Activities</Text>
            <FlatList
              data={customer.recentActivities}
              keyExtractor={(item) => item.id}
              renderItem={({ item: activity }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">{activity.message}</Text>
                  <Text className="text-gray-600">Date: {new Date(activity.timestamp).toLocaleDateString()}</Text>
                  <Text className="text-gray-600">Status: {activity.status}</Text>
                </View>
              )}
            />
          </View>
        )}

      </View>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6 items-end">
        {showFabOptions && (
          <>
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-full shadow-lg mb-3"
              onPress={handleAssignDevice}
            >
              <Text className="text-white font-bold">Assign Device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-purple-500 p-3 rounded-full shadow-lg mb-3"
              onPress={handleMakePayment}
            >
              <Text className="text-white font-bold">Make Payment</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-full shadow-lg"
          onPress={() => setShowFabOptions(!showFabOptions)}
        >
          <Text className="text-white text-3xl font-bold">{showFabOptions ? '-' : '+'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
