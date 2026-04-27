import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';
import { colors, spacing, radius } from '../constants/theme';
import { JOBS, EXPLORE_CATS } from '../data/mockData';
import JobCard from '../components/JobCard';
import { Job } from '../types';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Explore'>,
    StackNavigationProp<RootStackParamList>
  >;
};

function filterJobs(jobs: Job[], query: string, cat: number): Job[] {
  let list = jobs;
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));
  }
  const catMap: Record<number, string> = { 1: 'Tech', 2: 'Design', 3: 'Marketing', 4: 'Finance', 5: 'HR' };
  if (cat > 0 && catMap[cat]) {
    const c = catMap[cat].toLowerCase();
    list = list.filter(j => j.tags.some(t => t.toLowerCase().includes(c)) || j.title.toLowerCase().includes(c));
  }
  return list;
}

export default function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(0);
  const results = filterJobs(JOBS, query, activeCat);

  return (
    <View style={S.root}>
      <View style={S.header}>
        <Text style={S.title}>Explore Jobs</Text>
        <Text style={S.sub}>{JOBS.length} open positions</Text>
        <View style={S.searchBar}>
          <Text style={{ fontSize: 13, marginRight: spacing.sm }}>🔍</Text>
          <TextInput
            style={S.searchInput}
            placeholder="Search roles, skills, companies"
            placeholderTextColor="rgba(255,255,255,0.55)"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.chips}>
          {EXPLORE_CATS.map((c, i) => (
            <TouchableOpacity key={c} style={[S.chip, i === activeCat && S.chipActive]} onPress={() => setActiveCat(i)}>
              <Text style={[S.chipTxt, i === activeCat && S.chipTxtActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={S.sheet}>
          <View style={S.filterRow}>
            <Text style={S.sectionTitle}>All jobs ({results.length})</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity style={S.filterBtn}><Text style={S.filterBtnTxt}>Sort</Text></TouchableOpacity>
              <TouchableOpacity style={S.filterBtn}><Text style={S.filterBtnTxt}>Filter</Text></TouchableOpacity>
            </View>
          </View>
          {results.length === 0
            ? <Text style={S.empty}>No jobs found. Try a different search.</Text>
            : results.map(job => (
                <JobCard key={job.id} job={job} compact
                  onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
                />
              ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors.background },
  header:        { backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: 0 },
  title:         { color: '#fff', fontSize: 17, fontWeight: '700' },
  sub:           { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2, marginBottom: spacing.md },
  searchBar:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.lg },
  searchInput:   { flex: 1, fontSize: 13, color: '#fff' },
  body:          { flex: 1 },
  chips:         { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  chip:          { paddingHorizontal: 13, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1.5, borderColor: '#DDD', backgroundColor: colors.card },
  chipActive:    { backgroundColor: colors.brand, borderColor: colors.brand },
  chipTxt:       { fontSize: 12, fontWeight: '500', color: colors.subtext },
  chipTxtActive: { color: '#fff' },
  sheet:         { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg, flexGrow: 1 },
  filterRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: colors.text },
  filterBtn:     { borderWidth: 1, borderColor: colors.brand100, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  filterBtnTxt:  { fontSize: 11, color: colors.brand, fontWeight: '500' },
  empty:         { textAlign: 'center', color: colors.muted, marginTop: 40, fontSize: 14 },
});
