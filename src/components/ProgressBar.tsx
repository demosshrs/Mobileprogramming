import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props { progress: number; style?: ViewStyle; light?: boolean; }

export default function ProgressBar({ progress, style, light = false }: Props) {
  const pct = `${Math.round(Math.min(progress, 1) * 100)}%` as `${number}%`;
  return (
    <View style={[S.track, light && S.trackLight, style]}>
      <View style={[S.fill, light && S.fillLight, { width: pct }]} />
    </View>
  );
}

const S = StyleSheet.create({
  track:      { height: 6, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.3)' },
  fill:       { height: 6, borderRadius: radius.pill, backgroundColor: '#fff' },
  trackLight: { backgroundColor: colors.border },
  fillLight:  { backgroundColor: colors.brand },
});
