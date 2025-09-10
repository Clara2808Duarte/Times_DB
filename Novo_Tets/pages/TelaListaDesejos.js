// screens/TelaListaDesejos.js
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaListaDesejos({ navigation }) {
  // Estado que armazena a lista de desejos carregada do AsyncStorage
  const [listaDesejos, setListaDesejos] = useState([]);

  // Função para carregar a lista de desejos do AsyncStorage
  const carregarLista = async () => {
    const salvo = await AsyncStorage.getItem('desejos');
    if (salvo) setListaDesejos(JSON.parse(salvo));
    // Se tiver salvo, transforma em objeto
    else setListaDesejos([]); // Se não tiver, seta lista vazia
  };

  // useEffect para recarregar a lista sempre que a tela recebe foco
  useEffect(() => {
    const unsub = navigation.addListener('focus', carregarLista);
    carregarLista();
    return unsub;
  }, [navigation]);

  // Função para remover um item da lista de desejos
  const removerItem = async (id) => {
    const novaLista = listaDesejos.filter((item) => item.id !== id);
    setListaDesejos(novaLista);
    await AsyncStorage.setItem('desejos', JSON.stringify(novaLista)); // Salva a nova lista
  };

  // Função que confirma antes de remover
  const confirmarRemocao = (id, nome) => {
    Alert.alert('Remover', `Remover "${nome}" da sua lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removerItem(id) },
    ]);
  };

  return (
    <View style={estilos.container}>
      {/* Caso a lista esteja vazia, mostra mensagem */}
      {listaDesejos.length === 0 ? (
        <View style={estilos.center}>
          <Text style={estilos.vazio}>Sua lista está vazia </Text>
        </View>
      ) : (
        <FlatList
          data={listaDesejos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={estilos.item}
              onPress={() => navigation.navigate('Details', { camisa: item })}>
              {/* Exibe imagem da camiseta ou placeholder */}
              {item.image ? (
                <Image source={{ uri: item.image }} style={estilos.imagem} />
              ) : (
                <View style={[estilos.imagem, estilos.placeholder]}>
                  <Text>📷</Text>
                </View>
              )}

              {/* Informações da camiseta */}
              <View style={estilos.info}>
                <Text style={estilos.nome}>{item.name}</Text>
                <Text style={estilos.preco}>{item.preco}</Text>
              </View>

              {/* Botão de remover da lista */}
              <TouchableOpacity
                style={estilos.botaoRemover}
                onPress={() => confirmarRemocao(item.id, item.name)}>
                <Text style={estilos.textoRemover}>Remover</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // fundo branco
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazio: {
    fontSize: 18,
    color: '#800000', // bordô
    fontWeight: '700',
  },
  lista: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#800000', // borda bordô
  },
  imagem: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F9F5F5', // leve tom neutro
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#800000', // bordô
    marginBottom: 4,
  },
  preco: {
    fontSize: 16,
    color: '#800000', // bordô
    fontWeight: '600',
  },
  botaoRemover: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff', // fundo branco
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#800000', // borda bordô
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoRemover: {
    color: '#800000', // bordô
    fontWeight: '700',
    fontSize: 14,
  },
});
