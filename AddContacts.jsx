import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, View, TextInput, Button, StyleSheet, Text, FlatList, Keyboard, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const AddContacts = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [contacts, setContacts] = useState([]);
    const [email, setEmail] = useState("");
    const [currentUserPhoneNumber, setCurrentUserPhoneNumber] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserEmailAndPhone = async () => {
            try {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setEmail(userDoc.data().email);
                    setCurrentUserPhoneNumber(userDoc.data().phoneNumber);
                    setContacts(userDoc.data().contacts || {});
                }
            } catch (err) {
                console.error("Ошибка при получении email и номера телефона:", err);
            }
        };

        fetchUserEmailAndPhone();
    }, []);

    const handleAddContact = async () => {
        if (phoneNumber.trim() === "") {
            setError("Номер телефона не может быть пустым");
            return;
        }
    
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where("phoneNumber", "==", phoneNumber.trim()));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const existingUser = querySnapshot.docs[0].data();
                const existingEmail = existingUser.email;
                const existingUserId = querySnapshot.docs[0].id;
    
                const userRef = doc(db, 'users', auth.currentUser.uid);
    
                const newContacts = {
                    ...contacts,
                    [existingUserId]: {
                        phoneNumber: phoneNumber.trim(),
                        email: existingEmail,
                        userId: existingUserId,
                    }
                };
    
                await updateDoc(userRef, { contacts: newContacts });
    
                const chatId = [auth.currentUser.uid, existingUserId].sort().join("_");
                const chatData = {
                    users: [auth.currentUser.uid, existingUserId],
                    messages: [],
                    createdAt: new Date(),
                };

                await updateDoc(userRef, {
                    chats: {
                        [chatId]: chatData
                    }
                });

                const otherUserRef = doc(db, 'users', existingUserId);
                const otherUserDoc = await getDoc(otherUserRef);
                const otherUserContacts = otherUserDoc.data().contacts || {};

                const updatedOtherUserContacts = {
                    ...otherUserContacts,
                    [auth.currentUser.uid]: {
                        phoneNumber: currentUserPhoneNumber,
                        email: email,
                        userId: auth.currentUser.uid,
                    }
                };
    
                await updateDoc(otherUserRef, {
                    contacts: updatedOtherUserContacts,
                });
    
                setContacts(newContacts);
                setPhoneNumber("");
                setError("");
            } else {
                setError("Контакт с таким номером не найден");
            }
        } catch (err) {
            console.error("Ошибка при добавлении контакта:", err);
            setError("Произошла ошибка при добавлении контакта");
        }
    };

    const handleNavigateToChat = (contact) => {
        navigation.navigate('Chat', { contact });
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Text style={styles.text}>Add Contacts</Text>
                <TextInput
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.input}
                    placeholder="Введите номер телефона контакта"
                    placeholderTextColor="white"
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity onPress={handleAddContact} style={styles.button}>
                    <Text style={styles.buttonText}>Добавить контакт</Text>
                </TouchableOpacity>

                <FlatList
                    data={Object.values(contacts)}
                    keyExtractor={(item) => item.userId ? item.userId.toString() : String(item.email)}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleNavigateToChat(item)}>
                            <View style={styles.contact}>
                                <Text style={styles.contactText}>Email: {item.email}</Text>
                                <Text style={styles.contactText}>Number: {item.phoneNumber}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.navbarButton} onPress={() => navigation.navigate('AddContacts')}>
                        <Text style={styles.navText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navbarButton} onPress={() => navigation.navigate('Messages')}>
                        <Text style={styles.navText}>Messages</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navbarButton} onPress={() => navigation.navigate('Profile')}>
                        <Text style={styles.navText}>Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ff5e62',
    },
    text: {
        color: 'white',
        fontSize: 36,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        padding: 10,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 10,
        width: '100%',
        color: 'white',
        backgroundColor: '#333',
        fontSize: 18,
    },
    error: {
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#ff5e62',
        fontSize: 18,
    },
    contact: {
        padding: 15,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 25,
        marginTop: 10,
        backgroundColor: "#222",
        marginBottom: 10,
    },
    contactText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 5,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    navbarButton: {
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#ff5e62',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    navText: {
        color: 'white',
        fontSize: 18,
    },
});

export default AddContacts;
