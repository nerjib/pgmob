import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';

interface Agent {
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
  devicesManaged: string;
  totalSales: string;
  assignedDevices: any[]; // Array of assigned devices
  withdrawalHistory: any[]; // Array of withdrawal history
}

export default function AgentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFabOptions, setShowFabOptions] = useState(false);

  const handleAssignDevice = () => {
    if (agent) {
      router.push({ pathname: '/assign-device-to-agent', params: { agentId: agent.id } });
    } else {
      Alert.alert('Error', 'Agent data not loaded yet.');
    }
    setShowFabOptions(false);
  };

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await api.get(`/agents/${id}`); // Using the /agents/:id endpoint
        setAgent(response.data);
      } catch (err) {
        console.error('Failed to fetch agent details:', err);
        setError('Failed to load agent details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgentDetails();
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

  if (!agent) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-center">Agent not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Stack.Screen options={{ title: agent.name || 'Agent Details' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">{agent.name}</Text>

        {/* Basic Information */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Basic Information</Text>
          <Text className="text-gray-600 mb-1">Email: {agent.email || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Phone: {agent.phone || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Status: {agent.status || 'N/A'}</Text>
          <Text className="text-gray-600 mb-1">Join Date: {new Date(agent.joinDate).toLocaleDateString()}</Text>
          <Text className="text-gray-600 mb-1">Last Active: {agent.last_active ? new Date(agent.last_active).toLocaleString() : 'N/A'}</Text>
        </View>

        {/* Commission Details */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Commission Details</Text>
          <Text className="text-gray-600 mb-1">Commission Rate: {agent.commissionRate}%</Text>
          <Text className="text-gray-600 mb-1">Total Earned: {agent.totalCommissionsEarned}</Text>
          <Text className="text-gray-600 mb-1">Commission Paid: {agent.commissionPaid}</Text>
          <Text className="text-gray-600 mb-1">Commission Balance: {agent.commissionBalance}</Text>
        </View>

        {/* Performance Metrics */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Performance Metrics</Text>
          <Text className="text-gray-600 mb-1">Devices Managed: {agent.devicesManaged}</Text>
          <Text className="text-gray-600 mb-1">Total Sales: {agent.totalSales}</Text>
        </View>

        {/* Assigned Devices */}
        {agent.assignedDevices && agent.assignedDevices.length > 0 && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Assigned Devices</Text>
            <FlatList
              data={agent.assignedDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item: device }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">{device.serialNumber} ({device.type})</Text>
                  <Text className="text-gray-600">Status: {device.status}</Text>
                  <Text className="text-gray-600">Customer: {device.customerName || 'N/A'}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Withdrawal History */}
        {agent.withdrawalHistory && agent.withdrawalHistory.length > 0 && (
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Withdrawal History</Text>
            <FlatList
              data={agent.withdrawalHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item: withdrawal }) => (
                <View className="border-b border-gray-100 py-2">
                  <Text className="font-medium">Amount: {withdrawal.amount}</Text>
                  <Text className="text-gray-600">Date: {new Date(withdrawal.date).toLocaleDateString()}</Text>
                  <Text className="text-gray-600">Transaction ID: {withdrawal.transactionId || 'N/A'}</Text>
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