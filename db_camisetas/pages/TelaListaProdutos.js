// screens/ListaProdutos.js
import { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllProducts, getByNameLike, getByColorLike } from '../database/db';

/* ===========================
   COMPONENTE DE CARD (item)
=========================== */
const Card = ({ camisa, onPress, onFav, estaFavorito }) => (
  <View style={itemStyles.card}>
    <TouchableOpacity style={itemStyles.touchArea} onPress={onPress}>
      <Image source={{ uri: camisa.image }} style={itemStyles.image} />
      <Text style={itemStyles.name}>{camisa.name}</Text>
      <Text style={itemStyles.preco}>{camisa.preco}</Text>
      <Text style={itemStyles.extra} numberOfLines={1}>
        Tamanhos: {camisa.tamanho}
      </Text>
      <Text style={itemStyles.extra} numberOfLines={1}>
        Cores: {camisa.cores}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        itemStyles.botaoFav,
        estaFavorito && {
          backgroundColor: '#fff',
          borderWidth: 2,
          borderColor: '#800000',
        },
      ]}
      onPress={onFav}>
      <Text
        style={[
          itemStyles.textoFav,
          estaFavorito && { color: '#800000', fontWeight: '700' },
        ]}>
        {estaFavorito ? 'Favorita' : 'Favoritar'}
      </Text>
    </TouchableOpacity>
  </View>
);

/* ===========================
   TELA PRINCIPAL
=========================== */
export default function ListaProdutos({ navigation, route }) {
  const mode = route?.params?.mode || 'all';

  const [nome, setNome] = useState('');
  const [camisas, setCamisas] = useState([]);
  const [texto, setTexto] = useState('');
  const [favoritos, setFavoritos] = useState([]);

  // Carrega apelido e lista de favoritos
  useEffect(() => {
    (async () => {
      const nomeSalvo = await AsyncStorage.getItem('apelido');
      if (nomeSalvo) setNome(nomeSalvo);

      const desejos = await AsyncStorage.getItem('desejos');
      if (desejos) setFavoritos(JSON.parse(desejos));
    })();
  }, []);

  // Carrega produtos
  const carregar = async () => {
    try {
      if (mode === 'all') setCamisas(await getAllProducts());
      else if (mode === 'byName') setCamisas(await getByNameLike(texto));
      else if (mode === 'byColor') setCamisas(await getByColorLike(texto));
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao carregar produtos.');
    }
  };

  useEffect(() => {
    carregar();
  }, [mode]);

  // Favoritar camisa
  const favoritar = async (camisa) => {
    const salvo = await AsyncStorage.getItem('desejos');
    let listaDesejos = salvo ? JSON.parse(salvo) : [];

    const existe = listaDesejos.find((c) => c.id === camisa.id);
    if (existe) {
      Alert.alert('Atenção!', 'Essa camisa já está na lista de desejos!');
      return;
    }

    listaDesejos.push(camisa);
    await AsyncStorage.setItem('desejos', JSON.stringify(listaDesejos));
    setFavoritos(listaDesejos);
    Alert.alert('Parabéns!', 'Camisa adicionada à lista de desejos!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Olá, {nome}!</Text>

      {(mode === 'byName' || mode === 'byColor') && (
        <View style={styles.searchRow}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder={
              mode === 'byName' ? 'Digite parte do nome...' : 'Digite a cor...'
            }
            style={styles.search}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={carregar}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Buscar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={camisas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Card
            camisa={item}
            onPress={() => navigation.navigate('Details', { camisa: item })}
            onFav={() => favoritar(item)}
            estaFavorito={!!favoritos.find((p) => p.id === item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.semResultados}>
            {mode === 'all'
              ? 'Sem produtos.'
              : 'Nenhum resultado para a busca.'}
          </Text>
        }
      />
    </View>
  );
}

/* ===========================
   ESTILOS DA TELA
=========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#800000',
    textAlign: 'center',
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  search: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#800000',
    padding: 10,
    color: '#800000',
    fontWeight: '600',
  },
  searchBtn: {
    backgroundColor: '#800000',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semResultados: {
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 24,
    color: '#800000',
  },
});

/* ===========================
   ESTILOS CARD
=========================== */
const itemStyles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#800000',
    padding: 10,
    backgroundColor: '#fff',
  },
  touchArea: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  name: {
    marginTop: 8,
    fontWeight: '700',
    color: '#800000',
    textAlign: 'center',
  },
  preco: {
    marginTop: 4,
    fontWeight: '600',
    color: '#800000',
  },
  extra: {
    fontSize: 12,
    color: '#666',
    maxWidth: '90%',
    textAlign: 'center',
  },
  botaoFav: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#800000',
  },
  textoFav: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
