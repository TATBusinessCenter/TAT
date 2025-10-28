import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

type Product = { id: string; name: string; price: number; image?: string };

export default function ProductListScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO: replace with API call
    setProducts([
      { id: '1', name: 'Moto Alpha 150', price: 120000, image: '' },
      { id: '2', name: 'Casco Integral', price: 6500, image: '' }
    ]);
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('POS', { product: item })}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={products} keyExtractor={(i) => i.id} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center' },
  info: { marginLeft: 8 },
  name: { fontSize: 16 },
  price: { color: '#666' }
});