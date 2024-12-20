import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, onSnapshot, where, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { doc } from 'firebase/firestore'; // Добавлен импорт функции doc

const Messages = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'chats'), where('participants', 'array-contains', auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            console.log('Snapshot received:', snapshot.docs.length, 'chats found.');
            const chatPromises = snapshot.docs.map(async (chatDoc) => {
                const chatData = chatDoc.data();
                const contactId = chatData.participants.find(uid => uid !== auth.currentUser.uid);

                console.log('Contact ID:', contactId);

                if (contactId) {
                    const contactDoc = await getDoc(doc(db, 'users', contactId));
                    const contactData = contactDoc.data();
                    console.log('Contact Data:', contactData);

                    return {
                        id: chatDoc.id,
                        ...chatData,
                        email: contactData ? contactData.email : 'No Email',
                        phoneNumber: contactData ? contactData.phoneNumber : 'No Phone',
                        lastMessage: chatData.lastMessage ? chatData.lastMessage.text : '',
                        readStatus: chatData.lastMessage && chatData.lastMessage.readBy && chatData.lastMessage.readBy.includes(auth.currentUser.uid) ? 'Прочитано' : 'Не прочитано'
                    };
                }
                return null;
            });

            const chatsData = await Promise.all(chatPromises);
            console.log('Chats Data:', chatsData);
            setChats(chatsData.filter(chat => chat !== null)); // Фильтрация невалидных данных
        });

        return () => unsubscribe();
    }, []);

    const handleChatOpen = (chat) => {
        navigation.navigate('Chat', { chatId: chat.id, contact: { userId: chat.participants.find(uid => uid !== auth.currentUser.uid), email: chat.email, phoneNumber: chat.phoneNumber } });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Messages</Text>

            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatOpen(item)}>
                        <Text style={styles.chatEmail}>{item.email}</Text>
                        <Text style={styles.chatPhone}>{item.phoneNumber}</Text>
                        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
                        {item.lastMessage && item.lastMessage.sender === auth.currentUser.uid && (
                            <Text style={styles.readStatus}>{item.readStatus}</Text>
                        )}
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff5e62',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        color: 'white',
        fontSize: 36,
        marginBottom: 20,
        textAlign: 'center',
    },
    chatItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        backgroundColor: '#333',
        marginBottom: 10,
        borderRadius: 25,
    },
    chatEmail: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatPhone: {
        color: '#aaa',
        fontSize: 16,
        marginTop: 5,
    },
    chatLastMessage: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    readStatus: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
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

export default Messages;
