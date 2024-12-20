import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { orderBy, collection, addDoc, onSnapshot, query, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const Chat = ({ route }) => {
    const { contact } = route.params;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const chatId = [auth.currentUser.uid, contact.userId].sort().join("_");

    useEffect(() => {
        const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(newMessages);
            
            // Обновляем статус сообщений на "прочитано" для текущего пользователя
            newMessages.forEach(message => {
                if (message.sender !== auth.currentUser.uid && (!message.readBy || !message.readBy.includes(auth.currentUser.uid))) {
                    updateDoc(doc(db, "chats", chatId, "messages", message.id), {
                        readBy: message.readBy ? [...message.readBy, auth.currentUser.uid] : [auth.currentUser.uid]
                    });
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const handleSend = async () => {
        if (message.trim()) {
            const newMessage = {
                text: message,
                sender: auth.currentUser.uid,
                timestamp: new Date(),
                email: auth.currentUser.email,
                readBy: [] // Добавляем поле readBy
            };

            await addDoc(collection(db, "chats", chatId, "messages"), newMessage);

            // Обновление последнего сообщения и добавление поля participants
            await setDoc(doc(db, "chats", chatId), { 
                lastMessage: newMessage,
                participants: [auth.currentUser.uid, contact.userId]
            }, { merge: true });

            setMessage("");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contactInfo}>
                <Text style={styles.contactText}>Email: {contact.email}</Text>
                <Text style={styles.contactText}>Phone: {contact.phoneNumber}</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={item.sender === auth.currentUser.uid ? styles.sentMessage : styles.receivedMessage}>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timestamp}>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</Text>
                        {item.sender === auth.currentUser.uid && (
                            item.readBy && item.readBy.includes(contact.userId) ? (
                                <Text style={styles.readStatus}>Прочитано</Text>
                            ) : (
                                <Text style={styles.readStatus}>Не прочитано</Text>
                            )
                        )}
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Введите сообщение..."
                />
                <Button title="Отправить" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    contactInfo: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },
    contactText: {
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingBottom: 50,
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    sentMessage: {
        padding: 10,
        margin: 10,
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
        borderRadius: 10,
        maxWidth: '80%',
    },
    receivedMessage: {
        padding: 10,
        margin: 10,
        backgroundColor: '#ececec',
        alignSelf: 'flex-start',
        borderRadius: 10,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 15,
        color: '#888',
    },
    readStatus: {
        fontSize: 12,
        color: '#888',
    },
    email: {
        fontSize: 12,
        color: '#888',
    },
});

export default Chat;
