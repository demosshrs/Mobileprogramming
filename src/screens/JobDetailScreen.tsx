import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ref, push } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { RootStackParamList } from '../navigation/Navigator';
import { JOBS } from '../data/mockData';
import { colors, spacing, radius } from '../constants/theme';
import Badge from '../components/Badge';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'JobDetail'>;
  route: RouteProp<RootStackParamList, 'JobDetail'>;
};

export default function JobDetailScreen({ navigation, route }: Props) {
  const job = JOBS.find(j => j.id === route.params.jobId) ?? JOBS[0];

  async function handleSave() {
    const uid = auth.currentUser?.uid;
    if (!uid) { Alert.alert('Please log in first.'); return; }
    try {
      await push(ref(db, `savedJobs/${uid}`), { jobId: job.id, savedAt: Date.now() });
      Alert.alert('Saved!', `${job.title} added to your saved jobs.`);
    } catch { Alert.alert('Error', 'Could not save job.'); }
  }

  return (
    <View style={S.root}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Text style={S.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={S.headerTitle}>Job Detail</Text>
        <TouchableOpacity onPress={handleSave}><Text style={{ fontSize: 18 }}>🔖</Text></TouchableOpacity>
      </View>

      <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={S.sheet}>
          <View style={S.companyRow}>
            <View style={[S.logo, { backgroundColor: job.logoBg }]}>
              <Text style={[S.logoTxt, { color: job.logoColor }]}>{job.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.jobTitle}>{job.title}</Text>
              <Text style={S.jobMeta}>{job.company} · {job.location} · Posted {job.posted}</Text>
            </View>
          </View>

          <View style={S.tags}>{job.tags.map(t => <Badge key={t} label={t} />)}</View>

          <View style={S.statsRow}>
            {[['Salary', job.salary], ['Experience', '2–4 yrs'], ['Team', '50–200']].map(([l, v]) => (
              <View key={l} style={S.stat}>
                <Text style={S.statLabel}>{l}</Text>
                <Text style={S.statVal}>{v}</Text>
              </View>
            ))}
          </View>

          <Text style={S.secTitle}>About the role</Text>
          <Text style={S.body2}>{job.description}</Text>

          <Text style={S.secTitle}>Requirements</Text>
          {job.requirements.map(r => (
            <View key={r} style={S.bullet}><View style={S.dot} /><Text style={S.bulletTxt}>{r}</Text></View>
          ))}

          <Text style={S.secTitle}>Benefits</Text>
          {job.benefits.map(b => (
            <View key={b} style={S.bullet}><View style={[S.dot, { backgroundColor: colors.brand }]} /><Text style={S.bulletTxt}>{b}</Text></View>
          ))}
        </View>
      </ScrollView>

      <View style={S.stickyBar}>
        <TouchableOpacity style={S.saveBtn} onPress={handleSave}>
          <Text style={S.saveBtnTxt}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.applyBtn} onPress={() => navigation.navigate('Apply', { jobId: job.id })}>
          <Text style={S.applyBtnTxt}>Apply now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.background },
  header:     { backgroundColor: colors.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.lg },
  backBtn:    { padding: 4 },
  backArrow:  { color: '#fff', fontSize: 28, lineHeight: 30 },
  headerTitle:{ color: '#fff', fontSize: 17, fontWeight: '700' },
  body:       { flex: 1 },
  sheet:      { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  logo:       { width: 52, height: 52, borderRadius: radius.xl, justifyContent: 'center', alignItems: 'center' },
  logoTxt:    { fontSize: 20, fontWeight: '800' },
  jobTitle:   { fontSize: 17, fontWeight: '700', color: colors.text },
  jobMeta:    { fontSize: 12, color: colors.muted, marginTop: 2 },
  tags:       { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  statsRow:   { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  stat:       { flex: 1, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  statLabel:  { fontSize: 11, color: colors.muted },
  statVal:    { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 },
  secTitle:   { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.xs },
  body2:      { fontSize: 13, color: colors.subtext, lineHeight: 20, marginBottom: spacing.lg },
  bullet:     { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  dot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.muted, marginTop: 5, flexShrink: 0 },
  bulletTxt:  { fontSize: 12, color: colors.subtext, flex: 1, lineHeight: 18 },
  stickyBar:  { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  saveBtn:    { flex: 0.4, borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.lg, paddingVertical: 13, alignItems: 'center' },
  saveBtnTxt: { color: colors.brand, fontSize: 14, fontWeight: '600' },
  applyBtn:   { flex: 1, backgroundColor: colors.brand, borderRadius: radius.lg, paddingVertical: 13, alignItems: 'center' },
  applyBtnTxt:{ color: '#fff', fontSize: 14, fontWeight: '600' },
});
