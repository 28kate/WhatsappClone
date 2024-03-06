import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotImplementedScreen from './NotImplementedScreen';
import ChatScreen from '../screens/Chatscreen/ChatScreen';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='Chats'>
      <Tab.Screen
        name='Status'
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='logo-whatsapp' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Calls'
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='call-outline' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Camera'
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='camera-outline' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Chats'
        component={ChatScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='ios-chatbubbles-sharp'
              size={size}
              color={color}
            />
          ),
          headerRight: () => (
            <Entypo
              onPress={() => navigation.navigate('Contacts')}
              name='new-message'
              size={18}
              color={'royalblue'}
              style={{ marginRight: 15 }}
            />
          ),
        })}
      />
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
