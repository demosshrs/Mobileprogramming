import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';
import { colors, spacing, radius } from '../constants/theme';
import { JOBS } from '../data/mockData';
import { Job } from '../types';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Saved'>,
    StackNavigationProp<RootStackParamList>
  >;
};

export default function SavedScreen({ navigation }: Props) {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const unsub = onValue(ref(db, `savedJobs/${user.uid}`), (snap: import('firebase/database').DataSnapshot) => {
      const ids: string[] = [];
      snap.forEach((child: import('firebase/database').DataSnapshot) => {
        const val = child.val() as { jobId: string };
        if (val?.jobId) ids.push(val.jobId);
      });
      setSavedJobIds(ids);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const savedJobs: Job[] = JOBS.filter(j => savedJobIds.includes(j.id));

  return (
    <View style={S.root}>
      <View style={S.header}>
        <Text style={S.title}>Saved Jobs</Text>
        <View style={S.countBadge}><Text style={S.countTxt}>{savedJobs.length} saved</Text></View>
      </View>

      {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} /> : (
        <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={S.sheet}>
            {savedJobs.length === 0 ? (
              <View style={S.empty}>
                <Text style={{ fontSize: 36, marginBottom: spacing.lg }}>🔖</Text>
                <Text style={S.emptyTxt}>No saved jobs yet</Text>
                <Text style={S.emptySub}>Tap the bookmark icon on any job to save it here</Text>
                <TouchableOpacity style={S.exploreBtn} onPress={() => navigation.navigate('Explore')}>
                  <Text style={S.exploreBtnTxt}>Explore Jobs</Text>
                </TouchableOpacity>
              </View>
            ) : (
              savedJobs.map(job => (
                <TouchableOpacity key={job.id} style={S.item} onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}>
                  <View style={[S.logo, { backgroundColor: job.logoBg }]}>
                    <Text style={[S.logoTxt, { color: job.logoColor }]}>{job.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={S.itemTitle}>{job.title}</Text>
                    <Text style={S.itemSub}>{job.company} · {job.location}</Text>
                  </View>
                  <Text style={S.arrow}>›</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.background },
  header:      { backgroundColor: colors.brand, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.lg },
  title:       { color: '#fff', fontSize: 17, fontWeight: '700' },
  countBadge:  { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  countTxt:    { color: '#fff', fontSize: 12 },
  body:        { flex: 1 },
  sheet:       { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg, flexGrow: 1 },
  item:        { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  logo:        { width: 38, height: 38, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center' },
  logoTxt:     { fontSize: 12, fontWeight: '700' },
  itemTitle:   { fontSize: 13, fontWeight: '600', color: colors.text },
  itemSub:     { fontSize: 11, color: colors.muted, marginTop: 2 },
  arrow:       { color: colors.muted, fontSize: 18 },
  empty:       { alignItems: 'center', paddingTop: 60 },
  emptyTxt:    { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptySub:    { fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: spacing.xl },
  exploreBtn:  { backgroundColor: colors.brand, borderRadius: radius.lg, paddingVertical: 12, paddingHorizontal: spacing.xl },
  exploreBtnTxt:{ color: '#fff', fontWeight: '600', fontSize: 14 },
});
