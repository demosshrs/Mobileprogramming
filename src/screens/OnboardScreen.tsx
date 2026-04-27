import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigator';
import { colors, spacing, radius } from '../constants/theme';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Onboard'> };

const OPTIONS = [
  { key: 'internship', title: 'Internship',           sub: 'For students & fresh grads', emoji: '⭐' },
  { key: 'fulltime',   title: 'Full-time job',         sub: 'Permanent positions',        emoji: '💼' },
  { key: 'parttime',   title: 'Part-time / Freelance', sub: 'Flexible work',              emoji: '⏰' },
];

export default function OnboardScreen({ navigation }: Props) {
  const [selected, setSelected] = useState('internship');

  return (
    <ScrollView contentContainerStyle={S.container} showsVerticalScrollIndicator={false}>
      <View style={S.logo}><Text style={{ fontSize: 32 }}>💼</Text></View>
      <Text style={S.title}>Welcome to Chaiyo</Text>
      <Text style={S.sub}>Your shortcut to internships and first jobs</Text>

      <Text style={S.question}>What are you looking for?</Text>
      {OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.key}
          style={[S.option, selected === opt.key && S.optionActive]}
          onPress={() => setSelected(opt.key)}
        >
          <View style={[S.optionIcon, selected === opt.key && S.optionIconActive]}>
            <Text style={{ fontSize: 16 }}>{opt.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.optionTitle}>{opt.title}</Text>
            <Text style={S.optionSub}>{opt.sub}</Text>
          </View>
          {selected === opt.key && (
            <View style={S.check}><Text style={{ color: '#fff', fontSize: 10 }}>✓</Text></View>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={S.btn} onPress={() => navigation.replace('Login')}>
        <Text style={S.btnTxt}>Continue</Text>
      </TouchableOpacity>

      <View style={S.dots}>
        <View style={S.dotActive} /><View style={S.dot} /><View style={S.dot} />
      </View>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  container:        { padding: spacing.xxl, paddingTop: 52, backgroundColor: '#fff', flexGrow: 1 },
  logo:             { width: 72, height: 72, borderRadius: 22, backgroundColor: colors.brand, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: spacing.xl },
  title:            { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  sub:              { fontSize: 13, color: colors.subtext, textAlign: 'center', marginBottom: spacing.xxxl },
  question:         { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  option:           { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, backgroundColor: '#fff' },
  optionActive:     { borderColor: colors.brand, backgroundColor: colors.brandLight },
  optionIcon:       { width: 38, height: 38, borderRadius: radius.md, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  optionIconActive: { backgroundColor: colors.brand },
  optionTitle:      { fontSize: 14, fontWeight: '700', color: colors.text },
  optionSub:        { fontSize: 11, color: colors.subtext, marginTop: 2 },
  check:            { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.brand, justifyContent: 'center', alignItems: 'center' },
  btn:              { backgroundColor: colors.brand, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  btnTxt:           { color: '#fff', fontSize: 15, fontWeight: '600' },
  dots:             { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  dot:              { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' },
  dotActive:        { width: 20, height: 8, borderRadius: 4, backgroundColor: colors.brand },
});
