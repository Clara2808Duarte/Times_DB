// App.js
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDB, insertInicial } from './database/db';
import Login from './pages/TelaLogin';
import Menu from './pages/TelaMenu';
import ListaProdutos from './pages/TelaListaProdutos';
import DetalhesCamisa from './pages/TelaDetalhesCamisa';
import InserirCamisa from './pages/TelaInserirCamisa';
import EditarCamisa from './pages/TelaEditarCamisa';
import TelaListaDesejos from './pages/TelaListaDesejos';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      await initDB();
      await insertInicial();
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ title: 'Menu' }}
        />
        <Stack.Screen
          name="ListaProdutos"
          component={ListaProdutos}
          options={{ title: 'Camisetas' }}
        />
        <Stack.Screen
          name="Details"
          component={DetalhesCamisa}
          options={{ title: 'Detalhes' }}
        />
        <Stack.Screen
          name="InserirCamisa"
          component={InserirCamisa}
          options={{ title: 'Inserir' }}
        />
        <Stack.Screen
          name="EditarCamisa"
          component={EditarCamisa}
          options={{ title: 'Corrigir' }}
        />
        <Stack.Screen
          name="ListaDesejos"
          component={TelaListaDesejos}
          options={{ title: 'Desejos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
