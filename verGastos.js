import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export default function VerGastos({ navigation }) {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const q = query(
            collection(db, "expenses"),
            where("userId", "==", auth.currentUser.uid) //usuario loggeado
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGastos(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#00b506ff" />
                <Text>Cargando tus gastos...</Text>
            </View>
        );
    }

    if (gastos.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No hay gastos registrados todavía</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos Guardados</Text>
            <FlatList
                data={gastos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.gastoTitle}>{item.title}</Text>
                        <Text style={styles.gastoValue}>💰 ${item.value?.toLocaleString()}</Text>
                        <Text style={styles.category}>📂 {item.category}</Text>
                        {item.notes ? <Text style={styles.notes}>📝 {item.notes}</Text> : null}
                        {item.createdAt?.toDate && (
                            <Text style={styles.date}>📅 {item.createdAt.toDate().toLocaleDateString()}</Text>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    card: {
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: "#00b506ff"
    },
    gastoTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    gastoValue: {
        fontSize: 16,
        color: "#00b506ff",
        marginTop: 5
    },
    category: {
        fontSize: 14,
        color: "#555",
        marginTop: 5
    },
    notes: {
        fontSize: 14,
        color: "#555",
        marginTop: 5
    },
    date: {
        fontSize: 14,
        color: "#555",
        marginTop: 5
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        color: "#999",
        fontSize: 16
    },
});
