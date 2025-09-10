// screens/Menu.js
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Menu({ navigation }) {
  const [apelido, setApelido] = useState('');

  // Carrega o apelido salvo
  useEffect(() => {
    (async () => {
      const salvo = await AsyncStorage.getItem('apelido');
      if (salvo) setApelido(salvo);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* agora o apelido aparece certo */}
      <Text style={styles.title}>Bem-vindo, {apelido}</Text>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ListaProdutos', { mode: 'all' })}>
        <Text style={styles.itemText}>1 - Listar todas as camisetas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('InserirCamisa')}>
        <Text style={styles.itemText}>2 - Inserir Camiseta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ListaProdutos', { mode: 'byName' })}>
        <Text style={styles.itemText}>3 - Listar por nome</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ListaProdutos', { mode: 'byColor' })}>
        <Text style={styles.itemText}>4 - Listar por cores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, styles.wishlist]}
        onPress={() => navigation.navigate('ListaDesejos')}>
        <Text style={[styles.itemText, styles.wishlistText]}>Lista de Desejos</Text>
      </TouchableOpacity>
    </View>
  );
}

// Mantendo exatamente o CSS que você pediu:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // fundo branco
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#800000', // bordô
    textAlign: 'center',
    marginVertical: 16,
  },
  item: {
    backgroundColor: '#fff', // branco
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 2,
    borderWidth: 1,
    borderColor: '#800000', // bordô
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  itemText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#800000', // bordô
  },
  wishlist: {
    backgroundColor: '#fff', // branco também
    borderColor: '#800000',
  },
  wishlistText: {
    color: '#800000', // bordô
  },
});
