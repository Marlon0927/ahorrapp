import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Dashboard from "./components/dashboard";

export default function HomeScreen() {
    const handleLogout = async () => {
        await signOut(auth);
    };
    const navigation = useNavigation();

    return (
        <Dashboard
            onLogout={handleLogout}
            onAddExpense={() => navigation.navigate("RegistrarGasto")}
            onAddGoal={() => navigation.navigate("RegistrarMeta")}
            verMetas={() => navigation.navigate("VerMetas")}
            verGastos={() => navigation.navigate("VerGastos")}
            perfil={() => navigation.navigate("Perfil")}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 20,
        marginBottom: 20
    },
});