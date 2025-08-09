
import { useLogout } from '@/hooks/useLogout';
import { Tabs } from 'expo-router';
import { LogOut } from 'lucide-react-native';

export default function SuperAgentLayout() {
  const logout = useLogout();

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="agents" options={{ title: 'Agents' }} />
      <Tabs.Screen name="customers" options={{ title: 'Customers' }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments' }} />
      <Tabs.Screen name="commissions" options={{ title: 'Commissions' }} />
      <Tabs.Screen 
        name="logout" 
        options={{
          title: 'Logout',
          tabBarIcon: ({ color, size }) => <LogOut color={color} size={size} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            logout();
          },
        }}
      />
    </Tabs>
  );
}
