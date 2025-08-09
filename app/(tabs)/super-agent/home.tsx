
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, DollarSign, Users, BarChart3 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

interface DashboardData {
  agentsManaged: number;
  totalCustomers: number;
  totalSalesVolume: string;
  totalCommissionsEarned: string;
}

const StatCard = ({ icon, label, value, color }) => (
  <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 items-center">
    <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${color}`}>
      {icon}
    </View>
    <Text className="text-gray-500 text-sm">{label}</Text>
    <Text className="text-xl font-bold text-gray-800">{value}</Text>
  </View>
);

export default function SuperAgentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) setUser(JSON.parse(userString));

      const response = await api.get('/super-agents/dashboard');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" className="flex-1" />;
  }

  if (error) {
    return <Text className="text-red-500 text-center mt-10">{error}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Welcome, {user?.username || ''}</Text>
          <Text className="text-md text-gray-500">Here is your performance overview.</Text>
        </View>

        <View className="grid grid-cols-2 gap-4 mb-6">
            <View className="flex-row gap-4 mb-4">
                 <StatCard 
                    icon={<User size={24} color="#1D4ED8" />} 
                    label="Agents Managed" 
                    value={data?.agentsManaged || 0}
                    color="bg-blue-100"
                />
                <StatCard 
                    icon={<Users size={24} color="#059669" />} 
                    label="Total Customers" 
                    value={data?.totalCustomers || 0}
                    color="bg-green-100"
                />
            </View>
            <View className="flex-row gap-4">
                <StatCard 
                    icon={<BarChart3 size={24} color="#D97706" />} 
                    label="Sales Volume" 
                    value={`₦${parseFloat(data?.totalSalesVolume || '0').toLocaleString()}`}
                    color="bg-amber-100"
                />
                <StatCard 
                    icon={<DollarSign size={24} color="#BE185D" />} 
                    label="Commissions" 
                    value={`₦${parseFloat(data?.totalCommissionsEarned || '0').toLocaleString()}`}
                    color="bg-pink-100"
                />
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
