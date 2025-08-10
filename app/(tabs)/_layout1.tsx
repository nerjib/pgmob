import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/hooks/useAuth';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userRole } = useAuth();

  if (!userRole) {
    // Optionally render a loading state or redirect to login if no role is set
    return null; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      {userRole === 'super-agent' && (
        <Tabs.Screen
          name="super-agent" // This will render the super-agent/_layout.tsx tabs
          options={{
            headerShown: false, // Hide header for nested tabs
            title: 'Super Agent',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      )}
      {userRole === 'agent' && (
        <Tabs.Screen
          name="agent" // This will render the agent/_layout.tsx tabs
          options={{
            headerShown: false, // Hide header for nested tabs
            title: 'Agent',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      )}
      {userRole === 'customer' && (
        <Tabs.Screen
          name="customer" // This will render the customer/_layout.tsx tabs
          options={{
            headerShown: false, // Hide header for nested tabs
            title: 'Customer',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      )}
      {/* Default tabs for unauthenticated or other roles, or if you want some common tabs */}
      {/* Example: <Tabs.Screen name="index" options={{ title: 'Home' }} /> */}
      {/* Example: <Tabs.Screen name="modal" options={{ title: 'Modal' }} /> */}
    </Tabs>
  );
}
