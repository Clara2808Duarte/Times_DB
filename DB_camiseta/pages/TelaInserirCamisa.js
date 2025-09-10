// screens/InserirCamisa.js
import  { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { insertProduct } from '../database/db';

/* ===========================
   TELA DE INSERÇÃO DE CAMISA
   Permite cadastrar um novo produto
   preenchendo os campos do formulário.
=========================== */
export default function InserirCamisa({ navigation }) {
  // Estado que guarda os valores digitados no formulário
  const [formulario, setFormulario] = useState({
    name: '',
    preco: '',
    image: '',
    description: '',
    tamanho: '',
    cores: '',
  });

  // Atualiza um campo específico do formulário
  const atualizarCampo = (campo, valor) =>
    setFormulario((prev) => ({ ...prev, [campo]: valor }));

  // Salva o produto no banco
  const salvar = async () => {
    try {
      // Nome e preço são obrigatórios
      if (!formulario.name || !formulario.preco)
        return Alert.alert('Nome e Preço são obrigatórios');

      // Insere no banco
      await insertProduct(formulario);

      Alert.alert('Sucesso', 'Camiseta inserida!');
      navigation.navigate('Menu'); // volta para o menu
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao inserir.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Camiseta</Text>

      {/* Campos do formulário */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={formulario.name}
        onChangeText={(v) => atualizarCampo('name', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (ex: R$ 199,99)"
        value={formulario.preco}
        onChangeText={(v) => atualizarCampo('preco', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da Imagem"
        value={formulario.image}
        onChangeText={(v) => atualizarCampo('image', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={formulario.description}
        onChangeText={(v) => atualizarCampo('description', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tamanhos (ex: P,M,G)"
        value={formulario.tamanho}
        onChangeText={(v) => atualizarCampo('tamanho', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cores (ex: Azul,Vermelho)"
        value={formulario.cores}
        onChangeText={(v) => atualizarCampo('cores', v)}
      />

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonTxt}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', // fundo branco
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    color: '#800020', // vinho
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#800020',
    padding: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#800020',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  buttonTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
