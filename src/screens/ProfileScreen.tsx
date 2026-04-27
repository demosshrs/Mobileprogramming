import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigator';
import { colors, spacing, radius } from '../constants/theme';
import { UserProfile } from '../types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const SECTIONS = [
  { icon: '📄', label: 'My Resume', sub: 'View & update resume' },
  { icon: '📬', label: 'Applications', sub: 'Track all applications' },
  { icon: '🔔', label: 'Notifications', sub: 'Job alerts & updates' },
  { icon: '🔒', label: 'Privacy', sub: 'Account & data settings' },
  { icon: '❓', label: 'Help & Support', sub: 'FAQ and contact us' },
];

export default function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const unsub = onValue(ref(db, `users/${user.uid}`), (snap: import('firebase/database').DataSnapshot) => {
      if (snap.exists()) setProfile(snap.val() as UserProfile);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const filledFields = profile
    ? [profile.name, profile.university, profile.fieldOfStudy, profile.location, profile.salary,
       profile.skills?.length > 0].filter(Boolean).length
    : 0;
  const completeness = Math.round((filledFields / 6) * 100);

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut(auth);
          navigation.replace('Onboard');
        },
      },
    ]);
  }

  const displayName = profile?.name ?? user?.displayName ?? user?.email ?? 'User';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={S.root}>
      <View style={S.header}>
        <Text style={S.headerTitle}>My Profile</Text>
      </View>

      {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} /> : (
        <ScrollView style={S.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={S.sheet}>
            <View style={S.avatarRow}>
              <View style={S.avatar}><Text style={S.avatarTxt}>{initials}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={S.name}>{displayName}</Text>
                <Text style={S.email}>{user?.email ?? ''}</Text>
                {profile?.university ? <Text style={S.uni}>{profile.university}</Text> : null}
              </View>
              <TouchableOpacity style={S.editBtn}>
                <Text style={S.editBtnTxt}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={S.completenessCard}>
              <View style={S.completenessTop}>
                <Text style={S.completenessLbl}>Profile completeness</Text>
                <Text style={S.completenessPct}>{completeness}%</Text>
              </View>
              <View style={S.progressBg}>
                <View style={[S.progressFill, { width: `${completeness}%` as `${number}%` }]} />
              </View>
              {completeness < 100 && (
                <Text style={S.completenessHint}>Complete your profile to get better job matches</Text>
              )}
            </View>

            {profile?.skills && profile.skills.length > 0 && (
              <>
                <Text style={S.sectionTitle}>Skills</Text>
                <View style={S.skillsRow}>
                  {profile.skills.map(s => (
                    <View key={s} style={S.skillTag}><Text style={S.skillTagTxt}>{s}</Text></View>
                  ))}
                </View>
              </>
            )}

            <Text style={S.sectionTitle}>Job Preferences</Text>
            <View style={S.prefRow}>
              {[
                { icon: '💼', label: 'Job Type', val: profile?.jobType ?? 'Not set' },
                { icon: '📍', label: 'Location', val: profile?.location ?? 'Not set' },
                { icon: '💰', label: 'Salary', val: profile?.salary ?? 'Not set' },
              ].map(({ icon, label, val }) => (
                <View key={label} style={S.prefCard}>
                  <Text style={S.prefIcon}>{icon}</Text>
                  <Text style={S.prefLbl}>{label}</Text>
                  <Text style={S.prefVal}>{val}</Text>
                </View>
              ))}
            </View>

            <Text style={S.sectionTitle}>Account</Text>
            {SECTIONS.map(({ icon, label, sub }) => (
              <TouchableOpacity key={label} style={S.menuItem}>
                <View style={S.menuIcon}><Text style={{ fontSize: 18 }}>{icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={S.menuLabel}>{label}</Text>
                  <Text style={S.menuSub}>{sub}</Text>
                </View>
                <Text style={S.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={S.signOutBtn} onPress={handleSignOut}>
              <Text style={S.signOutTxt}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  root:             { flex: 1, backgroundColor: colors.background },
  header:           { backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.lg },
  headerTitle:      { color: '#fff', fontSize: 17, fontWeight: '700' },
  body:             { flex: 1 },
  sheet:            { backgroundColor: colors.card, borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -8, padding: spacing.lg, flexGrow: 1 },
  avatarRow:        { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  avatar:           { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.brand, justifyContent: 'center', alignItems: 'center' },
  avatarTxt:        { color: '#fff', fontSize: 22, fontWeight: '800' },
  name:             { fontSize: 16, fontWeight: '700', color: colors.text },
  email:            { fontSize: 12, color: colors.muted, marginTop: 2 },
  uni:              { fontSize: 11, color: colors.subtext, marginTop: 2 },
  editBtn:          { borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 6 },
  editBtnTxt:       { color: colors.brand, fontSize: 12, fontWeight: '600' },
  completenessCard: { backgroundColor: colors.brandLight, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  completenessTop:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  completenessLbl:  { fontSize: 13, fontWeight: '600', color: colors.brandDark },
  completenessPct:  { fontSize: 13, fontWeight: '700', color: colors.brand },
  progressBg:       { height: 6, borderRadius: radius.pill, backgroundColor: colors.brand100, marginBottom: spacing.sm },
  progressFill:     { height: 6, borderRadius: radius.pill, backgroundColor: colors.brand },
  completenessHint: { fontSize: 11, color: colors.brandDark },
  sectionTitle:     { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.xs },
  skillsRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  skillTag:         { backgroundColor: colors.brandLight, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  skillTagTxt:      { fontSize: 12, color: colors.brandDark, fontWeight: '500' },
  prefRow:          { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  prefCard:         { flex: 1, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.sm, alignItems: 'center' },
  prefIcon:         { fontSize: 18, marginBottom: 4 },
  prefLbl:          { fontSize: 10, color: colors.muted },
  prefVal:          { fontSize: 11, fontWeight: '600', color: colors.text, marginTop: 2, textAlign: 'center' },
  menuItem:         { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon:         { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  menuLabel:        { fontSize: 14, fontWeight: '600', color: colors.text },
  menuSub:          { fontSize: 11, color: colors.muted, marginTop: 1 },
  menuArrow:        { color: colors.muted, fontSize: 18 },
  signOutBtn:       { marginTop: spacing.xl, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, paddingVertical: 13, alignItems: 'center' },
  signOutTxt:       { color: colors.danger, fontSize: 14, fontWeight: '600' },
});
