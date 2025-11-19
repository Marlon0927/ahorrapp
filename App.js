import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Login from "./login";
import Registro from "./registro";
import Home from "./home";
import RegistrarGasto from "./registrarGasto";
import RegistrarMeta from "./registrarMeta";
import VerMetas from "./verMetas";
import VerGastos from "./verGastos";
import Perfil from "./perfil";
import Dashboard from "./components/dashboard";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Verifica si hay sesión activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00b506ff" />
      </View>
    );
  }
  return (<NavigationContainer>
    <Stack.Navigator>
      {user ? (
        // 🔓 Usuario autenticado → ir a Home
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegistrarGasto"
            component={RegistrarGasto}
            options={{ title: "Registrar gasto" }}
          />
          <Stack.Screen
            name="RegistrarMeta"
            component={RegistrarMeta}
            options={{ title: "Registrar meta" }}
          />
          <Stack.Screen
            name="VerMetas"
            component={VerMetas}
            options={{ title: "Ver metas" }}
          />
          <Stack.Screen
            name="Perfil"
            component={Perfil}
            options={{ title: "Ver perfil" }}
          />
          <Stack.Screen
            name="VerGastos"
            component={VerGastos}
            options={{ title: "Ver gastos" }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: "Dashboard" }}
          />
        </>
      ) : (
        // 🔒 No autenticado → ir a Login
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Registro"
            component={Registro}
            options={{ title: "Crear cuenta" }}
          />
        </>
      )}
    </Stack.Navigator> </NavigationContainer>
  );
}
