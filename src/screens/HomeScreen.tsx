import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';
import { colors, spacing, radius } from '../constants/theme';
import { JOBS, COMPANIES, CATEGORIES } from '../data/mockData';
import JobCard from '../components/JobCard';
import { auth } from '../firebase/config';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    StackNavigationProp<RootStackParamList>
  >;
};

export default function HomeScreen({ navigation }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const user = auth.currentUser;
  const firstName = user?.displayName?.split(' ')[0] ?? 'Nara';

  return (
    <View style={S.root}>
      <View style={S.header}>
        <View style={{ flex: 1 }}>
          <Text style={S.greeting}>Morning, {firstName} 👋</Text>
          <Text style={S.sub}>3 new jobs match your profile</Text>
        </View>
        <View style={S.avatar}><Text style={S.avatarTxt}>{firstName[0]}</Text></View>
      </View>
      <TouchableOpacity style={S.searchBar} onPress={() => navigation.navigate('Explore')}>
        <Text style={{ fontSize: 14, marginRight: spacing.sm }}>🔍</Text>
        <Text style={S.searchTxt}>Search jobs, companies...</Text>
      </TouchableOpacity>

      <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.chips}>
          {CATEGORIES.map((c, i) => (
            <TouchableOpacity key={c} style={[S.chip, i === activeCat && S.chipActive]} onPress={() => setActiveCat(i)}>
              <Text style={[S.chipTxt, i === activeCat && S.chipTxtActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={S.sheet}>
          <View style={S.nudge}>
            <View style={{ flex: 1 }}>
              <Text style={S.nudgeTitle}>Complete your profile</Text>
              <Text style={S.nudgeSub}>60% complete · Get 5x more views</Text>
            </View>
            <TouchableOpacity style={S.nudgeBtn} onPress={() => navigation.navigate('Profile')}>
              <Text style={S.nudgeBtnTxt}>Finish</Text>
            </TouchableOpacity>
          </View>

          <Text style={S.sectionTitle}>Featured for you</Text>
          {JOBS.slice(0, 3).map(job => (
            <JobCard key={job.id} job={job}
              onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
              onApply={() => navigation.navigate('Apply', { jobId: job.id })}
            />
          ))}

          <Text style={S.sectionTitle}>Companies hiring</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {COMPANIES.map((c, i) => (
              <View key={i} style={S.companyChip}>
                <View style={[S.companyLogo, { backgroundColor: c.bg }]}>
                  <Text style={[S.companyLogoTxt, { color: c.color }]}>{c.initials}</Text>
                </View>
                <Text style={S.companyName}>{c.name}</Text>
                <Text style={S.companyJobs}>{c.jobs} jobs</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors.background },
  header:        { backgroundColor: colors.brand, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md },
  greeting:      { color: '#fff', fontSize: 17, fontWeight: '700' },
  sub:           { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  avatar:        { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  avatarTxt:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  searchBar:     { backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  searchTxt:     { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  body:          { flex: 1, backgroundColor: colors.background },
  chips:         { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  chip:          { paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1.5, borderColor: '#DDD', backgroundColor: colors.card },
  chipActive:    { backgroundColor: colors.brand, borderColor: colors.brand },
  chipTxt:       { fontSize: 12, fontWeight: '500', color: colors.subtext },
  chipTxtActive: { color: '#fff' },
  sheet:         { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg, flexGrow: 1 },
  nudge:         { backgroundColor: colors.brandDark, borderRadius: radius.xl, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  nudgeTitle:    { color: '#fff', fontSize: 13, fontWeight: '700' },
  nudgeSub:      { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  nudgeBtn:      { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 6 },
  nudgeBtnTxt:   { color: '#fff', fontSize: 11, fontWeight: '600' },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.md, marginTop: spacing.sm },
  companyChip:   { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', width: 72 },
  companyLogo:   { width: 36, height: 36, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  companyLogoTxt:{ fontSize: 13, fontWeight: '700' },
  companyName:   { fontSize: 11, color: colors.text, fontWeight: '500' },
  companyJobs:   { fontSize: 10, color: colors.muted, marginTop: 1 },
  searchBarInner:{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.lg },
});
