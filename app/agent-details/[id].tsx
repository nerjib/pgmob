
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '@/services/api';

// Define a more detailed interface for the agent
interface AgentDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
  status: 'active' | 'inactive';
  joinDate: string;
  commissionRate: number;
  totalCommissionsEarned: string;
  commissionPaid: string;
  commissionBalance: string;
  devicesManaged: number;
  totalSales: string | null;
  assignedDevices: {
    id: string;
    serialNumber: string;
    status: string;
    customerName: string | null;
    installDate: string;
  }[];
}

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAgentDetails = async () => {
      try {
        const response = await api.get(`/agents/${id}`);
        setAgent(response.data);
      } catch (err) {
        setError('Failed to fetch agent details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" className="flex-1" />;
  }

  if (error || !agent) {
    return <Text className="text-red-500 text-center mt-10">{error || 'Agent not found.'}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">{agent.name}</Text>
          <Text className="text-md text-gray-500 mb-4">{agent.email}</Text>
          
          <View className={`px-2 py-1 rounded-full self-start mb-4 ${agent.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-sm font-semibold ${agent.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
              {agent?.status?.charAt(0)?.toUpperCase() + agent?.status?.slice(1)}
            </Text>
          </View>

          <Text className="font-bold text-gray-700 mt-2">Contact Information</Text>
          <Text className="text-gray-600">Phone: {agent.phone}</Text>
          <Text className="text-gray-600">Location: {agent.city}, {agent.region}</Text>
          <Text className="text-gray-600">Address: {agent.address}</Text>
        </View>

        <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-4">
          <Text className="text-xl font-bold text-gray-800 mb-2">Performance</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-gray-500">Devices Managed</Text>
              <Text className="text-lg font-semibold text-blue-600">{agent.devicesManaged}</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500">Total Sales</Text>
              <Text className="text-lg font-semibold text-blue-600">{agent.totalSales || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-4">
          <Text className="text-xl font-bold text-gray-800 mb-2">Commission</Text>
          <Text className="text-gray-600">Rate: {agent.commissionRate}%</Text>
          <Text className="text-gray-600">Balance: <Text className="font-bold text-green-600">{agent.commissionBalance}</Text></Text>
        </View>

        <View className="mt-4">
          <Text className="text-xl font-bold text-gray-800 mb-2 ml-2">Assigned Devices</Text>
          {agent.assignedDevices && agent.assignedDevices.length > 0 ? (
            agent.assignedDevices.map(device => (
              <View key={device.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-2">
                <Text className="font-bold">SN: {device.serialNumber}</Text>
                <Text>Customer: {device.customerName || 'N/A'}</Text>
                <Text>Status: {device.status}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 ml-2">No devices assigned yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
