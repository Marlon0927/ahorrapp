import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Button } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Registro({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


const handleRegistro = async () => {
    if (!name || !email || !password) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
    }

    try {
        // 1️⃣ Crear usuario con email y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2️⃣ Actualizar perfil con nombre
        await updateProfile(user, { displayName: name });

        // 3️⃣ Guardar datos en Firestore
        const registro = {
            uid: user.uid,
            email: email,
            name: name,
            createdAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), registro);

        Alert.alert("Registro exitoso", `Bienvenido, ${ name } !`);
        navigation.navigate("Login"); // ir a login después del registro
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            Alert.alert("Error", "El correo ya está en uso");
        } else if (error.code === "auth/invalid-email") {
            Alert.alert("Error", "Correo inválido");
        } else if (error.code === "auth/weak-password") {
            Alert.alert("Error", "La contraseña es muy débil");
        } else {
            Alert.alert("Error", error.message);
        }
    }
};

return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image source={require("./assets/logo.jpg")} style={styles.logo} />
        </View>

        <Text style={styles.title}>Registro</Text>

        <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
        />

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

        <Button title="Registrarse" onPress={handleRegistro} color="#00b506ff" />

        <View style={styles.footer}>
            <Text>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}> Inicia sesión</Text>
            </TouchableOpacity>
        </View>
    </View>
);


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    link: {
        fontWeight: "bold",
        color: "#00b506ff",
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    logo: {
        width: 150,
        height: 150,
    },
});
