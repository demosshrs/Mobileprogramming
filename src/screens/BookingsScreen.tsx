import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { Booking } from '../types';

const TABS = ['all', 'upcoming', 'completed', 'cancelled'] as const;
type TabT = typeof TABS[number];

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  upcoming:  { label: 'Upcoming',  color: colors.warning, bg: colors.warningBg },
  completed: { label: 'Completed', color: colors.success, bg: colors.successBg },
  cancelled: { label: 'Cancelled', color: colors.danger,  bg: colors.dangerBg  },
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabT>('all');
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(ref(db, 'bookings'), orderByChild('userId'), equalTo(user.uid));
    const unsub = onValue(q, (snap: import('firebase/database').DataSnapshot) => {
      const data: Booking[] = [];
      snap.forEach((child: import('firebase/database').DataSnapshot) => {
        data.push({ id: child.key ?? undefined, ...child.val() as Booking });
      });
      setBookings(data.reverse());
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  return (
    <View style={S.container}>
      <View style={S.header}><Text style={S.title}>My Bookings</Text></View>
      <View style={S.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[S.tab, tab === t && S.tabActive]}>
            <Text style={[S.tabTxt, tab === t && S.tabTxtActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={filtered}
          keyExtractor={b => b.id ?? String(b.createdAt)}
          contentContainerStyle={S.list}
          renderItem={({ item: b }) => {
            const sc = STATUS[b.status];
            return (
              <View style={S.card}>
                <View style={S.cardHeader}>
                  <Text style={S.mName}>{b.mechanicName}</Text>
                  <View style={[S.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[S.badgeTxt, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                </View>
                <Text style={S.meta}>🔧 {b.service}</Text>
                <Text style={S.meta}>📅 {b.date} · {b.time}</Text>
                <View style={S.priceRow}>
                  <Text style={S.totalLabel}>Total</Text>
                  <Text style={S.totalVal}>Rs. {b.total}</Text>
                </View>
                <View style={S.div} />
                <View style={S.actions}>
                  {b.status === 'upcoming' && (
                    <TouchableOpacity style={S.btnPrimary}><Text style={S.btnPrimaryTxt}>Track →</Text></TouchableOpacity>
                  )}
                  {b.status === 'completed' && (
                    <TouchableOpacity style={S.btnPrimary}><Text style={S.btnPrimaryTxt}>⭐ Rate & Rebook</Text></TouchableOpacity>
                  )}
                  {b.status === 'cancelled' && (
                    <TouchableOpacity style={S.btnSecondary}><Text style={S.btnSecondaryTxt}>Rebook</Text></TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={S.empty}>
              <Text style={{ fontSize: 36, marginBottom: spacing.md }}>📋</Text>
              <Text style={{ fontSize: 14, color: colors.subtext }}>No {tab} bookings yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.card, paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.brand },
  tabTxt: { fontSize: 12, color: colors.subtext },
  tabTxtActive: { color: colors.brand, fontWeight: '700' },
  list: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  mName: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.tag },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.subtext, marginBottom: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  totalLabel: { fontSize: 13, color: colors.subtext },
  totalVal: { fontSize: 14, fontWeight: '700', color: colors.brand },
  div: { height: 0.5, backgroundColor: colors.background, marginVertical: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  btnPrimary: { flex: 1, backgroundColor: colors.brand, borderRadius: radius.btn, paddingVertical: spacing.sm, alignItems: 'center' },
  btnPrimaryTxt: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnSecondary: { flex: 1, borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.btn, paddingVertical: spacing.sm, alignItems: 'center' },
  btnSecondaryTxt: { color: colors.brand, fontWeight: '600', fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 60 },
});
