// src/screens/SignalsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Ring, Pill } from '../components';
import { SIGNALS } from '../utils/stocks';
import { SPACING } from '../theme';

export default function SignalsScreen({ colors }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>🔔 Live Signals</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>AI-generated PUT/CALL recommendations</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {SIGNALS.map((s, i) => {
          const isCall = s.action.includes('CALL');
          const signalColor = isCall ? colors.accent : colors.accentRed;
          const confColor = s.confidence === 'HIGH' ? colors.accent : s.confidence === 'MEDIUM' ? colors.accentYellow : colors.accentBlue;
          return (
            <Card key={i} colors={colors} style={{ borderColor: signalColor + '33' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View>
                  <Text style={[styles.stockName, { color: colors.text }]}>{s.stock}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2, fontFamily: 'Courier New' }}>
                    Strike ₹{s.strike.toLocaleString('en-IN')} · Expiry {s.expiry}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                    <Pill label={s.action} color={signalColor} />
                    <Pill label={s.confidence} color={confColor} />
                  </View>
                </View>
                <Ring value={s.prob} size={68} color={signalColor} subColor={colors.ringSub} />
              </View>
              <View style={[styles.reasonBox, { backgroundColor: colors.inputBg }]}>
                <Text style={{ color: colors.textSub, fontSize: 12, lineHeight: 18 }}>{s.reason}</Text>
              </View>
            </Card>
          );
        })}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.accentYellow + '10', borderColor: colors.accentYellow + '30' }]}>
          <Text style={{ color: colors.accentYellow, fontWeight: '700', fontSize: 12, marginBottom: 4 }}>⚠️ Risk Disclaimer</Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, lineHeight: 17 }}>
            AI-generated signals are probabilistic and not guaranteed. Options involve significant financial risk. Past performance is not indicative of future results. This is not financial advice.
          </Text>
        </View>

        {/* Market Stats */}
        <Card colors={colors} style={{ marginTop: 4 }}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>TODAY'S MARKET OVERVIEW</Text>
          {[
            ['FII Net Buy/Sell', '₹ +2,340 Cr', colors.accent],
            ['DII Net Buy/Sell', '₹ -890 Cr',   colors.accentRed],
            ['Market Breadth',   '1.4x (Bullish)',colors.accent],
            ['VIX (Fear Index)', '14.2 (Low)',    colors.accentBlue],
            ['PCR (Nifty)',      '1.12 (Neutral)',colors.accentYellow],
          ].map(([k, v, c]) => (
            <View key={k} style={[styles.statRow, { borderBottomColor: colors.border }]}>
              <Text style={{ color: colors.textSub, fontSize: 12 }}>{k}</Text>
              <Text style={{ color: c, fontSize: 12, fontWeight: '700' }}>{v}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2, fontFamily: 'Courier New' },
  stockName: { fontSize: 18, fontWeight: '800' },
  reasonBox: { borderRadius: 10, padding: 12 },
  disclaimer: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 12 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 10, fontFamily: 'Courier New' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
});
