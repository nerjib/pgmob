import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/services/api';

// 1. Customer Interface
interface Customer {
  id: string;
  name: string;
  region: string;
  phone: string;
  status: 'active' | 'inactive';
  onboardedBy: string;
}

// Customer Card Component
const CustomerCard = ({ customer }: { customer: Customer }) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200"
      onPress={() => router.push(`/customer-details/${customer.id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800">{customer.name}</Text>
        <View className={`px-2 py-1 rounded-full ${customer.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-xs font-semibold ${customer.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
            {customer.status}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 mb-1">{customer.region}</Text>
      <Text className="text-gray-600 mb-1">{customer.phone}</Text>
      <View className="border-t border-gray-100 mt-2 pt-2">
          <Text className="text-sm text-gray-500">Onboarded by: {customer.onboardedBy}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Screen Component
export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'onboardedByMe'>('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (activeTab === 'all') {
          response = await api.get('/super-agents/customers');
        } else {
          response = await api.get('/super-agents/mycustomers');
        }
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to fetch customers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [activeTab]);

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

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Network Customers</Text>

        {/* Tab Navigation */}
        <View className="flex-row mb-4 bg-white rounded-lg p-1 shadow-sm">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-500' : ''}`}
            onPress={() => setActiveTab('all')}
          >
            <Text className={`text-center font-semibold ${activeTab === 'all' ? 'text-white' : 'text-gray-700'}`}>
              All Network Customers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${activeTab === 'onboardedByMe' ? 'bg-blue-500' : ''}`}
            onPress={() => setActiveTab('onboardedByMe')}
          >
            <Text className={`text-center font-semibold ${activeTab === 'onboardedByMe' ? 'text-white' : 'text-gray-700'}`}>
              Customers Onboarded by Me
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={customers}
          renderItem={({ item }) => <CustomerCard customer={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">No customers found in this category.</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        onPress={() => router.push('/add-customer')}
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}