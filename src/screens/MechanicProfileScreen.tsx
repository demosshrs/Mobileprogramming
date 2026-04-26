import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Navigator';
import { mockMechanics } from '../data/mockData';
import { colors, spacing, radius } from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'MechanicProfile'>;
  route: RouteProp<RootStackParamList, 'MechanicProfile'>;
};

const REVIEWS = [
  { name: 'Sita B.', text: 'Very professional, fixed my bike quickly!', stars: 5, date: 'Dec 5' },
  { name: 'Anil T.', text: 'Fair price and very honest about what was needed.', stars: 5, date: 'Nov 28' },
  { name: 'Priya M.', text: 'On time and thorough. Will come again.', stars: 4, date: 'Nov 20' },
];

export default function MechanicProfileScreen({ navigation, route }: Props) {
  const m = mockMechanics.find(x => x.id === route.params.mechanicId);
  if (!m) return <Text style={{ margin: 40 }}>Mechanic not found.</Text>;

  const stats = [{ v: `${m.rating}⭐`, l: 'Rating' }, { v: m.jobs, l: 'Jobs' }, { v: m.experience, l: 'Exp.' }, { v: m.price, l: 'From' }];

  return (
    <View style={S.container}>
      <View style={S.cover}>
        <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
          <Text style={S.backIcon}>‹</Text>
        </TouchableOpacity>
        {m.verified && <View style={S.verifiedBadge}><Text style={S.verifiedTxt}>✓ Verified</Text></View>}
        <View style={S.avatarOnCover}><Text style={{ fontSize: 26 }}>🔧</Text></View>
      </View>

      <ScrollView style={S.body} showsVerticalScrollIndicator={false}>
        <View style={S.nameRow}>
          <View style={{ flex: 1 }}>
            <Text style={S.name}>{m.name}</Text>
            <Text style={S.meta}>📍 {m.distance} · {m.area}</Text>
          </View>
          <View style={[S.badge, m.open ? S.open : S.closed]}>
            <Text style={[S.badgeTxt, { color: m.open ? colors.success : colors.danger }]}>{m.open ? '✓ Open' : '✕ Closed'}</Text>
          </View>
        </View>

        <View style={S.tags}>{m.tags.map(t => <View key={t} style={S.tag}><Text style={S.tagTxt}>{t}</Text></View>)}</View>

        <View style={S.statsRow}>
          {stats.map((st, i) => (
            <View key={i} style={S.statBox}>
              <Text style={S.statVal}>{st.v}</Text>
              <Text style={S.statLabel}>{st.l}</Text>
            </View>
          ))}
        </View>

        <View style={S.actionRow}>
          <TouchableOpacity style={S.callBtn} onPress={() => Linking.openURL(`tel:${m.phone}`)}>
            <Text>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.chatBtn}><Text>💬 Chat</Text></TouchableOpacity>
        </View>

        <View style={S.divider} />
        <Text style={S.secLabel}>SERVICES & PRICING</Text>
        <View style={S.card}>
          {m.services.map((sv, i) => (
            <View key={i} style={[S.serviceRow, i < m.services.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.background }]}>
              <Text style={S.serviceName}>🔧 {sv.name}</Text>
              <Text style={S.servicePrice}>{sv.priceStr}</Text>
            </View>
          ))}
        </View>

        <Text style={S.secLabel}>CUSTOMER REVIEWS</Text>
        {REVIEWS.map((r, i) => (
          <View key={i} style={S.reviewCard}>
            <View style={S.reviewHeader}>
              <View style={S.reviewAvatar}><Text style={S.reviewInitial}>{r.name[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={S.reviewName}>{r.name}</Text>
                <Text style={{ fontSize: 11 }}>{'⭐'.repeat(r.stars)}</Text>
              </View>
              <Text style={S.reviewDate}>{r.date}</Text>
            </View>
            <Text style={S.reviewText}>"{r.text}"</Text>
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={S.cta}>
        <TouchableOpacity style={S.ctaBtn} onPress={() => navigation.navigate('BookService', { mechanicId: m.id })}>
          <Text style={S.ctaTxt}>🔧 Book This Mechanic</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  cover: { height: 100, backgroundColor: colors.brand },
  backBtn: { position: 'absolute', top: 48, left: spacing.lg, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: radius.tag, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: '#fff', fontSize: 28, lineHeight: 34 },
  verifiedBadge: { position: 'absolute', top: 12, right: spacing.lg, backgroundColor: '#fff', borderRadius: radius.tag, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedTxt: { fontSize: 11, color: colors.brandDark, fontWeight: '600' },
  avatarOnCover: { position: 'absolute', bottom: -28, left: spacing.lg, width: 56, height: 56, backgroundColor: '#fff', borderRadius: radius.icon, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', elevation: 2 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: 40 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.subtext, marginTop: 3 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.tag },
  open: { backgroundColor: colors.successBg },
  closed: { backgroundColor: colors.dangerBg },
  badgeTxt: { fontSize: 12, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  tag: { backgroundColor: colors.brandLight, borderRadius: radius.tag, paddingHorizontal: 10, paddingVertical: 3 },
  tagTxt: { fontSize: 11, color: colors.brandDark },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.background, borderRadius: radius.btn, padding: spacing.md, alignItems: 'center' },
  statVal: { fontSize: 13, fontWeight: '700', color: colors.brand },
  statLabel: { fontSize: 10, color: colors.subtext, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  callBtn: { flex: 1, paddingVertical: 12, borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.btn, alignItems: 'center' },
  chatBtn: { flex: 1, paddingVertical: 12, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.btn, alignItems: 'center' },
  divider: { height: 0.5, backgroundColor: colors.background, marginVertical: spacing.sm },
  secLabel: { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 1, marginBottom: spacing.md, marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  serviceName: { fontSize: 13, color: colors.text },
  servicePrice: { fontSize: 13, fontWeight: '700', color: colors.brand },
  reviewCard: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  reviewAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.brandLight, alignItems: 'center', justifyContent: 'center' },
  reviewInitial: { fontSize: 12, fontWeight: '700', color: colors.brandDark },
  reviewName: { fontSize: 13, fontWeight: '600', color: colors.text },
  reviewDate: { fontSize: 12, color: colors.subtext },
  reviewText: { fontSize: 13, color: colors.subtext, fontStyle: 'italic' },
  cta: { padding: spacing.md, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: colors.border },
  ctaBtn: { backgroundColor: colors.brand, borderRadius: radius.btn, paddingVertical: 14, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
