import { Tabs, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AgentLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: true, // Show header for this specific tab
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <Pressable onPress={() => router.push('/modal')} style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle" // Example: Info icon
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
              <Pressable onPress={async () => {
                await AsyncStorage.clear(); // Clear all stored data
                router.replace('/(auth)/login'); // Redirect to login
              }}>
                {({ pressed }) => (
                  <FontAwesome
                    name="sign-out" // Logout icon
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen name="customers" options={{ title: 'Customers', tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} /> }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments', tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} /> }} />
      <Tabs.Screen name="devices" options={{ title: 'Devices', tabBarIcon: ({ color }) => <TabBarIcon name="mobile" color={color} /> }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
          headerRight: () => (
            <Pressable onPress={async () => {
              console.log('Logout button pressed on profile tab (Agent)');
              try {
                await AsyncStorage.clear(); // Clear all stored data
                console.log('AsyncStorage cleared.');
                router.replace('/(auth)/login'); // Redirect to login
                console.log('Redirecting to login page.');
              } catch (e) {
                console.error('Error during logout:', e);
              }
            }}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out" // Logout icon
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}