import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ref, push } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { mockMechanics } from '../data/mockData';
import { colors, spacing, radius } from '../constants/theme';
import { RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'BookService'>;
  route: RouteProp<RootStackParamList, 'BookService'>;
};

const DATES = ['Today', 'Tue 13', 'Wed 14', 'Thu 15'];
const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[S.chip, active && S.chipOn]}>
      <Text style={[S.chipTxt, active && S.chipTxtOn]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BookServiceScreen({ navigation, route }: Props) {
  const m = mockMechanics.find(x => x.id === route.params.mechanicId) ?? mockMechanics[0];
  const [svc, setSvc] = useState(0);
  const [type, setType] = useState(0);
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const total = m.services[svc].priceNum + 70;

  async function handleBook() {
    const userId = auth.currentUser?.uid;
    if (!userId) { Alert.alert('Please log in first.'); return; }
    setLoading(true);
    try {
      await push(ref(db, 'bookings'), { userId, mechanicId: m.id, mechanicName: m.name, service: m.services[svc].name, serviceType: type === 0 ? 'workshop' : 'home', date: DATES[date], time: TIMES[time], total, status: 'upcoming', createdAt: Date.now() });
      setConfirmed(true);
    } catch { Alert.alert('Error', 'Could not confirm booking.'); }
    finally { setLoading(false); }
  }

  if (confirmed) return (
    <View style={S.success}>
      <View style={S.successIcon}><Text style={{ fontSize: 36 }}>✅</Text></View>
      <Text style={S.h2}>Booking Confirmed!</Text>
      <Text style={S.sub}>Your mechanic will arrive</Text>
      <Text style={S.arrivalTime}>{TIMES[time]}, {DATES[date]}</Text>
      <View style={[S.card, { width: '100%', marginBottom: spacing.xl }]}>
        {[['Mechanic', m.name], ['Service', m.services[svc].name]].map(([l, v], i) => (
          <View key={i}><Text style={S.confLabel}>{l}</Text><Text style={S.confVal}>{v}</Text><View style={S.div} /></View>
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.subtext }}>Total (cash)</Text>
          <Text style={{ fontWeight: '700', color: colors.brand, fontSize: 16 }}>Rs. {total}</Text>
        </View>
      </View>
      <TouchableOpacity style={S.btn} onPress={() => navigation.replace('Main')}>
        <Text style={S.btnTxt}>View My Bookings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={S.container}>
      <View style={S.bar}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ fontSize: 28, color: colors.brand, lineHeight: 34 }}>‹</Text></TouchableOpacity>
        <Text style={S.barTitle}>Book Service</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView style={{ flex: 1, padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        <View style={[S.card, { flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginBottom: spacing.md }]}>
          <View style={S.miniAvatar}><Text>🔧</Text></View>
          <View><Text style={S.miniName}>{m.name}</Text><Text style={{ fontSize: 12, color: colors.warning }}>⭐ {m.rating} ({m.jobs} jobs)</Text></View>
        </View>

        <Text style={S.sec}>SELECT SERVICE</Text>
        {m.services.map((sv, i) => (
          <TouchableOpacity key={i} onPress={() => setSvc(i)} style={[S.radioRow, i === svc && S.radioRowOn]}>
            <View style={[S.radio, i === svc && S.radioOn]}>{i === svc && <View style={S.radioDot} />}</View>
            <Text style={[{ flex: 1, fontSize: 14, color: colors.text }, i === svc && { fontWeight: '600', color: colors.brandDark }]}>🔧 {sv.name}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand }}>Rs. {sv.priceNum}</Text>
          </TouchableOpacity>
        ))}

        <Text style={S.sec}>SERVICE TYPE</Text>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm }}>
          {['🏪 Workshop', '🏠 Home Visit'].map((t, i) => (
            <TouchableOpacity key={i} onPress={() => setType(i)} style={[S.typeBtn, i === type && S.typeBtnOn]}>
              <Text style={[{ fontSize: 13, color: colors.subtext }, i === type && { fontWeight: '600', color: colors.brandDark }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={S.sec}>SELECT DATE</Text>
        <View style={S.chipRow}>{DATES.map((d, i) => <Chip key={i} label={d} active={i === date} onPress={() => setDate(i)} />)}</View>

        <Text style={S.sec}>SELECT TIME</Text>
        <View style={S.chipRow}>{TIMES.map((t, i) => <Chip key={i} label={t} active={i === time} onPress={() => setTime(i)} />)}</View>

        <Text style={S.sec}>BILL SUMMARY</Text>
        <View style={[S.card, { marginBottom: 100 }]}>
          {[[m.services[svc].name, m.services[svc].priceNum], ['Service charge', 50], ['Platform fee', 20]].map(([l, v], i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.background }}>
              <Text style={{ fontSize: 13, color: colors.subtext }}>{l}</Text>
              <Text style={{ fontSize: 13, color: colors.text }}>Rs. {v}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Total (pay cash)</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand }}>Rs. {total}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: spacing.md, backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border }}>
        {loading ? <ActivityIndicator color={colors.brand} /> : (
          <TouchableOpacity style={S.btn} onPress={handleBook}>
            <Text style={S.btnTxt}>Confirm Booking → Rs. {total}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bar: { backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  barTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  miniAvatar: { width: 40, height: 40, backgroundColor: colors.brandLight, borderRadius: radius.btn, alignItems: 'center', justifyContent: 'center' },
  miniName: { fontSize: 13, fontWeight: '600', color: colors.text },
  sec: { fontSize: 11, fontWeight: '600', color: colors.subtext, letterSpacing: 1, marginBottom: spacing.sm, marginTop: spacing.md },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: 12, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.btn, backgroundColor: colors.card, marginBottom: spacing.sm },
  radioRowOn: { borderWidth: 1.5, borderColor: colors.brand, backgroundColor: colors.brandLight },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.brand, backgroundColor: colors.brand },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  typeBtn: { flex: 1, padding: spacing.md, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.btn, alignItems: 'center', backgroundColor: colors.card },
  typeBtnOn: { borderWidth: 1.5, borderColor: colors.brand, backgroundColor: colors.brandLight },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: { padding: 8, paddingHorizontal: 14, borderWidth: 0.5, borderColor: colors.border, borderRadius: radius.btn, backgroundColor: colors.card },
  chipOn: { borderWidth: 1.5, borderColor: colors.brand, backgroundColor: colors.brandLight },
  chipTxt: { fontSize: 12, color: colors.subtext },
  chipTxtOn: { fontWeight: '700', color: colors.brandDark },
  btn: { backgroundColor: colors.brand, borderRadius: radius.btn, paddingVertical: 13, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
  success: { flex: 1, backgroundColor: colors.background, padding: 32, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  h2: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  sub: { fontSize: 14, color: colors.subtext, marginBottom: spacing.sm },
  arrivalTime: { fontSize: 16, fontWeight: '700', color: colors.brand, marginBottom: spacing.xl },
  confLabel: { fontSize: 13, color: colors.subtext, marginBottom: 4 },
  confVal: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  div: { height: 0.5, backgroundColor: colors.background, marginVertical: spacing.sm },
});
