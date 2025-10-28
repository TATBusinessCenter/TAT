import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    // placeholder: call API and store token
    // const res = await axios.post(`${process.env.API_URL}/auth/login`, { email, password });
    navigation.replace('Products');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TAT - Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Ingresar" onPress={onLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 12, borderRadius: 6 }
});