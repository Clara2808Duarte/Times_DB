// screens/EditarCamisa.js
import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { updateProduct } from '../database/db';

/* ===========================
   TELA DE EDIÇÃO DE CAMISA
   Permite alterar os dados
   de um produto existente
=========================== */
export default function EditarCamisa({ route, navigation }) {
  const { camisa } = route.params;

  // Estado com os valores do formulário (pré-preenchidos com a camisa recebida)
  const [form, setForm] = useState({
    name: camisa.name || '',
    preco: camisa.preco || '',
    image: camisa.image || '',
    description: camisa.description || '',
    tamanho: camisa.tamanho || '',
    cores: camisa.cores || '',
  });

  // Atualiza um campo específico do formulário
  const onChange = (campo, valor) =>
    setForm((prev) => ({ ...prev, [campo]: valor })); // Atualiza o estado 'form', mantendo os valores antigos e alterando apenas o campo especificado

  // Salvar alterações no banco
  const salvar = async () => {
    try {
      if (!form.name || !form.preco) {
        return Alert.alert('Nome e Preço são obrigatórios');
      }
      await updateProduct(camisa.id, form);
      Alert.alert('Sucesso', 'Camiseta atualizada!');
      navigation.navigate('Menu');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao atualizar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Corrigir Camiseta</Text>

      {/* Campos do formulário */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.name}
        onChangeText={(valor) => onChange('name', valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (ex: R$ 199,99)"
        value={form.preco}
        onChangeText={(valor) => onChange('preco', valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da Imagem"
        value={form.image}
        onChangeText={(valor) => onChange('image', valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={form.description}
        onChangeText={(valor) => onChange('description', valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tamanhos (ex: P,M,G)"
        value={form.tamanho}
        onChangeText={(valor) => onChange('tamanho', valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cores (ex: Azul,Vermelho)"
        value={form.cores}
        onChangeText={(valor) => onChange('cores', valor)}
      />

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonTxt}>Salvar alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


/* ===========================
   ESTILOS
=========================== */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F4F5', // fundo cinza claro
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1F2937', // cinza escuro
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff', // fundo branco
    borderRadius: 10,
    borderWidth: 2,          // deixa a borda mais visível
    borderColor: '#800000',  // bordô
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#800000', // bordô
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonTxt: {
    color: '#fff',            // texto branco
    fontWeight: '700',
    fontSize: 15,
  },
});