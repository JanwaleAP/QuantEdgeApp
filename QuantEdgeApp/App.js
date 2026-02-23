// App.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ToastAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MarketsScreen   from './src/screens/MarketsScreen';
import PredictScreen   from './src/screens/PredictScreen';
import OptionsScreen   from './src/screens/OptionsScreen';
import SignalsScreen   from './src/screens/SignalsScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';

import useLivePrices from './src/hooks/useLivePrices';
import { COLORS } from './src/theme';
import { STOCK_LIST } from './src/utils/stocks';

const Tab = createBottomTabNavigator();

// ── Tab Icons (emoji-based, no icon library needed) ───────────────────────────
const TAB_ICONS = {
  Markets:   '📈',
  Predict:   '⚡',
  Options:   '📊',
  Signals:   '🔔',
  Watchlist: '⭐',
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const colors = COLORS[isDark ? 'dark' : 'light'];

  const [selectedStock, setSelectedStock] = useState(STOCK_LIST[0]);
  const [pred, setPred] = useState(null);
  const [watchlist, setWatchlist] = useState(['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'HDFCBANK']);

  const { stocks, status, lastUpdated, isRefreshing, refresh } = useLivePrices();

  const showToast = (msg) => {
    if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert('', msg);
  };

  const addToWatchlist = useCallback((sym) => {
    if (watchlist.includes(sym)) {
      showToast(`${sym} is already in watchlist`);
    } else if (watchlist.length >= 15) {
      showToast('Watchlist limit is 15 stocks');
    } else {
      setWatchlist(p => [...p, sym]);
      showToast(`✓ ${sym} added to watchlist`);
    }
  }, [watchlist]);

  const removeFromWatchlist = useCallback((sym) => {
    setWatchlist(p => p.filter(s => s !== sym));
    showToast(`${sym} removed`);
  }, []);

  const handleSelectStock = useCallback((stock, navigation) => {
    setSelectedStock(stock);
    navigation?.navigate('Predict');
  }, []);

  // Find live stock data for selected stock
  const liveSelected = stocks.find(s => s.sym === selectedStock.sym) || selectedStock;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.bg}
        />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: colors.navBg,
                borderTopColor: colors.border,
                borderTopWidth: 1,
                paddingBottom: 6,
                paddingTop: 6,
                height: 62,
              },
              tabBarActiveTintColor: colors.accent,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarLabelStyle: {
                fontSize: 10,
                fontFamily: 'Courier New',
                letterSpacing: 0.5,
              },
              tabBarIcon: ({ focused, color }) => (
                <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>
                  {TAB_ICONS[route.name]}
                </Text>
              ),
              // Theme toggle button in header area
              tabBarButton: (props) => (
                <TouchableOpacity {...props} activeOpacity={0.7} />
              ),
            })}
          >
            <Tab.Screen name="Markets">
              {({ navigation }) => (
                <MarketsScreen
                  stocks={stocks}
                  status={status}
                  lastUpdated={lastUpdated}
                  isRefreshing={isRefreshing}
                  refresh={refresh}
                  colors={colors}
                  isDark={isDark}
                  toggleTheme={() => setIsDark(d => !d)}
                  watchlist={watchlist}
                  addToWatchlist={addToWatchlist}
                  onSelectStock={(stock) => handleSelectStock(stock, navigation)}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Predict">
              {() => (
                <PredictScreen
                  stock={liveSelected}
                  colors={colors}
                  pred={pred}
                  setPred={setPred}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Options">
              {() => (
                <OptionsScreen
                  stock={liveSelected}
                  pred={pred}
                  colors={colors}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Signals">
              {() => <SignalsScreen colors={colors} />}
            </Tab.Screen>

            <Tab.Screen name="Watchlist">
              {({ navigation }) => (
                <WatchlistScreen
                  stocks={stocks}
                  watchlist={watchlist}
                  addToWatchlist={addToWatchlist}
                  removeFromWatchlist={removeFromWatchlist}
                  onSelectStock={(stock) => handleSelectStock(stock, navigation)}
                  colors={colors}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
