import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { Application } from '../types';

export default function TrackerScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const unsub = onValue(ref(db, `applications/${user.uid}`), (snap: import('firebase/database').DataSnapshot) => {
      const data: Application[] = [];
      snap.forEach((child: import('firebase/database').DataSnapshot) => {
        data.push({ id: child.key ?? undefined, ...child.val() as Application });
      });
      setApplications(data.reverse());
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const counts = {
    applied:   applications.length,
    review:    applications.filter(a => a.status === 'review').length,
    interview: applications.filter(a => a.status === 'interview').length,
  };

  return (
    <View style={S.root}>
      <View style={S.header}>
        <Text style={S.title}>My Applications</Text>
        <View style={S.countBadge}><Text style={S.countTxt}>{applications.length} active</Text></View>
      </View>

      {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} /> : (
        <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={S.sheet}>
            <View style={S.statsRow}>
              {[['Applied', counts.applied, colors.brand], ['In Review', counts.review, '#185FA5'], ['Interview', counts.interview, colors.brand]].map(([l, v, c]) => (
                <View key={String(l)} style={S.statCard}>
                  <Text style={[S.statNum, { color: c as string }]}>{v}</Text>
                  <Text style={S.statLbl}>{l}</Text>
                </View>
              ))}
            </View>

            <Text style={S.sectionTitle}>Status timeline</Text>
            {applications.length === 0 ? (
              <View style={S.empty}>
                <Text style={{ fontSize: 36, marginBottom: spacing.lg }}>📋</Text>
                <Text style={S.emptyTxt}>No applications yet</Text>
                <Text style={S.emptySub}>Apply to jobs and track your progress here</Text>
              </View>
            ) : (
              applications.map(app => (
                <View key={app.id} style={S.card}>
                  <View style={S.cardHeader}>
                    <View style={[S.logo, { backgroundColor: app.logoBg }]}>
                      <Text style={[S.logoTxt, { color: app.logoColor }]}>{app.initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.cardTitle}>{app.jobTitle}</Text>
                      <Text style={S.cardCompany}>{app.company}</Text>
                    </View>
                  </View>
                  <View style={S.progressBg}>
                    <View style={[S.progressFill, { width: `${Math.round(app.progress * 100)}%` as `${number}%` }]} />
                  </View>
                  <View style={S.statusRow}>
                    <View style={[S.dot, { backgroundColor: app.statusColor }]} />
                    <Text style={[S.statusLbl, { color: app.statusColor }]}>{app.statusLabel}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  root:         { flex: 1, backgroundColor: colors.background },
  header:       { backgroundColor: colors.brand, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.lg },
  title:        { color: '#fff', fontSize: 17, fontWeight: '700' },
  countBadge:   { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  countTxt:     { color: '#fff', fontSize: 12 },
  body:         { flex: 1 },
  sheet:        { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg, flexGrow: 1 },
  statsRow:     { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard:     { flex: 1, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  statNum:      { fontSize: 22, fontWeight: '800' },
  statLbl:      { fontSize: 11, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  card:         { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  logo:         { width: 32, height: 32, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  logoTxt:      { fontSize: 12, fontWeight: '700' },
  cardTitle:    { fontSize: 13, fontWeight: '700', color: colors.text },
  cardCompany:  { fontSize: 11, color: colors.muted, marginTop: 1 },
  progressBg:   { height: 5, borderRadius: radius.pill, backgroundColor: colors.border, marginBottom: spacing.sm },
  progressFill: { height: 5, borderRadius: radius.pill, backgroundColor: colors.brand },
  statusRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot:          { width: 7, height: 7, borderRadius: 4 },
  statusLbl:    { fontSize: 11, fontWeight: '600' },
  empty:        { alignItems: 'center', paddingTop: 40 },
  emptyTxt:     { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptySub:     { fontSize: 13, color: colors.muted, textAlign: 'center' },
});
