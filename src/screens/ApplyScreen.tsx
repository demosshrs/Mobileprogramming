import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ref, push } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { RootStackParamList } from '../navigation/Navigator';
import { JOBS } from '../data/mockData';
import { colors, spacing, radius } from '../constants/theme';
import ProgressBar from '../components/ProgressBar';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Apply'>;
  route: RouteProp<RootStackParamList, 'Apply'>;
};

export default function ApplyScreen({ navigation, route }: Props) {
  const job = JOBS.find(j => j.id === route.params.jobId) ?? JOBS[0];
  const user = auth.currentUser;
  const [phone, setPhone] = useState('');
  const [cover, setCover] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!user) { Alert.alert('Please log in first.'); return; }
    setLoading(true);
    try {
      await push(ref(db, `applications/${user.uid}`), {
        userId: user.uid, jobId: job.id, jobTitle: job.title, company: job.company,
        logoBg: job.logoBg, logoColor: job.logoColor, initials: job.initials,
        status: 'applied', statusLabel: 'Applied · pending review', statusColor: colors.warning,
        progress: 0.25, appliedAt: Date.now(),
      });
      Alert.alert('🎉 Application Sent!', `Your application to ${job.company} has been submitted.`, [
        { text: 'View Tracker', onPress: () => navigation.replace('Main') },
      ]);
    } catch { Alert.alert('Error', 'Could not submit application.'); }
    finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={S.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
          <Text style={S.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={S.headerTitle}>Apply</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={S.headerSub}>
        <Text style={S.headerJobTxt}>{job.company} · {job.title}</Text>
        <ProgressBar progress={0.5} style={{ marginTop: spacing.sm }} />
        <Text style={S.stepLabel}>Step 2 of 3 — review and submit</Text>
      </View>

      <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={S.sheet}>
          <Text style={S.sectionTitle}>Your details</Text>
          <Text style={S.label}>FULL NAME</Text>
          <View style={S.inputFixed}><Text style={S.inputFixedTxt}>{user?.displayName ?? user?.email ?? 'User'}</Text></View>
          <Text style={S.label}>EMAIL</Text>
          <View style={S.inputFixed}><Text style={S.inputFixedTxt}>{user?.email ?? ''}</Text></View>
          <Text style={S.label}>PHONE NUMBER</Text>
          <TextInput style={S.input} placeholder="+66 81 234 5678" placeholderTextColor={colors.muted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={S.label}>RESUME / CV</Text>
          <View style={S.uploadBox}>
            <Text style={S.uploadIcon}>⬆</Text>
            <Text style={S.uploadLabel}>Upload PDF or DOCX</Text>
            <Text style={S.uploadHint}>Max 5MB</Text>
          </View>

          <Text style={S.label}>COVER LETTER (OPTIONAL)</Text>
          <TextInput style={[S.input, S.textarea]} placeholder="Why are you interested in this role?" placeholderTextColor={colors.muted} value={cover} onChangeText={setCover} multiline numberOfLines={4} />

          <Text style={S.label}>LINKEDIN URL (OPTIONAL)</Text>
          <TextInput style={S.input} placeholder="linkedin.com/in/yourname" placeholderTextColor={colors.muted} value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" />

          {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: spacing.lg }} /> : (
            <TouchableOpacity style={S.btn} onPress={handleSubmit}>
              <Text style={S.btnTxt}>Submit Application</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors.background },
  header:        { backgroundColor: colors.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md },
  backBtn:       { padding: 4 },
  backArrow:     { color: '#fff', fontSize: 28, lineHeight: 30 },
  headerTitle:   { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerSub:     { backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerJobTxt:  { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  stepLabel:     { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs },
  body:          { flex: 1 },
  sheet:         { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  label:         { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 0.8, marginBottom: spacing.sm },
  input:         { backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: 11, fontSize: 14, color: colors.text, marginBottom: spacing.lg },
  inputFixed:    { backgroundColor: colors.background, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: 11, marginBottom: spacing.lg },
  inputFixedTxt: { fontSize: 14, color: colors.subtext },
  textarea:      { height: 90, textAlignVertical: 'top' },
  uploadBox:     { borderWidth: 1.5, borderColor: colors.brand100, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', backgroundColor: '#F8FDF8', marginBottom: spacing.lg },
  uploadIcon:    { fontSize: 22, marginBottom: spacing.sm },
  uploadLabel:   { fontSize: 12, color: colors.brand, fontWeight: '500' },
  uploadHint:    { fontSize: 11, color: colors.muted, marginTop: 2 },
  btn:           { backgroundColor: colors.brand, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: spacing.xs },
  btnTxt:        { color: '#fff', fontSize: 15, fontWeight: '600' },
});
