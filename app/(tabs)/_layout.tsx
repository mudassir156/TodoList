import { Tabs } from 'expo-router';
import React from 'react';
import {Stack} from 'expo-router';

export default function TabLayout() {

  return (
    <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name='index' />
      
    </Stack>
  );
}
