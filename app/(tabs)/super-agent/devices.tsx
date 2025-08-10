
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';
import api from '@/services/api';

interface Device {
  id: string;
  serialNumber: string;
  status: 'available' | 'assigned';
  type: string;
  model: string;
}

interface Agent {
    id: string;
    name: string;
}

export default function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const response = await api.get('/super-agents/devices');
      setDevices(response.data);
    } catch (err) {
      setError('Failed to fetch devices.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
        const response = await api.get('/super-agents/my-agents');
        setAgents(response.data);
    } catch (err) {
        console.error("Failed to fetch agents for assignment", err);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchAgents();
  }, []);

  const handleAssignPress = (device: Device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const handleAssignDeviceToAgent = async (agentId: string) => {
    if (!selectedDevice) return;

    try {
      await api.post('/super-agents/assign-device', { 
        device_id: selectedDevice.id, 
        agent_id: agentId 
      });
      setModalVisible(false);
      setSelectedDevice(null);
      // Refresh the device list to show the updated status
      setLoading(true);
      fetchDevices();
    } catch (err) {
      console.error("Failed to assign device", err);
      alert("Failed to assign device. It may already be assigned or another error occurred.");
    }
  };

  const DeviceCard = ({ device }: { device: Device }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-center">
        <View>
            <Text className="text-lg font-bold text-gray-800">{device.type} - {device.model}</Text>
            <Text className="text-gray-500">SN: {device.serialNumber}</Text>
        </View>
        {device.status === 'available' ? (
          <TouchableOpacity 
            onPress={() => handleAssignPress(device)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
           >
            <Text className="text-white font-bold">Assign</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-green-600 font-semibold">Assigned</Text>
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
        <Text className="text-2xl font-bold text-gray-800 mb-4">My Devices</Text>
        <FlatList
          data={devices}
          renderItem={({ item }) => <DeviceCard device={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <Text className="text-center text-gray-500 mt-10">No devices assigned to you.</Text>}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-bold mb-4">Assign to Agent</Text>
            <FlatList 
                data={agents}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        onPress={() => handleAssignDeviceToAgent(item.id)}
                        className="p-3 border-b border-gray-200"
                    >
                        <Text className="text-lg">{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => <Text>No agents available.</Text>}
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
