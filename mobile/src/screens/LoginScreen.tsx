import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@tat.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'No se pudo iniciar sesión';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TAT — Punto de Venta</Text>
      <Text style={styles.subtitle}>Ingresa con tus credenciales</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {loading ? <ActivityIndicator /> : <Button title="Ingresar" onPress={onLogin} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, marginBottom: 8, textAlign: 'center', fontWeight: '700' },
  subtitle: { fontSize: 14, marginBottom: 24, textAlign: 'center', color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fafafa'
  }
});
