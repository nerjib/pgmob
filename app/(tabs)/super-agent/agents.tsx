
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/services/api';

// 1. Agent Interface
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  devicesManaged: number;
  totalSales: string | null;
  status: 'active' | 'inactive';
}

// Agent Card Component
const AgentCard = ({ agent, onPress }: { agent: Agent; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-bold text-gray-800">{agent.name}</Text>
      <View className={`px-2 py-1 rounded-full ${agent.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`text-xs font-semibold ${agent.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
          {agent.status}
        </Text>
      </View>
    </View>
    <Text className="text-gray-600 mb-1">{agent.region}</Text>
    <View className="flex-row justify-between mt-2 border-t border-gray-100 pt-2">
      <View className="items-center">
        <Text className="text-sm text-gray-500">Devices</Text>
        <Text className="text-md font-semibold text-gray-800">{agent.devicesManaged}</Text>
      </View>
      <View className="items-center">
        <Text className="text-sm text-gray-500">Total Sales</Text>
        <Text className="text-md font-semibold text-gray-800">{agent.totalSales || 'N/A'}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Main Screen Component
export default function AgentsScreen() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/super-agents/my-agents');
        setAgents(response.data);
      } catch (err) {
        setError('Failed to fetch agents. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentPress = (agentId: string) => {
    router.push(`/agent-details/${agentId}`);
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
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">My Agents</Text>
        <TouchableOpacity
          onPress={() => router.push('/onboard-agent')}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 self-start"
        >
          <Text className="text-white font-bold">+ Onboard New Agent</Text>
        </TouchableOpacity>
        <FlatList
          data={agents}
          renderItem={({ item }) => <AgentCard agent={item} onPress={() => handleAgentPress(item.id)} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">You have not onboarded any agents yet.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
