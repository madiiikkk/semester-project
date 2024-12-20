import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>✉️</Text>
                <Text style={styles.logoText}>Messenger for Semester Project</Text>
            </View>
            
            <Text style={styles.welcomeText}>Welcome Back</Text>

            <TouchableOpacity 
                style={[styles.button, styles.signInButton]} 
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.signUpButton]} 
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.buttonTextTwo}>SIGN UP</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff5e62',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoIcon: {
        fontSize: 50,
        color: 'white',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    welcomeText: {
        fontSize: 22,
        color: 'white',
        marginBottom: 30,
    },
    button: {
        width: '80%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
    },
    signInButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
    },
    signUpButton: {
        backgroundColor: 'white',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonTextTwo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff5e62',
    },
   
});
