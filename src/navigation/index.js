import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from '../screens/Chatscreen/ChatScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OneChat from '../screens/OneChat/OneChat'
import MainTabNavigator from './MainTabNavigator';
import ContactsScreen from '../screens/ContactsScreen';
import NewGroupScreen from '../screens/NewGroupScreen';
import GroupInfoScreen from '../screens/GroupInfoScreen';
import AddContactsToGroupScreen from '../screens/AddContactsToGroupScreen';

const Stack=createNativeStackNavigator();

const Navigation = () => {
  return (
     <NavigationContainer>
      <Stack.Navigator screenOptions={headerStyle={backgroundColor:'whitesmoke'}}>
      <Stack.Screen name="Home" component={MainTabNavigator} options={{headerShown:false}} />
      <Stack.Screen name="OneChat" component={OneChat} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="NewGroup" component={NewGroupScreen} />
      <Stack.Screen name="AddContacts" component={AddContactsToGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation