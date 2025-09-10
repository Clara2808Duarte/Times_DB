// screens/DetalhesCamisa.js
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteProduct } from '../database/db';

export default function DetalhesCamisa({ route, navigation }) {
  const { camisa } = route.params;

  const listaTamanhos = camisa.tamanho
    ? camisa.tamanho.split(',').map((t) => t.trim())
    : [];
  const listaCores = camisa.cores
    ? camisa.cores.split(',').map((c) => c.trim())
    : [];

  const [quantidadeNumero, setQuantidadeNumero] = useState('1');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [cep, setCep] = useState('');
  const [erroCep, setErroCep] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('Econômica');
  const [favorito, setFavorito] = useState(false);

  // Carrega nome do usuário e verifica se está nos favoritos
  useEffect(() => {
    (async () => {
      const nomeSalvo = await AsyncStorage.getItem('apelido');
      if (nomeSalvo) setNomeUsuario(nomeSalvo);

      const favSalvos = await AsyncStorage.getItem('desejos');
      const lista = favSalvos ? JSON.parse(favSalvos) : [];
      setFavorito(!!lista.find((item) => item.id === camisa.id));
    })();
  }, []);

  // Função de validação de CEP
  const validarCep = (cep) => {
    const regex = /^\d{5}-?\d{3}$/;
    const valido = regex.test(cep);
    setErroCep(valido ? '' : 'CEP inválido');
    return valido;
  };

  // Calcula frete
  const calcularFrete = () => (metodoEntrega === 'Expressa' ? 32 : 18.5);

  // Calcula total
  const precoNumber =
    parseFloat(camisa.preco.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const calcularTotal = () =>
    precoNumber * parseInt(quantidadeNumero || '1') + calcularFrete();

  // Realizar compra
  const realizarCompra = () => {
    // Remove tudo que não é número e converte para inteiro
    const qtd = parseInt(quantidadeNumero.replace(/\D/g, ''));

    // Converte o estoque para número
    const estoque = parseInt(camisa.estoque);

    // Validações
    if (!tamanhoSelecionado) return Alert.alert('Selecione um tamanho');
    if (!corSelecionada) return Alert.alert('Selecione uma cor');
    if (qtd <= 0) return Alert.alert('Quantidade inválida');
    if (qtd > estoque) return Alert.alert('Estoque insuficiente');

    // Calcula total
    const precoNumber =
      parseFloat(camisa.preco.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const frete = metodoEntrega === 'Expressa' ? 32 : 18.5;
    const total = precoNumber * qtd + frete;

    // Mostra alerta de compra realizada
    Alert.alert(
      'Compra Realizada',
      `Parabéns ${nomeUsuario}, você comprou ${qtd} camisas do ${camisa.name}
Tamanho: ${tamanhoSelecionado}
Cor: ${corSelecionada}
Total: R$${total.toFixed(2)}`
    );
  };

  // Toggle favorito/desfavoritar
  const toggleFavorito = async () => {
    const salvo = await AsyncStorage.getItem('desejos');
    let lista = salvo ? JSON.parse(salvo) : [];
    const existe = lista.find((item) => item.id === camisa.id);

    if (existe) {
      lista = lista.filter((item) => item.id !== camisa.id);
      Alert.alert('Removido', 'Camisa removida da lista de desejos!');
      setFavorito(false);
    } else {
      lista.push(camisa);
      Alert.alert('Adicionado', 'Camisa adicionada à lista de desejos!');
      setFavorito(true);
    }

    await AsyncStorage.setItem('desejos', JSON.stringify(lista));
  };

  // Navega para tela de edição
  const corrigir = () => navigation.navigate('EditarCamisa', { camisa });

  // Deleta o produto
  const deletar = async () => {
    Alert.alert('Confirmar', 'Deseja deletar esta camiseta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        onPress: async () => {
          await deleteProduct(camisa.id);
          Alert.alert('Deletado!');
          navigation.navigate('Menu');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: camisa.image }} style={styles.imagemGrande} />

      <ScrollView style={styles.caixaDetalhes}>
        <Text style={styles.nome}>{camisa.name}</Text>
        <Text style={styles.preco}>{camisa.preco}</Text>
        <Text style={styles.descricao}>{camisa.description}</Text>

        <View style={styles.caixa}>
          <Text style={styles.rotulo}>Quantidade:</Text>
          <TextInput
            style={styles.inputQuantidade}
            keyboardType="numeric"
            value={quantidadeNumero}
            onChangeText={setQuantidadeNumero}
          />
        </View>

        {listaCores.length > 0 && (
          <View style={styles.caixa}>
            <Text style={styles.rotulo}>Cor:</Text>
            <View style={styles.listaOpcoes}>
              {listaCores.map((cor) => (
                <TouchableOpacity
                  key={cor}
                  style={[
                    styles.opcao,
                    corSelecionada === cor && styles.opcaoAtiva,
                  ]}
                  onPress={() => setCorSelecionada(cor)}>
                  <Text
                    style={[
                      styles.textoOpcao,
                      corSelecionada === cor && styles.textoOpcaoAtiva,
                    ]}>
                    {cor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {listaTamanhos.length > 0 && (
          <View style={styles.caixa}>
            <Text style={styles.rotulo}>Tamanho:</Text>
            <View style={styles.listaOpcoes}>
              {listaTamanhos.map((tamanho) => (
                <TouchableOpacity
                  key={tamanho}
                  style={[
                    styles.opcao,
                    tamanhoSelecionado === tamanho && styles.opcaoAtiva,
                  ]}
                  onPress={() => setTamanhoSelecionado(tamanho)}>
                  <Text
                    style={[
                      styles.textoOpcao,
                      tamanhoSelecionado === tamanho && styles.textoOpcaoAtiva,
                    ]}>
                    {tamanho}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.tituloSecao}>Calcular frete</Text>
        <TextInput
          placeholder="Digite seu CEP"
          value={cep}
          onChangeText={setCep}
          onBlur={() => validarCep(cep)}
          style={[styles.input, erroCep && styles.inputErro]}
          keyboardType="numeric"
          maxLength={9}
        />
        {erroCep ? <Text style={styles.textoErro}>{erroCep}</Text> : null}

        <Text style={styles.subtitulo}>Método de entrega</Text>
        <View style={styles.linhaEntrega}>
          <TouchableOpacity
            onPress={() => setMetodoEntrega('Econômica')}
            style={styles.botaoEntrega}>
            <Text>Econômica</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMetodoEntrega('Expressa')}
            style={styles.botaoEntrega}>
            <Text>Expressa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.textoFrete}>
          Frete: R$ {calcularFrete().toFixed(2)}
        </Text>
        <Text style={styles.textoTotal}>
          Total: R$ {calcularTotal().toFixed(2)}
        </Text>

        {/* Linha 1: Comprar + Favoritar/Desfavoritar */}
        <View style={styles.linhaBotoes}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoPadrao]}
            onPress={realizarCompra}>
            <Text style={styles.textoBotao}>Comprar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botao,
              favorito ? styles.botaoDesfavoritar : styles.botaoPadrao,
            ]}
            activeOpacity={0.7}
            onPress={toggleFavorito}>
            <Text style={[styles.textoBotao, favorito && { color: '#800000' }]}>
              {favorito ? 'Desfavoritar' : 'Favoritar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Linha 2: Corrigir + Deletar */}
        <View style={styles.linhaBotoes}>
          <TouchableOpacity style={styles.botao} onPress={corrigir}>
            <Text style={styles.textoBotao}>Corrigir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botao} onPress={deletar}>
            <Text style={styles.textoBotao}>Deletar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  imagemGrande: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  caixaDetalhes: { flex: 1 },
  nome: { fontSize: 24, fontWeight: '700', color: '#800000', marginBottom: 4 },
  preco: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 8 },
  descricao: { fontSize: 14, color: '#333', marginBottom: 12 },
  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#800000',
    marginBottom: 6,
  },
  caixa: { marginBottom: 12 },
  inputQuantidade: {
    borderWidth: 1,
    borderColor: '#800000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    width: 80,
    textAlign: 'center',
  },
  listaOpcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#800000',
    backgroundColor: '#fff',
  },
  opcaoAtiva: { backgroundColor: '#800000' },
  textoOpcao: { fontSize: 14, color: '#800000' },
  textoOpcaoAtiva: { color: '#fff', fontWeight: '700' },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  linhaEntrega: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  botaoEntrega: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#800000',
    alignItems: 'center',
  },
  textoFrete: { marginTop: 6, fontWeight: '600', color: '#333' },
  textoTotal: { marginTop: 2, fontWeight: '700', color: '#333' },
  linhaBotoes: { flexDirection: 'row', gap: 12, marginTop: 12 },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#800000',
  },
  botaoDesfavoritar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#800000',
  },
  textoBotao: { color: '#fff', fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#800000',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputErro: { borderColor: 'red' },
  textoErro: { color: 'red', marginTop: 4 },
  subtitulo: { fontWeight: '600', marginTop: 8, marginBottom: 4 },
});
