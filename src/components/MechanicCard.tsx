import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { Mechanic } from '../types';

interface Props {
  mechanic: Mechanic;
  onPress: () => void;
  onBook: () => void;
}

export default function MechanicCard({ mechanic: m, onPress, onBook }: Props) {
  return (
    <TouchableOpacity style={S.card} onPress={onPress} activeOpacity={0.85}>
      <View style={S.row}>
        <View style={S.avatar}><Text style={{ fontSize: 22 }}>🔧</Text></View>
        <View style={S.info}>
          <View style={S.nameRow}>
            <Text style={S.name} numberOfLines={1}>{m.name}</Text>
            <View style={[S.badge, m.open ? S.open : S.closed]}>
              <Text style={[S.badgeTxt, { color: m.open ? colors.success : colors.danger }]}>
                {m.open ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text style={S.meta}>📍 {m.distance} · {m.area}</Text>
          <View style={S.ratingRow}>
            <Text style={S.stars}>{'⭐'.repeat(Math.floor(m.rating))}</Text>
            <Text style={S.rating}> {m.rating}</Text>
            <Text style={S.jobs}> ({m.jobs} jobs)</Text>
            {m.verified && (
              <View style={S.verified}><Text style={S.verifiedTxt}>✓ Verified</Text></View>
            )}
          </View>
        </View>
      </View>
      <View style={S.tags}>
        {m.tags.map(t => <View key={t} style={S.tag}><Text style={S.tagTxt}>{t}</Text></View>)}
      </View>
      <TouchableOpacity style={S.bookBtn} onPress={onBook}>
        <Text style={S.bookTxt}>Book Now →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  avatar: { width: 48, height: 48, backgroundColor: colors.brandLight, borderRadius: radius.icon, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.tag },
  open: { backgroundColor: colors.successBg },
  closed: { backgroundColor: colors.dangerBg },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  meta: { fontSize: 12, color: colors.subtext, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  stars: { fontSize: 11 },
  rating: { fontSize: 12, color: colors.warning, fontWeight: '600' },
  jobs: { fontSize: 12, color: colors.subtext },
  verified: { backgroundColor: colors.brandLight, borderRadius: radius.tag, paddingHorizontal: 6, paddingVertical: 1, marginLeft: spacing.sm },
  verifiedTxt: { fontSize: 10, color: colors.brandDark, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  tag: { backgroundColor: colors.brandLight, borderRadius: radius.tag, paddingHorizontal: 10, paddingVertical: 3 },
  tagTxt: { fontSize: 11, color: colors.brandDark },
  bookBtn: { backgroundColor: colors.brand, borderRadius: radius.btn, paddingVertical: 12, alignItems: 'center' },
  bookTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
