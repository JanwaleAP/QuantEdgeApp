// src/hooks/useLivePrices.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE, STOCK_LIST } from '../utils/stocks';

const REFRESH_INTERVAL = 60000; // 60 seconds
const CHUNK_SIZE = 30;

export default function useLivePrices() {
  const [prices, setPrices] = useState({});
  const [status, setStatus] = useState('connecting'); // connecting | live | error
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef(null);

  const allSymbols = STOCK_LIST.map(s => s.sym);

  const fetchPrices = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const chunks = [];
      for (let i = 0; i < allSymbols.length; i += CHUNK_SIZE) {
        chunks.push(allSymbols.slice(i, i + CHUNK_SIZE));
      }
      let allData = {};
      for (const chunk of chunks) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(`${API_BASE}/bulk?symbols=${chunk.join(',')}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        allData = { ...allData, ...json.data };
      }
      setPrices(allData);
      setStatus('live');
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Price fetch failed:', err.message);
      setStatus('error');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices(false);
    timerRef.current = setInterval(() => fetchPrices(true), REFRESH_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [fetchPrices]);

  // Merge live prices with static stock list
  const stocks = STOCK_LIST.map(s => {
    const live = prices[s.sym];
    return live
      ? { ...s, price: live.price, chg: live.change_pct, change: live.change }
      : { ...s, price: 0, chg: 0, change: 0 };
  });

  return { stocks, prices, status, lastUpdated, isRefreshing, refresh: () => fetchPrices(false) };
}
