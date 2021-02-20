import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import FastScreen from './FastScreen';
import TrashScreen from './TrashScreen';
import WifiScreen from './WifiScreen';
import NotificationsScreen from './NotificationsScreen';

const Tab = createMaterialTopTabNavigator();

const App = () => {
  return (
    <View
      style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <StatusBar />
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            showIcon: true,
            showLabel: false,
            iconStyle: { width: 40, alignItems: 'center' },
          }}
          initialRouteName="Home"
        >
          <Tab.Screen
            name="WiFi"
            component={WifiScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome5 name="wifi" size={24} color={color} />,
              tabBarAccessibilityLabel: 'WiFi',
            }}
          />
          <Tab.Screen
            name="Trash"
            component={TrashScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome5 name="trash" size={24} color={color} />,
              tabBarAccessibilityLabel: 'Trash',
            }}
          />
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
              tabBarAccessibilityLabel: 'Home',
            }}
          />
          <Tab.Screen
            name="Fasting"
            component={FastScreen}
            options={{
              tabBarIcon: ({ color }) => <MaterialIcons name="no-meals" size={24} color={color} />,
              tabBarAccessibilityLabel: 'Fasting',
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome5 name="bell" size={24} color={color} />,
              tabBarAccessibilityLabel: 'Notifications',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
