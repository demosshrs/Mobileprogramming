import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { mockMechanics, HOME_SERVICES } from '../data/mockData';
import MechanicCard from '../components/MechanicCard';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';
import { auth } from '../firebase/config';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    StackNavigationProp<RootStackParamList>
  >;
};

export default function HomeScreen({ navigation }: Props) {
  const user = auth.currentUser;
  const firstName = user?.displayName?.split(' ')[0] ?? 'Ramesh';

  return (
    <View style={S.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={S.header}>
          <View>
            <Text style={S.location}>📍 Baneshwor, Kathmandu</Text>
            <Text style={S.greeting}>Hello, {firstName} 👋</Text>
          </View>
          <View style={S.avatar}><Text style={S.avatarTxt}>{firstName[0]}</Text></View>
        </View>

        <TouchableOpacity style={S.searchBar}>
          <Text style={{ fontSize: 16, marginRight: spacing.sm }}>🔍</Text>
          <Text style={S.searchTxt}>Search mechanics or services...</Text>
        </TouchableOpacity>

        <View style={S.sosBanner}>
          <View>
            <Text style={S.sosTitle}>🚨 Breakdown on highway?</Text>
            <Text style={S.sosSub}>Tap SOS → alert nearest mechanic</Text>
          </View>
          <TouchableOpacity style={S.sosBtn}><Text style={S.sosBtnTxt}>SOS</Text></TouchableOpacity>
        </View>

        <Text style={S.sectionLabel}>OUR SERVICES</Text>
        <View style={S.servicesGrid}>
          {HOME_SERVICES.map((sv, i) => (
            <TouchableOpacity key={i} style={S.serviceItem}>
              <View style={S.serviceIcon}><Text style={{ fontSize: 24 }}>{sv.icon}</Text></View>
              <Text style={S.serviceLabel}>{sv.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={S.sectionLabel}>NEARBY MECHANICS</Text>
        <View style={S.list}>
          {mockMechanics.map(m => (
            <MechanicCard
              key={m.id}
              mechanic={m}
              onPress={() => navigation.navigate('MechanicProfile', { mechanicId: m.id })}
              onBook={() => navigation.navigate('BookService', { mechanicId: m.id })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.brand, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.lg },
  location: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff' },
  avatar: { width: 40, height: 40, borderRadius: radius.avatar, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 16, color: '#fff', fontWeight: '700' },
  searchBar: { backgroundColor: '#fff', borderRadius: 10, padding: spacing.md, flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg, marginVertical: spacing.md },
  searchTxt: { fontSize: 14, color: colors.subtext },
  sosBanner: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.brand, borderRadius: radius.card, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sosTitle: { fontSize: 13, fontWeight: '700', color: colors.brand },
  sosSub: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  sosBtn: { backgroundColor: colors.danger, borderRadius: radius.btn, paddingHorizontal: spacing.md, paddingVertical: 7 },
  sosBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 1, marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.md },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md },
  serviceItem: { width: '33.33%', alignItems: 'center', marginBottom: spacing.lg },
  serviceIcon: { width: 54, height: 54, backgroundColor: colors.brandLight, borderRadius: radius.icon, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  serviceLabel: { fontSize: 11, color: colors.text, textAlign: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});
