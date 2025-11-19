import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, Image } from "react-native";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Perfil({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("No hay usuario loggeado");
            navigation.navigate("Login");
            return;
        }

        const fetchUser = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    // fallback si no hay datos en Firestore
                    setUserData({ name: user.displayName, email: user.email, uid: user.uid });
                }
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los datos del usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSignOut = () => {
        auth.signOut().then(() => {
            navigation.navigate("Login");
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#00b506ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("./assets/logo.jpg")} style={styles.logo} />
            </View>

            <Text style={styles.title}>Perfil</Text>

            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{userData.name}</Text>

            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{userData.email}</Text>

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
    label: {
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
    },
});
