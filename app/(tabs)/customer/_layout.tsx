
import { Tabs, useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useLogout } from '@/hooks/useLogout';

export default function CustomerLayout() {
  const logout = useLogout();

  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="devices" options={{ title: 'Devices' }} />
      <Tabs.Screen name="loans" options={{ title: 'Loans' }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments' }} />
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
