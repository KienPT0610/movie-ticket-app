import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E50914', // Netflix Red
        tabBarInactiveTintColor: '#B3B3B3',
        tabBarStyle: {
          backgroundColor: '#141414',
          borderTopColor: '#2A2A2A',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Phim',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="film" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Vé của tôi',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="ticket" color={color} />,
        }}
      />
    </Tabs>
  );
}
