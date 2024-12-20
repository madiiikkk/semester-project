import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../firebase'; // Подключаем Firestore
import { doc, setDoc } from 'firebase/firestore'; // Импортируем методы для работы с Firestore

const Profile = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [number, setNumber] = useState(''); 
  const [birthDate, setBirthDate] = useState(''); 

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };

  const handleSaveProfile = async () => {
    if (firstName.trim() === '' || lastName.trim() === '' || number.trim() === '' || birthDate.trim() === '') {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid); // Получаем ссылку на документ пользователя
      await setDoc(userRef, {
        firstName: firstName, // Сохраняем имя
        lastName: lastName,   // Сохраняем фамилию
        phoneNumber: number,  // Сохраняем номер телефона
        birthDate: birthDate, // Сохраняем дату рождения
        email: auth.currentUser.email, // Сохраняем email
      }, { merge: true }); // Используем merge: true, чтобы не перезаписать другие данные пользователя

      alert('Данные профиля успешно сохранены!');
    } catch (error) {
      alert('Ошибка при сохранении данных: ' + error.message);
    }
  };

  // Функция для скрытия клавиатуры
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.currentUser}>{auth.currentUser?.email}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Введите имя"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#aaa"
              returnKeyType="done"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Введите фамилию"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#aaa"
              returnKeyType="done"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Введите номер телефона"
              keyboardType="numeric"
              value={number}
              onChangeText={setNumber}
              placeholderTextColor="#aaa"
              returnKeyType="done"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Введите дату рождения (ДД.ММ.ГГГГ)"
              value={birthDate}
              onChangeText={setBirthDate}
              placeholderTextColor="#aaa"
              returnKeyType="done"
            />
            
            <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Сохранить данные</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
            <Text style={styles.signoutText}>Выйти</Text>
          </TouchableOpacity>
        </View>

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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff5e62', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  profileContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: 'white',
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 2,
    marginBottom: 20,
    width: '90%',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  currentUser: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5e62',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    color: '#333', 
    backgroundColor: '#f2f2f2', 
    borderRadius: 25,
    padding: 15,
    marginTop: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#ff5e62',
    padding: 15,
    borderRadius: 25,
    marginTop: 15,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  signOut: {
    backgroundColor: '#ff5e62',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
  },
  signoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
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
