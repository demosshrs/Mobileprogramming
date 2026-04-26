import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) { Alert.alert('Error', 'Fill all required fields.'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await set(ref(db, `users/${cred.user.uid}`), { name, phone, email });
      } catch (dbErr: unknown) {
        Alert.alert('DB Error', dbErr instanceof Error ? dbErr.message : 'Database write failed.');
        setLoading(false); return;
      }
      navigation.replace('Main');
    } catch (e: unknown) {
      Alert.alert('Auth Error', e instanceof Error ? e.message : 'Sign up failed.');
    } finally { setLoading(false); }
  }

  async function handleLogin() {
    if (!email || !password) { Alert.alert('Error', 'Enter email and password.'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Main');
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Login failed.');
    } finally { setLoading(false); }
  }

  const S = styles;
  return (
    <KeyboardAvoidingView style={S.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={S.header}>
        <View style={S.logoBox}><Text style={{ fontSize: 30 }}>🔧</Text></View>
        <Text style={S.appName}>MechaNow</Text>
        <Text style={S.tagline}>Your trusted mechanic, anytime</Text>
      </View>
      <ScrollView style={S.form} contentContainerStyle={S.formContent} keyboardShouldPersistTaps="handled">
        <Text style={S.title}>{isSignUp ? 'Create account' : 'Welcome back'}</Text>
        <Text style={S.subtitle}>{isSignUp ? 'Join MechaNow today' : 'Sign in to your account'}</Text>
        {isSignUp && (
          <>
            <Text style={S.label}>FULL NAME</Text>
            <TextInput style={S.input} placeholder="Ramesh Thapa" placeholderTextColor={colors.subtext} value={name} onChangeText={setName} />
            <Text style={S.label}>PHONE NUMBER</Text>
            <TextInput style={S.input} placeholder="+977 98XXXXXXXX" placeholderTextColor={colors.subtext} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </>
        )}
        <Text style={S.label}>EMAIL ADDRESS</Text>
        <TextInput style={S.input} placeholder="you@email.com" placeholderTextColor={colors.subtext} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={S.label}>PASSWORD</Text>
        <TextInput style={S.input} placeholder="Min. 8 characters" placeholderTextColor={colors.subtext} value={password} onChangeText={setPassword} secureTextEntry />
        {loading ? <ActivityIndicator color={colors.brand} style={{ marginTop: spacing.lg }} /> : (
          <TouchableOpacity style={S.btn} onPress={isSignUp ? handleSignUp : handleLogin}>
            <Text style={S.btnTxt}>{isSignUp ? 'Create Account →' : 'Sign In'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={S.toggle}>
          <Text style={S.toggleTxt}>
            {isSignUp ? 'Already have an account? ' : 'No account? '}
            <Text style={S.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand },
  header: { paddingTop: 60, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, alignItems: 'center' },
  logoBox: { width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  appName: { fontSize: 26, fontWeight: '700', color: '#fff' },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  form: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  formContent: { padding: spacing.xl, paddingTop: spacing.xxl },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.subtext, marginBottom: spacing.xl },
  label: { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 1, marginBottom: spacing.sm },
  input: { borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.btn, padding: 11, fontSize: 14, color: colors.text, marginBottom: spacing.lg },
  btn: { backgroundColor: colors.brand, borderRadius: radius.btn, paddingVertical: 13, alignItems: 'center', marginTop: spacing.sm },
  btnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  toggle: { marginTop: spacing.lg, alignItems: 'center' },
  toggleTxt: { fontSize: 14, color: colors.subtext },
  toggleLink: { color: colors.brand, fontWeight: '600' },
});
