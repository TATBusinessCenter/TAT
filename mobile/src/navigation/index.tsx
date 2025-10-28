import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductList';
import POSScreen from '../screens/POSScreen';

export type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  POS: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="POS" component={POSScreen} />
    </Stack.Navigator>
  );
}