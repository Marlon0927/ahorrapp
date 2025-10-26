import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function HomeScreen() {
    const handleLogout = async () => {
        await signOut(auth);
    };
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido 🎉</Text>
            <Button title="Cerrar sesión" onPress={handleLogout} />
            <Button title="Registrar gasto" onPress={() => navigation.navigate("RegistrarGasto")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 20,
        marginBottom: 20
    },
});
