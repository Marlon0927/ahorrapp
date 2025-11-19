//import React from "react";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import VerMetas from "../verMetas";
import VerGastos from "../verGastos";
import Perfil from "../perfil";


export default function Dashboard({ onLogout, onAddExpense, onAddGoal, verMetas, perfil, verGastos }) {
    const pieData = [
        { value: 43, color: "#FFA000", text: "43%" },
        { value: 24, color: "#1E88E5", text: "24%" },
        { value: 21, color: "#FFC107", text: "21%" },
        { value: 4, color: "#AA00FF", text: "4%" },
        { value: 3, color: "#F50057", text: "3%" },
        { value: 2, color: "#8BC34A", text: "2%" },
        { value: 1, color: "#26C6DA", text: "1%" },
        { value: 1, color: "#90CAF9", text: "1%" }
    ];

    const categories = [
        { amount: "$1,401.26", label: "Transporte", dot: "#E91E63", icon: "🚍" },
        { amount: "$9,207.23", label: "Alimentación", dot: "#FFC107", icon: "🍽️" },
        { amount: "$270.00", label: "Suscripciones", dot: "#009688", icon: "📱" },
        { amount: "$10,600.50", label: "Entretenimiento", dot: "#2196F3", icon: "🎮" },
        { amount: "$509.00", label: "Servicios", dot: "#FF7043", icon: "💡" },
        { amount: "$19,343.00", label: "Vivienda", dot: "#FFA000", icon: "🏠" }
    ];

    const [visible, setVisible] = useState(false);

    const toggleMenu = () => setVisible(!visible);

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Inicio</Text>
                    <TouchableOpacity onPress={onLogout} style={styles.dropBtn}>
                        <Text style={styles.dropText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

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
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ fontSize: 14, color: "#9E9E9E" }}>Gasto</Text>
                                <Text style={{ fontSize: 20, fontWeight: "700" }}>$41,280</Text>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.grid}>
                    {categories.map((c, idx) => (
                        <View key={idx} style={styles.card}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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

            <View style={styles.tabbar}>
                <TouchableOpacity style={styles.tabItem} onPress={onAddExpense}>
                    <Text style={styles.tabIcon}>✅</Text>
                    <Text style={styles.tabText}>Registrar gasto</Text>
                </TouchableOpacity>
                <View style={[styles.tabItem, styles.tabActive]}>
                    <Text style={styles.tabIcon}>⚪</Text>
                    <Text style={[styles.tabText, styles.tabTextActive]}>Home</Text>
                </View>


                <TouchableOpacity style={styles.tabItem} onPress={toggleMenu}>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabIcon}>☰</Text>
                        <Text style={styles.tabText}>Menu</Text>
                    </View>
                </TouchableOpacity>
                {/* Menú desplegable */}
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
                        <TouchableOpacity style={styles.dropdownItem}onPress={verGastos}>
                            <Text>Lista de gastos</Text>
                        </TouchableOpacity>
                        
                    </View>
                )}
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 100
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12
    },
    title: {
        fontSize: 32,
        color: "#2ECC40",
        fontWeight: "700"
    },
    dropBtn: {
        backgroundColor: "#E0E0E0",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10
    },
    dropText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#616161"
    },
    chartCard: {
        backgroundColor: "#EEEEEE",
        borderRadius: 14,
        alignItems: "center",
        paddingVertical: 20,
        marginBottom: 16
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between"
    },
    card: {
        width: "48.2%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    amount: {
        fontSize: 18,
        fontWeight: "700"
    },
    subtitleRow: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    icon: {
        fontSize: 16
    },
    subtitle: {
        color: "#616161",
        flex: 1
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7
    },
    tabbar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#EEEEEE",
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    tabItem: {
        alignItems: "center",
        width: "33%"
    },
    tabActive: {
    },
    tabIcon: {
        fontSize: 22,
        marginBottom: 4
    },
    tabText: {
        fontSize: 14,
        color: "#616161"
    },
    tabTextActive: {
        color: "#000000",
        fontWeight: "700"
    },
    dropdown: {
        position: "absolute",
        bottom: 50, // 👈 se ubica encima del botón
        left: 280,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        padding: 5,
        zIndex: 1,
    },
    dropdownItem: {
        padding: 10,
    }
});