import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { colors } from '../constants/theme';

import OnboardScreen  from '../screens/OnboardScreen';
import LoginScreen    from '../screens/LoginScreen';
import HomeScreen     from '../screens/HomeScreen';
import ExploreScreen  from '../screens/ExploreScreen';
import SavedScreen    from '../screens/SavedScreen';
import TrackerScreen  from '../screens/TrackerScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ApplyScreen    from '../screens/ApplyScreen';

export type RootStackParamList = {
  Onboard:   undefined;
  Login:     undefined;
  Main:      undefined;
  JobDetail: { jobId: string };
  Apply:     { jobId: string };
};

export type TabParamList = {
  Home:    undefined;
  Explore: undefined;
  Saved:   undefined;
  Tracker: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, string> = {
  Home:    '🏠', Explore: '🔍', Saved: '🔖', Tracker: '📋', Profile: '👤',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { borderTopColor: '#EEEEEE', height: 60, paddingBottom: 8 },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Text style={{ fontSize: size - 4, color }}>{TAB_ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Saved"   component={SavedScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboard">
        <Stack.Screen name="Onboard"   component={OnboardScreen} />
        <Stack.Screen name="Login"     component={LoginScreen} />
        <Stack.Screen name="Main"      component={TabNavigator} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
        <Stack.Screen name="Apply"     component={ApplyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
