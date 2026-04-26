import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import MechanicProfileScreen from '../screens/MechanicProfileScreen';
import BookServiceScreen from '../screens/BookServiceScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  MechanicProfile: { mechanicId: string };
  BookService: { mechanicId: string };
};

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabIcon({ label }: { label: string }) {
  const icons: Record<string, string> = { Home: '🏠', Bookings: '📋', Profile: '👤' };
  return <Text style={{ fontSize: 20 }}>{icons[label] ?? '●'}</Text>;
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: () => <TabIcon label={route.name} />,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="MechanicProfile" component={MechanicProfileScreen} />
        <Stack.Screen name="BookService" component={BookServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
