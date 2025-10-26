import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Login from "./login";
import Registro from "./registro";
import Home from "./home";
import RegistrarGasto from "./registrarGasto";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

  useEffect(() => {
    console.log("Auth Firebase:", auth); // 👈 esto debe mostrar un objeto, no undefined
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // puedes poner un SplashScreen aquí

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // 🔓 Usuario autenticado → ir a Home
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }} />
            <Stack.Screen
              name="RegistrarGasto"
              component={RegistrarGasto}
              options={{ title: "Registrar gasto" }}
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
      </Stack.Navigator>


    </NavigationContainer>


  );


}
