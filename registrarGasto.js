import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert, Picker } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [categoria, setCategoria] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

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
            <Text style={styles.title}>Registrar gasto</Text>
            <Text style={styles.subtitle}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.subtitle}>Valor</Text>
            <TextInput
                style={styles.input}
                placeholder="$ Valor"
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.subtitle}>Categoria</Text>
            <Picker
                selectedValue={categoria}
                style={styles.picker}
                onValueChange={(itemValue) => setCategoria(itemValue)}
            >
                <Picker.Item label="Alimentacion" value="alimentacion" />
                <Picker.Item label="Vivienda" value="vivienda" />
                <Picker.Item label="Transporte" value="transporte" />
                <Picker.Item label="Servicio" value="servicio" />
                <Picker.Item label="Otros" value="otros" />
            </Picker>
            <Text style={styles.subtitle}>Observaciones: {categoria}</Text>
            <TextInput
                style={styles.input}
                placeholder="Observaciones"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Registrar gasto" onPress={handleRegister} color="#00b506ff" />
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
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        height: 40,
        width: "100%"
    },

});
