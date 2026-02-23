// src/screens/WatchlistScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, TinyChart } from '../components';
import { STOCK_LIST } from '../utils/stocks';
import { SPACING } from '../theme';

export default function WatchlistScreen({ stocks, watchlist, addToWatchlist, removeFromWatchlist, onSelectStock, colors }) {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');

  const watchedStocks = stocks.filter(s => watchlist.includes(s.sym));

  const unwatched = useMemo(() => stocks.filter(s => {
    if (watchlist.includes(s.sym)) return false;
    if (!search && sector === 'All') return false;
    const q = search.toLowerCase();
    const matchQ = s.sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q);
    const matchSec = sector === 'All' || s.sector === sector;
    return matchQ && matchSec;
  }), [stocks, watchlist, search, sector]);

  const quickSectors = ['All', 'Index', 'Banking', 'IT', 'Energy', 'Pharma', 'Auto', 'Defence', 'FMCG'];

  const confirmRemove = (sym) => {
    Alert.alert('Remove from Watchlist', `Remove ${sym}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromWatchlist(sym) },
    ]);
  };

  const renderWatched = ({ item: s }) => (
    <View style={[styles.watchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => onSelectStock(s)} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Text style={[styles.sym, { color: colors.text }]}>{s.sym}</Text>
              <Pill label={s.sector} color={colors.accentBlue} />
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 6 }}>{s.name}</Text>
            <Text style={[styles.price, { color: colors.text }]}>
              {s.isIndex ? `${(s.price||0).toLocaleString('en-IN')} pts` : `₹${(s.price||0).toLocaleString('en-IN')}`}
              {'  '}
              <Text style={{ color: s.chg >= 0 ? colors.accent : colors.accentRed, fontSize: 12 }}>
                {s.chg >= 0 ? '▲' : '▼'} {Math.abs(s.chg || 0).toFixed(2)}%
              </Text>
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <TinyChart base={s.price || 100} color={s.chg >= 0 ? colors.accent : colors.accentRed} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity onPress={() => onSelectStock(s)}
                style={[styles.btn, { borderColor: colors.accent + '55', backgroundColor: colors.accent + '18' }]}>
                <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '700' }}>Predict</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmRemove(s.sym)}
                style={[styles.btn, { borderColor: colors.accentRed + '44', backgroundColor: colors.accentRed + '12' }]}>
                <Text style={{ color: colors.accentRed, fontSize: 13 }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>⭐ Watchlist</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{watchlist.length}/15 stocks</Text>
      </View>

      <FlatList
        data={watchedStocks}
        keyExtractor={s => s.sym}
        renderItem={renderWatched}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>⭐</Text>
            <Text style={{ color: colors.textSub, fontSize: 14, fontWeight: '600' }}>Watchlist is empty</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Search stocks below to add</Text>
          </View>
        }
        ListFooterComponent={
          <View>
            {/* Divider */}
            <View style={[styles.divider, { borderColor: colors.border }]}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>ADD STOCKS</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Search */}
            <TextInput
              value={search} onChangeText={setSearch}
              placeholder="🔍  Search by name, symbol or sector..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            />

            {/* Sector chips */}
            <FlatList
              horizontal showsHorizontalScrollIndicator={false}
              data={quickSectors} keyExtractor={s => s}
              contentContainerStyle={{ gap: 6, paddingBottom: 10 }}
              renderItem={({ item: s }) => (
                <TouchableOpacity onPress={() => setSector(s)}
                  style={[styles.chip, { borderColor: sector === s ? colors.accent : colors.border, backgroundColor: sector === s ? colors.accent + '18' : colors.inputBg }]}>
                  <Text style={{ color: sector === s ? colors.accent : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{s}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Search results */}
            {(search || sector !== 'All') && (
              <>
                <Text style={{ color: colors.textMuted, fontSize: 10, marginBottom: 8, fontFamily: 'Courier New' }}>
                  {unwatched.length} stocks available
                </Text>
                {unwatched.slice(0, 20).map(s => (
                  <View key={s.sym} style={[styles.addCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={[styles.sym, { color: colors.text }]}>{s.sym}</Text>
                        <Pill label={s.sector} color={colors.accentBlue} />
                      </View>
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>{s.name}</Text>
                      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 4 }}>
                        {s.isIndex ? `${(s.price||0).toLocaleString()} pts` : `₹${(s.price||0).toLocaleString()}`}
                        {'  '}
                        <Text style={{ color: s.chg >= 0 ? colors.accent : colors.accentRed, fontSize: 11 }}>
                          {s.chg >= 0 ? '▲' : '▼'} {Math.abs(s.chg || 0).toFixed(2)}%
                        </Text>
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => { addToWatchlist(s.sym); setSearch(''); }}
                      style={[styles.addBtn, { backgroundColor: colors.accent + '18', borderColor: colors.accent + '55' }]}>
                      <Text style={{ color: colors.accent, fontSize: 16, fontWeight: '700' }}>＋</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {unwatched.length === 0 && (
                  <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', padding: 20 }}>
                    No results — try different search or sector
                  </Text>
                )}
              </>
            )}
            {!search && sector === 'All' && (
              <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', padding: 20 }}>
                Type a stock name or select a sector above to browse
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 12, fontFamily: 'Courier New' },
  watchCard: { borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1 },
  sym: { fontSize: 14, fontWeight: '700', fontFamily: 'Courier New' },
  price: { fontSize: 14, fontWeight: '700' },
  btn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  empty: { alignItems: 'center', padding: 32 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 10, letterSpacing: 1.5, fontFamily: 'Courier New' },
  searchInput: { borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 13, marginBottom: 8, fontFamily: 'Courier New' },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  addCard: { borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  addBtn: { borderWidth: 1, borderRadius: 12, width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
});
