import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

export default function VerMetas() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // 🔹 Solo metas del usuario loggeado
        const q = query(
            collection(db, "goals"),
            where("userId", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGoals(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#00b506" />
                <Text>Cargando tus metas...</Text>
            </View>
        );
    }

    if (goals.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No hay metas registradas todavía</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Metas Guardadas</Text>
            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.goalTitle}>{item.title}</Text>
                        <Text style={styles.goalValue}>💰 ${item.value?.toLocaleString()}</Text>
                        {item.createdAt?.toDate && (
                            <Text style={styles.date}>
                                📅 {item.createdAt.toDate().toLocaleDateString()}
                            </Text>
                        )}
                    </View>
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
        borderLeftColor: "#00b506"
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    goalValue: {
        fontSize: 16,
        color: "#00b506",
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
