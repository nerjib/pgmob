import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';

interface Device {
  id: string;
  serialNumber: string;
  status: string;
  type: string;
  model: string;
}

export default function AssignDeviceToAgentScreen() {
  const { agentId } = useLocalSearchParams();
  const router = useRouter();
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAssignDevice = async (deviceId: string) => {
    if (!agentId) {
      Alert.alert('Error', 'Agent ID is missing.');
      return;
    }

    setAssigning(true);
    try {
      await api.post('/super-agents/assign-device', {
        device_id: deviceId,
        agent_id: agentId,
      });
      Alert.alert('Success', 'Device assigned successfully to agent!');
      router.back(); // Go back to agent details
    } catch (err) {
      console.error('Failed to assign device:', err);
      Alert.alert('Error', 'Failed to assign device. Please try again.');
    } finally {
      setAssigning(false);
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
      <Stack.Screen options={{ title: 'Assign Device to Agent' }} />
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Select a Device to Assign</Text>

        <FlatList
          data={availableDevices}
          keyExtractor={(item) => item.id}
          renderItem={({ item: device }) => (
            <TouchableOpacity
              className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 flex-row justify-between items-center"
              onPress={() => handleAssignDevice(device.id)}
              disabled={assigning}
            >
              <View>
                <Text className="text-lg font-bold text-gray-800">{device.serialNumber}</Text>
                <Text className="text-gray-600">Type: {device.type} - Model: {device.model}</Text>
                <Text className="text-gray-600">Status: {device.status}</Text>
              </View>
              {assigning && <ActivityIndicator size="small" color="#2563EB" />}
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">No available devices found.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
