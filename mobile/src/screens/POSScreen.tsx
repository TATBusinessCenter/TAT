import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../navigation';
import { api } from '../services/api';

interface CartItem extends Product {
  qty: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'POS'>;

export default function POSScreen({ route, navigation }: Props) {
  const passedProduct = route.params?.product;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!passedProduct) return;
    setCart((current) => {
      const exists = current.find((item) => item.id === passedProduct.id);
      if (exists) {
        return current.map((item) =>
          item.id === passedProduct.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...passedProduct, qty: 1 }];
    });
  }, [passedProduct]);

  const addQty = (productId: number) => {
    setCart((current) =>
      current.map((item) => (item.id === productId ? { ...item, qty: item.qty + 1 } : item))
    );
  };

  const removeQty = (productId: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price_sale * item.qty, 0),
    [cart]
  );

  const submitSale = async () => {
    if (!cart.length) {
      Alert.alert('Carrito vacío', 'Agrega productos para registrar la venta.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/sales', {
        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
          unitPrice: item.price_sale
        }))
      });
      Alert.alert('Venta registrada', 'La venta se cargó correctamente.');
      setCart([]);
      navigation.navigate('Products');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo registrar la venta';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Carrito de venta</Text>
            <Button title="Agregar productos" onPress={() => navigation.navigate('Products')} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aún no agregaste productos.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>${item.price_sale.toLocaleString('es-AR')} c/u</Text>
            </View>
            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => removeQty(item.id)}>
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => addQty(item.id)}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.lineTotal}>
              ${(item.price_sale * item.qty).toLocaleString('es-AR')}
            </Text>
          </View>
        )}
        contentContainerStyle={cart.length === 0 ? styles.emptyContainer : undefined}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toLocaleString('es-AR')}</Text>
        <Button title={submitting ? 'Registrando...' : 'Registrar venta'} onPress={submitSale} disabled={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0'
  },
  name: { fontSize: 16, fontWeight: '600' },
  details: { color: '#666' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyButtonText: { fontSize: 18, fontWeight: '600' },
  qty: { marginHorizontal: 8, minWidth: 24, textAlign: 'center', fontWeight: '600' },
  lineTotal: { fontWeight: '600', minWidth: 90, textAlign: 'right' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#f0f0f0' },
  total: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', padding: 32, color: '#666' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' }
});
