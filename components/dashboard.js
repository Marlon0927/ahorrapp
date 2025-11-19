import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';


const CATEGORY_MAP = {
    food: { color: '#FFC107', label: 'Alimentación', icon: '🍽️' },
    housing: { color: '#FFA000', label: 'Vivienda', icon: '🏠' },
    transportation: { color: '#E91E63', label: 'Transporte', icon: '🚍' },
    services: { color: '#FF7043', label: 'Servicios', icon: '💡' },
    others: { color: '#888888', label: 'Otros', icon: '📦' },
};

const DEFAULT_COLOR = '#9E9E9E';
const DEFAULT_ICON = '❓';


const getColor = (category) => CATEGORY_MAP[category]?.color || DEFAULT_COLOR;
const getLabel = (category) => CATEGORY_MAP[category]?.label || category;
const getIcon = (category) => CATEGORY_MAP[category]?.icon || DEFAULT_ICON;



export default function Dashboard({ onLogout, onAddExpense, onAddGoal, verMetas, perfil, verGastos }) {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);


    const totalGastos = useMemo(() => {
        return gastos.reduce((sum, g) => sum + Number(g.value || 0), 0);
    }, [gastos]);


    const { pieData, categories } = useMemo(() => {

        const grouped = gastos.reduce((acc, gasto) => {
            const val = Number(gasto.value || 0);
            if (!acc[gasto.category]) acc[gasto.category] = 0;
            acc[gasto.category] += val;
            return acc;
        }, {});

        const total = totalGastos;

        const pieArray = Object.keys(grouped)
            .filter((key) => grouped[key] > 0)
            .map((key) => ({
                value: grouped[key],
                color: getColor(key),
                text: `${Math.round((grouped[key] / total) * 100)}%`,
            }));

        const catArray = Object.keys(grouped)
            .filter((key) => grouped[key] > 0)
            .map((key) => ({
                amount: `$${grouped[key].toLocaleString()}`,
                label: getLabel(key),
                dot: getColor(key),
                icon: getIcon(key),
            }));

        return { pieData: pieArray, categories: catArray };
    }, [gastos, totalGastos]);

    const toggleMenu = () => setVisible(!visible);

    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);

        const q = query(collection(db, 'expenses'), where('userId', '==', auth.currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setGastos(data);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener gastos:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2ECC40" />
                <Text style={{ marginTop: 10 }}>Cargando tus gastos...</Text>
            </View>
        );
    }
    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Inicio</Text>
                    <TouchableOpacity style={styles.dropBtn} onPress={onLogout}>
                        <Text style={styles.dropText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

                {/* Gráfico de Pastel */}
                <View style={styles.chartCard}>
                    <PieChart
                        data={pieData}
                        donut
                        showText
                        textColor="black"
                        focusOnPress
                        radius={110}
                        innerRadius={70}
                        tilt={0.05}
                        sectionAutoFocus
                        strokeColor="#F5F5F5"
                        strokeWidth={8}
                        centerLabelComponent={() => (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: '#9E9E9E' }}>Gasto</Text>
                                <Text style={{ fontSize: 20, fontWeight: '700' }}>${totalGastos.toLocaleString()}</Text>
                            </View>
                        )}
                    />
                </View>

                {/* Tarjetas de Categorías */}
                <View style={styles.grid}>
                    {categories.map((c, idx) => (
                        <View key={idx} style={styles.card}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Text style={styles.amount}>{c.amount}</Text>
                            </View>
                            <View style={styles.subtitleRow}>
                                <Text style={styles.icon}>{c.icon}</Text>
                                <Text style={styles.subtitle}>{c.label}</Text>
                                <View style={[styles.dot, { backgroundColor: c.dot }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Tabbar y Menú Desplegable */}
            <View style={styles.tabbar}>
                {/* Registrar Gasto */}
                <TouchableOpacity style={styles.tabItem} onPress={onAddExpense}>
                    <Text style={styles.tabIcon}>✅</Text>
                    <Text style={styles.tabText}>Registrar gasto</Text>
                </TouchableOpacity>

                {/* Home Activo */}
                <View style={[styles.tabItem, styles.tabActive]}>
                    <Text style={styles.tabIcon}>⚪</Text>
                    <Text style={[styles.tabText, styles.tabTextActive]}>Home</Text>
                </View>

                {/* Botón de Menú */}
                <TouchableOpacity style={styles.tabItem} onPress={toggleMenu}>
                    <Text style={styles.tabIcon}>☰</Text>
                    <Text style={styles.tabText}>Menu</Text>
                </TouchableOpacity>

                {/* Menú Desplegable */}
                {visible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity style={styles.dropdownItem} onPress={perfil}>
                            <Text>Perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={onAddGoal}>
                            <Text>Registar Meta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={verMetas}>
                            <Text>Lista de metas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={verGastos}>
                            <Text>Lista de gastos</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 100
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA'
    },


    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    title: {
        fontSize: 32,
        color: '#2ECC40',
        fontWeight: '700'
    },
    dropBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },
    dropText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#616161'
    },


    chartCard: {
        backgroundColor: '#EEEEEE',
        borderRadius: 14,
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 16
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    card: {
        width: '48.2%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 10,
    },
    amount: {
        fontSize: 18,
        fontWeight: '700'
    },
    subtitleRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        fontSize: 16,
        marginRight: 8
    },
    subtitle: {
        color: '#616161',
        flex: 1
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7
    },

    // Tabbar
    tabbar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    tabItem: {
        alignItems: 'center',
        width: '30%',
        paddingVertical: 4
    },
    tabActive: {

    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 4
    },
    tabText: {
        fontSize: 12,
        color: '#616161'
    },
    tabTextActive: {
        color: '#000000',
        fontWeight: '700'
    },


    dropdown: {
        position: 'absolute',
        bottom: 70,
        right: 18,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 5,
        zIndex: 10
    },
    dropdownItem: {
        padding: 10,
        minWidth: 150
    },
});