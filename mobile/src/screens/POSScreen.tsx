import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';

export default function POSScreen({ route, navigation }: any) {
  const passedProduct = route.params?.product;
  const [cart, setCart] = useState<any[]>(passedProduct ? [{ ...passedProduct, qty: 1 }] : []);

  const addToCart = (product: any) => {
    setCart((c) => {
      const idx = c.findIndex((x) => x.id === product.id);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx].qty += 1;
        return copy;
      }
      return [...c, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS</Text>
      <FlatList
        data={cart}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name} x{item.qty}</Text>
            <Text>${item.price * item.qty}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${total}</Text>
      <Button title="Cobrar (Efectivo)" onPress={() => { /* TODO: registro local y sync */ Alert.alert('Pago registrado (mock)'); navigation.popToTop(); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  total: { fontSize: 18, textAlign: 'right', marginVertical: 12 }
});