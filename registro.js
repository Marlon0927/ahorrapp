import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa correo y contraseña");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            if (error.code === "auth/user-not-found") Alert.alert("Usuario no encontrado");
            else if (error.code === "auth/wrong-password") Alert.alert("Contraseña incorrecta");
            else Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("./assets/logo.jpg")} style={styles.logo} />
            </View>

            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Ingresar"
                onPress={handleLogin}
                color="#00b506ff"
            />

             <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                    <Text style={styles.link}> ¿Olvidaste la contraseña?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text>¿No tienes cuenta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
                    <Text style={styles.link}> Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        //alignItems: "center",
        padding: 30,
        backgroundColor: "#ffffffff"
    },
     title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    },
     footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },
    link: {
        color: "blue",
        fontWeight: "bold",
        color: "#00b506ff"
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
