import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigator';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) { Alert.alert('Error', 'Please fill all required fields.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await set(ref(db, `users/${cred.user.uid}`), { name, email, university, skills: [], jobType: 'Internship', location: 'Remote', salary: '฿15,000+/mo', fieldOfStudy: '' });
      } catch (dbErr: unknown) {
        Alert.alert('DB Error', dbErr instanceof Error ? dbErr.message : 'Database write failed.');
        setLoading(false); return;
      }
      navigation.replace('Main');
    } catch (e: unknown) {
      Alert.alert('Sign Up Failed', e instanceof Error ? e.message : 'Please try again.');
    } finally { setLoading(false); }
  }

  async function handleLogin() {
    if (!email || !password) { Alert.alert('Error', 'Enter email and password.'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Main');
    } catch (e: unknown) {
      Alert.alert('Login Failed', e instanceof Error ? e.message : 'Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={S.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={S.header}>
        <View style={S.logoBox}><Text style={{ fontSize: 22 }}>💼</Text></View>
        <Text style={S.appName}>Chaiyo</Text>
        <Text style={S.tagline}>Find your dream job</Text>
      </View>
      <ScrollView style={S.card} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={S.cardTitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
        <Text style={S.cardSub}>{isSignUp ? 'Join thousands finding their dream job' : 'Welcome back! Enter your details.'}</Text>
        {isSignUp && (
          <>
            <Text style={S.label}>FULL NAME</Text>
            <TextInput style={S.input} placeholder="Nara Robinson" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
            <Text style={S.label}>UNIVERSITY / SCHOOL</Text>
            <TextInput style={S.input} placeholder="Chulalongkorn University" placeholderTextColor={colors.muted} value={university} onChangeText={setUniversity} />
          </>
        )}
        <Text style={S.label}>EMAIL</Text>
        <TextInput style={S.input} placeholder="your@email.com" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={S.label}>PASSWORD</Text>
        <TextInput style={S.input} placeholder="Min. 8 characters" placeholderTextColor={colors.muted} value={password} onChangeText={setPassword} secureTextEntry />
        {!isSignUp && <TouchableOpacity style={S.forgot}><Text style={S.forgotTxt}>Forgot password?</Text></TouchableOpacity>}
        {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: spacing.lg }} /> : (
          <TouchableOpacity style={S.btn} onPress={isSignUp ? handleSignUp : handleLogin}>
            <Text style={S.btnTxt}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={S.toggle} onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={S.toggleGray}>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
          <Text style={S.toggleGreen}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const S = StyleSheet.create({
  root:       { flex: 1, backgroundColor: colors.brand },
  header:     { paddingHorizontal: spacing.xxl, paddingTop: 32, paddingBottom: 44, alignItems: 'flex-start' },
  logoBox:    { width: 52, height: 52, borderRadius: radius.xl, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  appName:    { color: '#fff', fontSize: 26, fontWeight: '700' },
  tagline:    { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3 },
  card:       { backgroundColor: '#fff', borderTopLeftRadius: spacing.xxl, borderTopRightRadius: spacing.xxl, marginTop: -20, paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, flex: 1 },
  cardTitle:  { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  cardSub:    { fontSize: 13, color: colors.subtext, marginBottom: spacing.xl },
  label:      { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 0.8, marginBottom: spacing.sm },
  input:      { backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: 11, fontSize: 14, color: colors.text, marginBottom: spacing.lg },
  forgot:     { alignItems: 'flex-end', marginTop: -spacing.md, marginBottom: spacing.md },
  forgotTxt:  { fontSize: 12, color: colors.brand, fontWeight: '500' },
  btn:        { backgroundColor: colors.brand, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center', marginTop: spacing.xs },
  btnTxt:     { color: '#fff', fontSize: 15, fontWeight: '600' },
  toggle:     { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg, paddingBottom: spacing.sm },
  toggleGray: { fontSize: 13, color: colors.subtext },
  toggleGreen:{ fontSize: 13, color: colors.brand, fontWeight: '600' },
});
