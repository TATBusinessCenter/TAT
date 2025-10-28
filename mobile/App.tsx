import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStack from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}