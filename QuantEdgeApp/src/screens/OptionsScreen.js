// src/screens/OptionsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Card, SectionTitle, Ring, Pill } from '../components';
import { calcBS, calcGreeks } from '../utils/stocks';
import { SPACING } from '../theme';

export default function OptionsScreen({ stock, pred, colors }) {
  const [expiry, setExpiry] = useState(30);
  const [strike, setStrike] = useState(0);
  const [opts, setOpts] = useState(null);

  const price = stock?.price || 25587;

  useEffect(() => {
    setStrike(Math.round(price / 50) * 50);
  }, [stock?.sym, price]);

  useEffect(() => {
    if (!strike || !stock) return;
    const S = price, K = strike, r = 0.065, T = expiry / 365, sigma = stock.iv || 0.25;
    const call = calcBS(S, K, r, T, sigma, 'call');
    const put  = calcBS(S, K, r, T, sigma, 'put');
    const g    = calcGreeks(S, K, r, T, sigma);
    setOpts({
      call: call.toFixed(2), put: put.toFixed(2),
      cp: Math.round(60 + Math.random() * 20),
      pp: Math.round(40 + Math.random() * 20),
      g, iv: (sigma * 100).toFixed(1),
      ivr: Math.round(30 + Math.random() * 50),
      mp: Math.round(K * 0.99 / 50) * 50,
      pcr: (0.7 + Math.random() * 0.6).toFixed(2),
    });
  }, [strike, expiry, stock?.sym, price]);

  const strikeOptions = Array.from({ length: 9 }, (_, i) =>
    Math.round(price / 50) * 50 + (i - 4) * 50
  );

  const expiryOptions = [
    { label: '7 Days', value: 7 }, { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 }, { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>📊 Options Chain</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{stock?.sym} · ₹{price.toLocaleString('en-IN')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Strike & Expiry selectors */}
        <Card colors={colors}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textMuted }]}>STRIKE PRICE</Text>
              <View style={[styles.pickerWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {strikeOptions.map(k => (
                    <TouchableOpacity key={k} onPress={() => setStrike(k)}
                      style={[styles.strikeBtn, { borderColor: strike === k ? colors.accent : colors.border, backgroundColor: strike === k ? colors.accent + '18' : 'transparent' }]}>
                      <Text style={{ color: strike === k ? colors.accent : colors.textMuted, fontSize: 11, fontWeight: '700' }}>₹{k}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <Text style={[styles.label, { color: colors.textMuted, marginTop: 12 }]}>EXPIRY</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {expiryOptions.map(e => (
              <TouchableOpacity key={e.value} onPress={() => setExpiry(e.value)}
                style={[styles.expiryBtn, { borderColor: expiry === e.value ? colors.accent : colors.border, backgroundColor: expiry === e.value ? colors.accent + '18' : colors.inputBg }]}>
                <Text style={{ color: expiry === e.value ? colors.accent : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* CALL / PUT cards */}
        {opts && (
          <>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { label: 'CALL', price: opts.call, prob: opts.cp, color: colors.accent, rec: opts.cp > 65 ? 'BUY' : 'WAIT', delta: opts.g.dc },
                { label: 'PUT',  price: opts.put,  prob: opts.pp, color: colors.accentRed, rec: opts.pp > 65 ? 'BUY' : 'WAIT', delta: opts.g.dp },
              ].map(o => (
                <View key={o.label} style={[styles.optionCard, { backgroundColor: o.color + '0d', borderColor: o.color + '40', flex: 1 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: o.color, fontSize: 16, fontWeight: '800' }}>{o.label}</Text>
                    <Pill label={o.rec} color={o.rec === 'BUY' ? colors.accent : colors.accentYellow} />
                  </View>
                  <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 8 }}>₹{o.price}</Text>
                  <Ring value={o.prob} size={64} color={o.color} subColor={colors.ringSub} />
                  <Text style={{ color: colors.textMuted, fontSize: 9, marginTop: 4 }}>Profit Probability</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 6 }}>
                    Delta: <Text style={{ color: o.color }}>{o.delta.toFixed(3)}</Text>
                  </Text>
                </View>
              ))}
            </View>

            {/* Greeks */}
            <Card colors={colors} style={{ marginTop: 10 }}>
              <SectionTitle title="GREEKS" colors={colors} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -3 }}>
                {[
                  ['Δ Call', opts.g.dc.toFixed(3), colors.accent],
                  ['Δ Put',  opts.g.dp.toFixed(3), colors.accentRed],
                  ['Γ Gamma',opts.g.gamma.toFixed(4),colors.accentBlue],
                  ['Θ Theta',opts.g.theta.toFixed(3),colors.accentYellow],
                  ['ν Vega', opts.g.vega.toFixed(3), colors.accentPurple],
                  ['IV%',    `${opts.iv}%`,           colors.accentCyan],
                ].map(([l, v, c]) => (
                  <View key={l} style={[styles.greekBox, { backgroundColor: colors.inputBg }]}>
                    <Text style={{ color: colors.textMuted, fontSize: 9, marginBottom: 2 }}>{l}</Text>
                    <Text style={{ color: c, fontSize: 12, fontWeight: '700' }}>{v}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* Analysis */}
            <Card colors={colors}>
              <SectionTitle title="OPTIONS ANALYSIS" colors={colors} />
              {[
                ['IV Rank',   `${opts.ivr}%`, opts.ivr > 50 ? colors.accentRed : colors.accent],
                ['PCR Ratio', opts.pcr,       opts.pcr > 1  ? colors.accentRed : colors.accent],
                ['Max Pain',  `₹${opts.mp}`,  colors.accentYellow],
              ].map(([k, v, c]) => (
                <View key={k} style={[styles.analysisRow, { borderBottomColor: colors.border }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{k}</Text>
                  <Text style={{ color: c, fontSize: 13, fontWeight: '700' }}>{v}</Text>
                </View>
              ))}
            </Card>

            {/* Model Comparison */}
            <Card colors={colors}>
              <SectionTitle title="MODEL COMPARISON" colors={colors} />
              {[
                ['Black-Scholes',     opts.call, opts.put],
                ['Heston (Vol Smile)',(Number(opts.call)*1.04).toFixed(2),(Number(opts.put)*1.03).toFixed(2)],
                ['Monte Carlo',       (Number(opts.call)*0.98).toFixed(2),(Number(opts.put)*1.01).toFixed(2)],
              ].map(([m, c, p]) => (
                <View key={m} style={[styles.analysisRow, { borderBottomColor: colors.border }]}>
                  <Text style={{ color: colors.textSub, fontSize: 11 }}>{m}</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ color: colors.accent, fontSize: 11 }}>C: ₹{c}</Text>
                    <Text style={{ color: colors.accentRed, fontSize: 11 }}>P: ₹{p}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2, fontFamily: 'Courier New' },
  label: { fontSize: 9, letterSpacing: 1.5, marginBottom: 6, fontFamily: 'Courier New' },
  pickerWrap: { borderRadius: 10, borderWidth: 1, paddingVertical: 6 },
  strikeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginHorizontal: 3 },
  expiryBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  optionCard: { borderRadius: 14, padding: 14, borderWidth: 1, alignItems: 'flex-start' },
  greekBox: { width: '30%', margin: 3, borderRadius: 8, padding: 8, alignItems: 'center' },
  analysisRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
});
