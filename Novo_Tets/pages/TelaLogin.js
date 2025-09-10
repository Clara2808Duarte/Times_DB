// screens/Login.js
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [erroUsuario, setErroUsuario] = useState('');

  const validarLogin = async () => {
    if (!usuario.trim()) {
      setErroUsuario('O usuário é obrigatório.');
      return;
    } else {
      setErroUsuario('');
    }

    if (usuario === 'aluno' && senha === '123') {
      try {
        await AsyncStorage.setItem('usuarioLogado', apelido);
        Alert.alert('Sucesso!', 'Login realizado com sucesso.');
        navigation.replace('Menu');
      } catch (e) {
        console.error('Erro ao salvar usuário:', e);
      }
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Loja de Camisetas</Text>

        <View style={styles.bloco}>
          <Text style={styles.rotulo}>Usuário</Text>
          <TextInput
            placeholder="Digite seu usuário"
            value={usuario}
            onChangeText={setUsuario}
            style={[styles.input, erroUsuario ? styles.inputErro : null]}
            placeholderTextColor="#800000"
          />
          {erroUsuario ? (
            <Text style={styles.textoErro}>{erroUsuario}</Text>
          ) : null}
        </View>

        <View style={styles.bloco}>
          <Text style={styles.rotulo}>Apelido</Text>
          <TextInput
            placeholder="Digite como quer ser chamado"
            value={apelido}
            onChangeText={setApelido}
            style={styles.input}
            placeholderTextColor="#800000"
          />
        </View>

        <View style={styles.bloco}>
          <Text style={styles.rotulo}>Senha</Text>
          <TextInput
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            placeholderTextColor="#800000"
          />
        </View>

        <TouchableOpacity style={styles.botao} onPress={validarLogin}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // fundo branco
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff', // card branco
    borderRadius: 16,
    padding: 25,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#800000', // bordô
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1,
  },
  bloco: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#800000', // bordô
    marginBottom: 8,
  },
  input: {
    color: '#000',
    borderWidth: 1,
    borderColor: '#800000', // borda bordô
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff', // fundo branco
    fontSize: 15,
  },
  inputErro: {
    borderColor: '#FF0000', // vermelho se houver erro
  },
  textoErro: {
    color: '#FF0000',
    marginTop: 6,
    fontSize: 13,
  },
  botao: {
    backgroundColor: '#800000', // bordô
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff', // branco
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
