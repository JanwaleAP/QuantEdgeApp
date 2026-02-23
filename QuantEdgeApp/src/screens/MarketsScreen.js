// src/screens/MarketsScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pill, StatusBadge } from '../components';
import { SECTORS } from '../utils/stocks';
import { SPACING, RADIUS } from '../theme';

export default function MarketsScreen({ stocks, status, lastUpdated, isRefreshing, refresh, colors, watchlist, addToWatchlist, onSelectStock }) {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');

  const filtered = useMemo(() => stocks.filter(s => {
    const q = search.toLowerCase();
    return (s.sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q))
      && (sector === 'All' || s.sector === sector);
  }), [stocks, search, sector]);

  const renderStock = ({ item: s }) => {
    const isWatched = watchlist.includes(s.sym);
    const isUp = s.chg >= 0;
    return (
      <TouchableOpacity style={[styles.stockCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => onSelectStock(s)} activeOpacity={0.7}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Text style={[styles.sym, { color: colors.text }]}>{s.sym}</Text>
            {s.isIndex && <Text style={[styles.indexBadge, { color: colors.accentCyan, borderColor: colors.accentCyan + '44', backgroundColor: colors.accentCyan + '18' }]}>INDEX</Text>}
          </View>
          <Text style={[styles.name, { color: colors.textMuted }]}>{s.name}</Text>
          <Pill label={s.sector} color={colors.accentBlue} />
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          {s.price > 0 ? (
            <>
              <Text style={[styles.price, { color: colors.text }]}>
                {s.isIndex ? `${s.price.toLocaleString('en-IN')} pts` : `₹${s.price.toLocaleString('en-IN')}`}
              </Text>
              <Text style={{ color: isUp ? colors.accent : colors.accentRed, fontSize: 12, fontWeight: '700' }}>
                {isUp ? '▲' : '▼'} {Math.abs(s.chg).toFixed(2)}%
              </Text>
            </>
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>Loading...</Text>
          )}
          <TouchableOpacity onPress={() => addToWatchlist(s.sym)}
            style={[styles.watchBtn, { borderColor: isWatched ? colors.accentYellow : colors.border }]}>
            <Text style={{ color: isWatched ? colors.accentYellow : colors.textMuted, fontSize: 11 }}>
              {isWatched ? '★' : '☆'} {isWatched ? 'Watching' : 'Watch'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.appName, { color: colors.accent }]}>QUANTEDGE AI</Text>
          <Text style={[styles.appTitle, { color: colors.text }]}>Market Oracle</Text>
          <StatusBadge status={status} lastUpdated={lastUpdated} colors={colors} />
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.md }}>
        <TextInput
          value={search} onChangeText={setSearch}
          placeholder="🔍  Search name, symbol or sector..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
        />
      </View>

      {/* Sector filter */}
      <FlatList
        horizontal showsHorizontalScrollIndicator={false}
        data={SECTORS.slice(0, 14)}
        keyExtractor={s => s}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: 6 }}
        renderItem={({ item: s }) => (
          <TouchableOpacity onPress={() => setSector(s)}
            style={[styles.sectorChip, { borderColor: sector === s ? colors.accent : colors.border, backgroundColor: sector === s ? colors.accent + '18' : colors.inputBg }]}>
            <Text style={{ color: sector === s ? colors.accent : colors.textMuted, fontSize: 11, fontWeight: '600' }}>{s}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.count, { color: colors.textMuted }]}>{filtered.length} stocks · {status === 'live' ? 'Live prices' : 'Demo prices'}</Text>

      <FlatList
        data={filtered} keyExtractor={s => s.sym} renderItem={renderStock}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 1 },
  appName: { fontSize: 10, letterSpacing: 2, fontFamily: 'Courier New' },
  appTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginVertical: 2 },
  searchInput: { borderRadius: RADIUS.md, borderWidth: 1, padding: 12, fontSize: 13, fontFamily: 'Courier New' },
  sectorChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  count: { fontSize: 10, paddingHorizontal: SPACING.lg, marginBottom: 6, fontFamily: 'Courier New' },
  stockCard: { borderRadius: RADIUS.md, padding: 14, marginBottom: 8, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  sym: { fontSize: 14, fontWeight: '700', fontFamily: 'Courier New' },
  name: { fontSize: 11, marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '700' },
  watchBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  indexBadge: { fontSize: 9, fontWeight: '700', borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
});
