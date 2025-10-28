import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductList';
import POSScreen from '../screens/POSScreen';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  POS: { product?: Product } | undefined;
};

export type Product = {
  id: number;
  name: string;
  price_sale: number;
  stock: number;
  price_cost?: number | null;
  min_stock?: number;
  description?: string | null;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Products" component={ProductListScreen} options={{ title: 'Productos' }} />
          <Stack.Screen name="POS" component={POSScreen} options={{ title: 'Registrar venta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
