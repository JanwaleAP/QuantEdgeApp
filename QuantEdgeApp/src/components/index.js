// src/components/index.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Circle, Polyline, Polygon, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { SPACING, RADIUS } from '../theme';

// ── Pill Badge ────────────────────────────────────────────────────────────────
export const Pill = ({ label, color }) => (
  <View style={[styles.pill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
);

// ── Probability Ring ──────────────────────────────────────────────────────────
export const Ring = ({ value, size = 80, color, subColor }) => {
  const r = 30, circ = 2 * Math.PI * r, dash = (value / 100) * circ;
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Circle cx="40" cy="40" r={r} fill="none" stroke={subColor} strokeWidth="6" />
      <Circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90, 40, 40)" />
      <SvgText x="40" y="45" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">{value}%</SvgText>
    </Svg>
  );
};

// ── Mini Sparkline Chart ──────────────────────────────────────────────────────
export const MiniChart = ({ data, color, width = 200, height = 44 }) => {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d.close);
  const max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1;
  const pts = vals.map((v, i) =>
    `${(i / (vals.length - 1)) * width},${height - ((v - min) / range) * (height - 4)}`
  ).join(' ');
  const fillPts = `0,${height} ${pts} ${width},${height}`;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Polygon points={fillPts} fill="url(#chartGrad)" />
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
};

// ── Tiny Sparkline (for watchlist) ────────────────────────────────────────────
export const TinyChart = ({ base, color }) => {
  const vals = Array.from({ length: 12 }, () => base * (0.92 + Math.random() * 0.16));
  const max = Math.max(...vals), min = Math.min(...vals), range = max - min || 1;
  const pts = vals.map((v, i) => `${(i / 11) * 80},${22 - ((v - min) / range) * 18}`).join(' ');
  return (
    <Svg width={80} height={24} viewBox="0 0 80 24">
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
};

// ── Card Container ────────────────────────────────────────────────────────────
export const Card = ({ children, style, colors }) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
    {children}
  </View>
);

// ── Section Title ─────────────────────────────────────────────────────────────
export const SectionTitle = ({ title, colors }) => (
  <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
);

// ── Model Progress Bar ────────────────────────────────────────────────────────
export const ModelBar = ({ name, value, color, colors }) => (
  <View style={{ marginBottom: 10 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
      <Text style={{ color: colors.textSub, fontSize: 11, fontFamily: 'Courier New' }}>{name}</Text>
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{value}%</Text>
    </View>
    <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' }}>
      <View style={{ height: 6, width: `${value}%`, borderRadius: 3, backgroundColor: color }} />
    </View>
  </View>
);

// ── Price Target Row ──────────────────────────────────────────────────────────
export const TargetRow = ({ label, value, change, colors }) => (
  <View style={[styles.targetRow, { borderBottomColor: colors.border }]}>
    <Text style={{ color: colors.textSub, fontSize: 12 }}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>₹{value.toFixed(2)}</Text>
      <Text style={{ color: change > 0 ? colors.accent : colors.accentRed, fontSize: 11 }}>
        {change > 0 ? '+' : ''}{change.toFixed(2)}%
      </Text>
    </View>
  </View>
);

// ── Indicator Box ─────────────────────────────────────────────────────────────
export const IndicatorBox = ({ label, value, color, colors }) => (
  <View style={[styles.indicatorBox, { backgroundColor: colors.inputBg }]}>
    <Text style={{ color: colors.textMuted, fontSize: 9, marginBottom: 2 }}>{label}</Text>
    <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{value}</Text>
  </View>
);

// ── Loading Spinner ───────────────────────────────────────────────────────────
export const LoadingSpinner = ({ color }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
    <ActivityIndicator size="large" color={color} />
    <Text style={{ color, fontSize: 11, marginTop: 12, fontFamily: 'Courier New' }}>
      Running ensemble models...
    </Text>
  </View>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
export const StatusBadge = ({ status, lastUpdated, colors }) => {
  const statusMap = {
    live: { color: colors.accent, label: '● LIVE' },
    connecting: { color: colors.accentYellow, label: '● CONNECTING' },
    error: { color: colors.accentRed, label: '● DEMO MODE' },
  };
  const s = statusMap[status] || statusMap.error;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text style={{ color: s.color, fontSize: 10, fontWeight: '700' }}>{s.label}</Text>
      {lastUpdated && <Text style={{ color: colors.textMuted, fontSize: 9 }}>Updated {lastUpdated}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  sectionTitle: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Courier New' },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  indicatorBox: { flex: 1, borderRadius: 8, padding: 8, alignItems: 'center', margin: 3 },
});
