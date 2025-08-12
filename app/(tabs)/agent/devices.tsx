import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '@/services/api';
import { useRouter } from 'expo-router'; // Import useRouter

interface Device {
  id: string;
  serialNumber: string;
  status: 'available' | 'assigned';
  type: string;
  model: string;
  assignedToCustomerId?: string;
  assignedToCustomerName?: string;
}

export default function AgentDevicesScreen() {
  const router = useRouter(); // Initialize useRouter
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const response = await api.get('/agents/devices'); // Fetch devices assigned by this agent
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch devices.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const DeviceCard = ({ device }: { device: Device }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-center">
        <View>
            <Text className="text-lg font-bold text-gray-800">{device.type} - {device.model}</Text>
            <Text className="text-gray-500">SN: {device.serialNumber}</Text>
        </View>
        {device.status === 'assigned' ? (
          <View className="items-end">
            <Text className="text-green-600 font-semibold">Assigned</Text>
            {device.assignedToCustomerName && (
                <Text className="text-gray-500 text-sm">To: {device.assignedToCustomerName}</Text>
            )}
          </View>
        ) : (
          <Text className="text-blue-600 font-semibold">Available</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" className="flex-1" />;
  }

  if (error) {
    return <Text className="text-red-500 text-center mt-10">{error}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">My Assigned Devices</Text>
        <FlatList
          data={devices}
          renderItem={({ item }) => <DeviceCard device={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <Text className="text-center text-gray-500 mt-10">No devices assigned by you.</Text>}
        />
      </View>
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
        onPress={() => router.push('/assign-device-to-customer')} // Navigate to the new screen
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
