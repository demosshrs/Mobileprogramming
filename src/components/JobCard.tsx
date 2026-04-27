import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { Job } from '../types';
import Badge from './Badge';

interface Props {
  job: Job;
  onPress: () => void;
  onApply?: () => void;
  compact?: boolean;
}

export default function JobCard({ job, onPress, onApply, compact = false }: Props) {
  return (
    <TouchableOpacity style={S.card} onPress={onPress} activeOpacity={0.85}>
      <View style={S.header}>
        <View style={[S.logo, { backgroundColor: job.logoBg }]}>
          <Text style={[S.logoTxt, { color: job.logoColor }]}>{job.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={S.title} numberOfLines={1}>{job.title}</Text>
          <Text style={S.meta}>{job.company} · {job.location}</Text>
        </View>
        <Text style={S.posted}>{job.posted}</Text>
      </View>
      <View style={S.tags}>
        {job.tags.map(t => <Badge key={t} label={t} />)}
      </View>
      <View style={S.footer}>
        <Text style={S.salary}>{job.salary}</Text>
        {!compact && onApply && (
          <TouchableOpacity style={S.applyBtn} onPress={onApply}>
            <Text style={S.applyTxt}>Apply now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  card:     { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  header:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  logo:     { width: 40, height: 40, borderRadius: radius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  logoTxt:  { fontSize: 14, fontWeight: '700' },
  title:    { fontSize: 14, fontWeight: '600', color: colors.text },
  meta:     { fontSize: 12, color: colors.muted, marginTop: 1 },
  posted:   { fontSize: 11, color: colors.muted },
  tags:     { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  footer:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salary:   { fontSize: 13, fontWeight: '700', color: colors.brand },
  applyBtn: { backgroundColor: colors.brand, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  applyTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
