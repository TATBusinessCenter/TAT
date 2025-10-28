import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { RootStackParamList, Product } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

export default function ProductListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get<Product[]>('/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <Text style={styles.headerUser}>Salir</Text>
        </TouchableOpacity>
      ),
      headerTitle: user?.name ? `Productos — ${user.name}` : 'Productos'
    });
  }, [logout, navigation, user]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('POS', { product: item })}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price_sale.toLocaleString('es-AR')}</Text>
        <Text style={styles.stock}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos disponibles.</Text>}
        contentContainerStyle={products.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerUser: { color: '#d13f3f', marginRight: 12, fontWeight: '600' },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center'
  },
  info: { marginLeft: 8 },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  price: { color: '#1c7c54', marginBottom: 4 },
  stock: { color: '#666' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  empty: { textAlign: 'center', padding: 24, color: '#666' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' }
});
