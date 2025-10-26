import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Image } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async () => {
        if (!email || !password || !name) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        try {
            // 1️⃣ Crear usuario con email y contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2️⃣ Agregar nombre al perfil
            await updateProfile(user, { displayName: name });

            Alert.alert("Registro exitoso", `Bienvenido, ${name}!`);
            navigation.navigate("Login"); // o a tu pantalla principal
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("./assets/logo.jpg")} style={styles.logo} />
            </View>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.subtitle}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Text style={styles.subtitle}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Registrarme" onPress={handleRegister} color="#00b506ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#ffffffff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: "center",      // centra horizontalmente
        justifyContent: "center",  // centra verticalmente
        marginTop: 40,
    },
    logo: {
        width: 150,
        height: 150
    },
});
