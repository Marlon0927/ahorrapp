import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function HomeScreen() {
    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido 🎉</Text>
            <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 20, marginBottom: 20 },
});
