import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    StackNavigationProp<RootStackParamList>
  >;
};

const MENU = [
  { icon: '🔧', label: 'Service history' },
  { icon: '❤️', label: 'Saved mechanics' },
  { icon: '🔔', label: 'Notifications' },
  { icon: '🔒', label: 'Security & privacy' },
  { icon: '❓', label: 'Help & support' },
];

export default function ProfileScreen({ navigation }: Props) {
  const user = auth.currentUser;
  const name = user?.displayName ?? 'Ramesh Thapa';

  async function handleSignOut() {
    await signOut(auth);
    navigation.replace('Login');
  }

  return (
    <ScrollView style={S.container}>
      <View style={S.cover} />
      <View style={S.profileRow}>
        <View style={S.avatar}><Text style={S.avatarTxt}>{name[0].toUpperCase()}</Text></View>
        <View style={S.profileInfo}>
          <Text style={S.name}>{name}</Text>
          <Text style={S.email}>{user?.email ?? 'ramesh@email.com'}</Text>
        </View>
      </View>

      <View style={S.vehicleCard}>
        <Text style={S.vehicleLabel}>MY VEHICLE</Text>
        <Text style={S.vehicleName}>🏍️ Honda Activa 2021</Text>
        <Text style={S.vehicleMeta}>BA 1 PA 1234 · Last service: Nov 30</Text>
      </View>

      <Text style={S.secLabel}>ACCOUNT SETTINGS</Text>
      <View style={S.menuList}>
        {MENU.map((item, i) => (
          <TouchableOpacity key={i} style={[S.menuRow, i === MENU.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={S.menuIcon}>{item.icon}</Text>
            <Text style={S.menuTxt}>{item.label}</Text>
            <Text style={S.arrow}>›</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[S.menuRow, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
          <Text style={S.menuIcon}>🚪</Text>
          <Text style={[S.menuTxt, { color: colors.danger }]}>Sign out</Text>
          <Text style={S.arrow}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: { height: 80, backgroundColor: colors.brand },
  profileRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginTop: -32, marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  avatar: { width: 64, height: 64, backgroundColor: colors.card, borderRadius: radius.avatar, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.card, elevation: 2 },
  avatarTxt: { fontSize: 26, fontWeight: '700', color: colors.brand },
  profileInfo: { paddingBottom: spacing.sm },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  email: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  vehicleCard: { backgroundColor: colors.brandLight, borderRadius: radius.card, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.xl, borderWidth: 0.5, borderColor: `${colors.brand}44` },
  vehicleLabel: { fontSize: 11, fontWeight: '600', color: colors.brandDark, letterSpacing: 1, marginBottom: spacing.sm },
  vehicleName: { fontSize: 15, fontWeight: '700', color: colors.text },
  vehicleMeta: { fontSize: 12, color: colors.subtext, marginTop: 3 },
  secLabel: { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 1, marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  menuList: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.card, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.border },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.background },
  menuIcon: { fontSize: 20, marginRight: spacing.md },
  menuTxt: { flex: 1, fontSize: 14, color: colors.text },
  arrow: { color: colors.border, fontSize: 18 },
});
