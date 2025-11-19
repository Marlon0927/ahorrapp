import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export default function RegisterBillsScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegister = async () => {
        if (!title || !value ) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "Debes iniciar sesión para registrar un gasto");
                return;
            }

            const expense = {
                userId: user.uid,
                title: title,
                value: parseFloat(value),
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "goals"), expense);

            setSuccessMessage("✅ Meta guardada correctamente");

            setTitle("");
            setValue("");

            setTimeout(() => {
                setSuccessMessage("");
                navigation.goBack();
            }, 3000);

        } catch (error) {
            console.error("🔥 Error al guardar en Firestore:", error);
            Alert.alert("Error", error.message);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Meta</Text>

            <Text style={styles.label}>Titulo</Text>
            <TextInput
                style={styles.input}
                placeholder="Ejemplo: Viaje Amazonas"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
                style={styles.input}
                placeholder="$ valor"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
            />

            {successMessage ? (
                <Text style={styles.successMessage}>{successMessage}</Text>
            ) : null}
            <Button title="Guardar Meta" onPress={handleRegister} color="#00b506ff" />
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
    successMessage: {
        color: "green",
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
        fontSize: 16,
    },

});
