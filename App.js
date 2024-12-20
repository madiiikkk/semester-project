import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import AddContacts from './components/screens/AddContacts';
import Messages from './components/screens/Messages';
import Chat from './components/screens/Chat';
import Welcome from './components/screens/Welcome';
import SignUp from './components/screens/SignUp';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="AddContacts" component={AddContacts} options={{ headerShown: false,  }} />
        <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false}} />
        <Stack.Screen name="Chat" component={Chat} options={{  }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
