import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        setError('');  
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
                navigation.navigate('Profile');
            })
            .catch((error) => {
                console.log(error); 
                setError('Данные не правильны');
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.loginText}>Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#ddd"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#ddd"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Don't you have an account yet? Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff5e62',
        paddingHorizontal: 20,
    },
    loginText: {
        color: 'white',
        fontSize: 30,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 17,
        paddingBottom: 17,
        color: 'white',
        backgroundColor: 'transparent',
        borderRadius: 25,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'white',
        fontSize: 16,
    },
    buttonContainer: {
        width: '80%',
        marginTop: 20,
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#ff5e62',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: 'transparent'
    },
    buttonOutlineText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 13,
    },
    errorText: {
        color: 'white',
        marginTop: 10,
    },
});
