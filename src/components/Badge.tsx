import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MAP: Record<string, { bg: string; color: string }> = {
  remote:     { bg: '#E8F5EE', color: '#0F6E56' },
  internship: { bg: '#FFF0E8', color: '#993C1D' },
  fulltime:   { bg: '#F0F0F0', color: '#555555' },
  parttime:   { bg: '#F0F0F0', color: '#555555' },
  hybrid:     { bg: '#F5F0FF', color: '#534AB7' },
  new:        { bg: '#E8EFFE', color: '#185FA5' },
  urgent:     { bg: '#FCEBEB', color: '#A32D2D' },
  skill:      { bg: '#F0F0F0', color: '#333333' },
};

const TAG_TYPE: Record<string, string> = {
  Remote: 'remote', Internship: 'internship', 'Full-time': 'fulltime',
  'Part-time': 'parttime', Hybrid: 'hybrid', New: 'new', Urgent: 'urgent',
};

export default function Badge({ label, type }: { label: string; type?: string }) {
  const key = type ?? TAG_TYPE[label] ?? 'skill';
  const s = MAP[key] ?? MAP.skill;
  return (
    <View style={[S.base, { backgroundColor: s.bg }]}>
      <Text style={[S.txt, { color: s.color }]}>{label}</Text>
    </View>
  );
}

const S = StyleSheet.create({
  base: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, marginRight: 5, marginBottom: 4 },
  txt:  { fontSize: 11, fontWeight: '600' },
});
