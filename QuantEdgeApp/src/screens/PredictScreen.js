// src/screens/PredictScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, SectionTitle, Ring, MiniChart, ModelBar, TargetRow, IndicatorBox, LoadingSpinner, Pill } from '../components';
import { runPrediction } from '../utils/stocks';
import { SPACING } from '../theme';

const API_URL = 'https://api.anthropic.com/v1/messages';

export default function PredictScreen({ stock, colors }) {
  const [pred, setPred] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const price = stock?.price || 25587;

  useEffect(() => {
    setLoading(true);
    setPred(null);
    setAiText('');
    const timer = setTimeout(() => {
      const result = runPrediction(price);
      setPred(result);
      setLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, [stock?.sym, price]);

  const pct = pred ? ((pred.p1d - pred.current) / pred.current * 100).toFixed(2) : 0;
  const isUp = Number(pct) >= 0;

  const getAI = async () => {
    if (!pred) return;
    setAiLoading(true); setAiText('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content:
            `You are a professional stock market analyst. Give a concise 3-paragraph trading insight for ${stock.name} (${stock.sym}). Live price: ₹${price}, Bull prob: ${pred.bull}%, RSI: ${pred.rsi}, Sentiment: ${pred.sentiment}, Regime: ${pred.regime}, 1D target: ₹${pred.p1d.toFixed(2)}, 30D target: ₹${pred.p30d.toFixed(2)}. Cover: 1) Market analysis 2) Specific PUT/CALL options strategy 3) Risk management. Professional. Use ₹.`
          }],
        }),
      });
      const d = await res.json();
      setAiText(d.content?.[0]?.text || 'Unable to generate insight.');
    } catch { setAiText('AI insight unavailable. Please try again.'); }
    setAiLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>⚡ AI Predict</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{stock?.name || 'Select a stock'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Price Header Card */}
        <Card colors={colors} style={{ shadowColor: isUp ? colors.accent : colors.accentRed, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>{stock?.name}</Text>
              <Text style={[styles.bigPrice, { color: colors.text }]}>
                {stock?.isIndex ? `${price.toLocaleString('en-IN')} pts` : `₹${price.toLocaleString('en-IN')}`}
              </Text>
              {stock?.chg !== undefined && (
                <Text style={{ color: stock.chg >= 0 ? colors.accent : colors.accentRed, fontSize: 12, marginBottom: 4 }}>
                  {stock.chg >= 0 ? '▲' : '▼'} {Math.abs(stock.chg || 0).toFixed(2)}% today
                </Text>
              )}
              <Pill label={`${isUp ? '▲' : '▼'} ${Math.abs(pct)}% (1D forecast)`} color={isUp ? colors.accent : colors.accentRed} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Ring value={pred?.bull || 50} size={80} color={colors.accent} subColor={colors.ringSub} />
              <Text style={{ color: colors.textMuted, fontSize: 9, marginTop: 4 }}>BULL PROB</Text>
            </View>
          </View>
          {pred && <View style={{ marginTop: 12 }}><MiniChart data={pred.history} color={isUp ? colors.accent : colors.accentRed} width={340} height={44} /></View>}
        </Card>

        {loading ? <LoadingSpinner color={colors.accent} /> : pred && (<>

          {/* Price Targets */}
          <Card colors={colors}>
            <SectionTitle title="PRICE TARGETS" colors={colors} />
            <TargetRow label="1 Day"   value={pred.p1d}  change={(pred.p1d -pred.current)/pred.current*100} colors={colors} />
            <TargetRow label="5 Days"  value={pred.p5d}  change={(pred.p5d -pred.current)/pred.current*100} colors={colors} />
            <TargetRow label="30 Days" value={pred.p30d} change={(pred.p30d-pred.current)/pred.current*100} colors={colors} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, margin: -3 }}>
              {[['TARGET', pred.target, colors.accent], ['STOP LOSS', pred.sl, colors.accentRed],
                ['SUPPORT', pred.support, colors.accentBlue], ['RESISTANCE', pred.resistance, colors.accentYellow]].map(([l, v, c]) => (
                <View key={l} style={[styles.targetBox, { backgroundColor: c + '18', borderColor: c + '33' }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 9 }}>{l}</Text>
                  <Text style={{ color: c, fontSize: 13, fontWeight: '700' }}>₹{v}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Indicators */}
          <Card colors={colors}>
            <SectionTitle title="TECHNICAL INDICATORS" colors={colors} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -3 }}>
              <IndicatorBox label="RSI" value={pred.rsi} color={pred.rsi < 30 ? colors.accent : pred.rsi > 70 ? colors.accentRed : colors.accentYellow} colors={colors} />
              <IndicatorBox label="MACD" value={pred.macd} color={pred.macd > 0 ? colors.accent : colors.accentRed} colors={colors} />
              <IndicatorBox label="IV%" value={(stock.iv * 100).toFixed(0)} color={colors.accentBlue} colors={colors} />
              <IndicatorBox label="Conf." value={`${pred.conf}%`} color={colors.accentPurple} colors={colors} />
              <IndicatorBox label="Zone" value={pred.rsi < 30 ? 'Oversold' : pred.rsi > 70 ? 'Overbought' : 'Neutral'} color={colors.accentYellow} colors={colors} />
              <IndicatorBox label="Regime" value={pred.regime.split(' ')[0]} color={colors.accentCyan} colors={colors} />
            </View>
            <View style={[styles.sentimentBox, { backgroundColor: colors.inputBg }]}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>Sentiment: </Text>
              <Text style={{ color: colors.textSub, fontSize: 11 }}>{pred.sentiment}</Text>
            </View>
          </Card>

          {/* Ensemble Models */}
          <Card colors={colors}>
            <SectionTitle title="ENSEMBLE MODELS ACCURACY" colors={colors} />
            <ModelBar name="LSTM Neural Net"    value={pred.models.lstm}    color={colors.accent}       colors={colors} />
            <ModelBar name="XGBoost"            value={pred.models.xgb}     color={colors.accentBlue}   colors={colors} />
            <ModelBar name="FB Prophet"         value={pred.models.prophet} color={colors.accentYellow} colors={colors} />
            <ModelBar name="Transformer TFT"    value={pred.models.tft}     color={colors.accentPurple} colors={colors} />
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 4 }}>
              Combined confidence: <Text style={{ color: colors.accent }}>{pred.conf}%</Text>
            </Text>
          </Card>

          {/* AI Insight */}
          <Card colors={colors}>
            <SectionTitle title="AI ANALYST INSIGHT" colors={colors} />
            {aiText ? (
              <Text style={[styles.aiText, { color: colors.textSub }]}>{aiText}</Text>
            ) : (
              <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>
                Get deep AI-powered analysis with specific PUT/CALL strategy recommendations
              </Text>
            )}
            <TouchableOpacity onPress={getAI} disabled={aiLoading}
              style={[styles.aiBtn, { backgroundColor: aiLoading ? colors.accent + '80' : colors.accent, opacity: aiLoading ? 0.7 : 1 }]}>
              {aiLoading
                ? <ActivityIndicator color="#080e1a" />
                : <Text style={styles.aiBtnText}>{aiText ? '↻ REFRESH INSIGHT' : '⚡ GET AI INSIGHT'}</Text>}
            </TouchableOpacity>
          </Card>
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2, fontFamily: 'Courier New' },
  bigPrice: { fontSize: 28, fontWeight: '800', marginVertical: 4 },
  targetBox: { width: '47%', margin: 3, borderRadius: 8, padding: 10, borderWidth: 1 },
  sentimentBox: { borderRadius: 8, padding: 10, flexDirection: 'row', marginTop: 10 },
  aiText: { fontSize: 13, lineHeight: 22, marginBottom: 12 },
  aiBtn: { borderRadius: 12, padding: 14, alignItems: 'center' },
  aiBtnText: { color: '#080e1a', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
