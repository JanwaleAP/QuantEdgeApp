// src/utils/stocks.js

export const API_BASE = 'https://quantedge-api.onrender.com'; // Replace after deploy

export const STOCK_LIST = [
  // Indices
  { sym:'NIFTY50',    name:'Nifty 50 Index',           sector:'Index',    iv:0.18, isIndex:true },
  { sym:'BANKNIFTY',  name:'Bank Nifty Index',          sector:'Index',    iv:0.24, isIndex:true },
  { sym:'SENSEX',     name:'BSE Sensex',                sector:'Index',    iv:0.17, isIndex:true },
  { sym:'NIFTYIT',    name:'Nifty IT Index',            sector:'Index',    iv:0.26, isIndex:true },
  { sym:'NIFTYPHARMA',name:'Nifty Pharma Index',        sector:'Index',    iv:0.23, isIndex:true },
  { sym:'NIFTYAUTO',  name:'Nifty Auto Index',          sector:'Index',    iv:0.28, isIndex:true },
  { sym:'FINNIFTY',   name:'Nifty Financial Services',  sector:'Index',    iv:0.25, isIndex:true },
  // Banking
  { sym:'HDFCBANK',   name:'HDFC Bank Ltd',             sector:'Banking',  iv:0.32 },
  { sym:'ICICIBANK',  name:'ICICI Bank Ltd',            sector:'Banking',  iv:0.29 },
  { sym:'SBIN',       name:'State Bank of India',       sector:'Banking',  iv:0.35 },
  { sym:'KOTAKBANK',  name:'Kotak Mahindra Bank',       sector:'Banking',  iv:0.28 },
  { sym:'AXISBANK',   name:'Axis Bank Ltd',             sector:'Banking',  iv:0.33 },
  { sym:'INDUSINDBK', name:'IndusInd Bank',             sector:'Banking',  iv:0.38 },
  { sym:'PNB',        name:'Punjab National Bank',      sector:'Banking',  iv:0.48 },
  { sym:'CANBK',      name:'Canara Bank',               sector:'Banking',  iv:0.44 },
  { sym:'BANKBARODA', name:'Bank of Baroda',            sector:'Banking',  iv:0.40 },
  // IT
  { sym:'TCS',        name:'Tata Consultancy Services', sector:'IT',       iv:0.22 },
  { sym:'INFY',       name:'Infosys Ltd',               sector:'IT',       iv:0.25 },
  { sym:'WIPRO',      name:'Wipro Ltd',                 sector:'IT',       iv:0.27 },
  { sym:'HCLTECH',    name:'HCL Technologies',          sector:'IT',       iv:0.24 },
  { sym:'TECHM',      name:'Tech Mahindra',             sector:'IT',       iv:0.31 },
  { sym:'LTIM',       name:'LTIMindtree',               sector:'IT',       iv:0.28 },
  { sym:'PERSISTENT', name:'Persistent Systems',        sector:'IT',       iv:0.32 },
  { sym:'COFORGE',    name:'Coforge Ltd',               sector:'IT',       iv:0.35 },
  // Energy
  { sym:'RELIANCE',   name:'Reliance Industries',       sector:'Energy',   iv:0.28 },
  { sym:'ONGC',       name:'Oil & Natural Gas Corp',    sector:'Energy',   iv:0.38 },
  { sym:'COALINDIA',  name:'Coal India Ltd',            sector:'Energy',   iv:0.35 },
  { sym:'BPCL',       name:'Bharat Petroleum',          sector:'Energy',   iv:0.38 },
  { sym:'ADANIGREEN', name:'Adani Green Energy',        sector:'Energy',   iv:0.55 },
  { sym:'ADANIPORTS', name:'Adani Ports & SEZ',         sector:'Infra',    iv:0.45 },
  { sym:'TATAPOWER',  name:'Tata Power Company',        sector:'Power',    iv:0.40 },
  { sym:'NTPC',       name:'NTPC Ltd',                  sector:'Power',    iv:0.32 },
  { sym:'POWERGRID',  name:'Power Grid Corp',           sector:'Power',    iv:0.30 },
  // Auto
  { sym:'TATAMOTORS', name:'Tata Motors Ltd',           sector:'Auto',     iv:0.41 },
  { sym:'MARUTI',     name:'Maruti Suzuki India',       sector:'Auto',     iv:0.28 },
  { sym:'M&M',        name:'Mahindra & Mahindra',       sector:'Auto',     iv:0.33 },
  { sym:'BAJAJ-AUTO', name:'Bajaj Auto Ltd',            sector:'Auto',     iv:0.30 },
  { sym:'HEROMOTOCO', name:'Hero MotoCorp',             sector:'Auto',     iv:0.31 },
  { sym:'EICHERMOT',  name:'Eicher Motors',             sector:'Auto',     iv:0.29 },
  { sym:'TVSMOTOR',   name:'TVS Motor Company',         sector:'Auto',     iv:0.34 },
  // FMCG
  { sym:'HINDUNILVR', name:'Hindustan Unilever',        sector:'FMCG',     iv:0.20 },
  { sym:'ITC',        name:'ITC Ltd',                   sector:'FMCG',     iv:0.22 },
  { sym:'NESTLEIND',  name:'Nestle India',              sector:'FMCG',     iv:0.18 },
  { sym:'BRITANNIA',  name:'Britannia Industries',      sector:'FMCG',     iv:0.23 },
  { sym:'DABUR',      name:'Dabur India',               sector:'FMCG',     iv:0.24 },
  { sym:'TATACONSUM', name:'Tata Consumer Products',    sector:'FMCG',     iv:0.26 },
  // Pharma
  { sym:'SUNPHARMA',  name:'Sun Pharmaceutical',        sector:'Pharma',   iv:0.28 },
  { sym:'DRREDDY',    name:"Dr. Reddy's Laboratories",  sector:'Pharma',   iv:0.25 },
  { sym:'CIPLA',      name:'Cipla Ltd',                 sector:'Pharma',   iv:0.27 },
  { sym:'DIVISLAB',   name:"Divi's Laboratories",       sector:'Pharma',   iv:0.30 },
  { sym:'LUPIN',      name:'Lupin Ltd',                 sector:'Pharma',   iv:0.31 },
  { sym:'APOLLOHOSP', name:'Apollo Hospitals',          sector:'Health',   iv:0.30 },
  // Metals
  { sym:'TATASTEEL',  name:'Tata Steel Ltd',            sector:'Metals',   iv:0.42 },
  { sym:'JSWSTEEL',   name:'JSW Steel Ltd',             sector:'Metals',   iv:0.38 },
  { sym:'HINDALCO',   name:'Hindalco Industries',       sector:'Metals',   iv:0.35 },
  { sym:'VEDL',       name:'Vedanta Ltd',               sector:'Metals',   iv:0.45 },
  { sym:'SAIL',       name:'Steel Authority of India',  sector:'Metals',   iv:0.44 },
  // Infra & Realty
  { sym:'LT',         name:'Larsen & Toubro',           sector:'Infra',    iv:0.28 },
  { sym:'DLF',        name:'DLF Ltd',                   sector:'Realty',   iv:0.40 },
  { sym:'GODREJPROP', name:'Godrej Properties',         sector:'Realty',   iv:0.38 },
  { sym:'RVNL',       name:'Rail Vikas Nigam',          sector:'Infra',    iv:0.45 },
  // Telecom
  { sym:'BHARTIARTL', name:'Bharti Airtel',             sector:'Telecom',  iv:0.30 },
  { sym:'IDEA',       name:'Vodafone Idea',             sector:'Telecom',  iv:0.70 },
  // Cement & Paints
  { sym:'ULTRACEMCO', name:'UltraTech Cement',          sector:'Cement',   iv:0.25 },
  { sym:'AMBUJACEM',  name:'Ambuja Cements',            sector:'Cement',   iv:0.28 },
  { sym:'ASIANPAINT', name:'Asian Paints',              sector:'Paints',   iv:0.24 },
  // Finance
  { sym:'BAJFINANCE', name:'Bajaj Finance Ltd',         sector:'Finance',  iv:0.35 },
  { sym:'BAJAJFINSV', name:'Bajaj Finserv',             sector:'Finance',  iv:0.30 },
  { sym:'HDFCLIFE',   name:'HDFC Life Insurance',       sector:'Insurance',iv:0.28 },
  { sym:'SBILIFE',    name:'SBI Life Insurance',        sector:'Insurance',iv:0.27 },
  // Consumer
  { sym:'TITAN',      name:'Titan Company',             sector:'Consumer', iv:0.28 },
  { sym:'DMART',      name:'Avenue Supermarts',         sector:'Retail',   iv:0.27 },
  { sym:'ZOMATO',     name:'Zomato Ltd',                sector:'Tech',     iv:0.55 },
  { sym:'IRCTC',      name:'IRCTC Ltd',                 sector:'Travel',   iv:0.40 },
  { sym:'PAYTM',      name:'One97 Communications',      sector:'Fintech',  iv:0.60 },
  // Defence
  { sym:'HAL',        name:'Hindustan Aeronautics',     sector:'Defence',  iv:0.38 },
  { sym:'BEL',        name:'Bharat Electronics',        sector:'Defence',  iv:0.35 },
  { sym:'BHEL',       name:'Bharat Heavy Electricals',  sector:'PSU',      iv:0.42 },
  { sym:'MAZAGON',    name:'Mazagon Dock Shipbuilders', sector:'Defence',  iv:0.38 },
  // Engineering
  { sym:'HAVELLS',    name:'Havells India',             sector:'Electric', iv:0.28 },
  { sym:'SIEMENS',    name:'Siemens India',             sector:'Engineer', iv:0.26 },
  { sym:'ABB',        name:'ABB India',                 sector:'Engineer', iv:0.27 },
  { sym:'INDIGO',     name:'InterGlobe Aviation',       sector:'Aviation', iv:0.38 },
];

export const SECTORS = ['All', ...new Set(STOCK_LIST.map(s => s.sector))];

export const SIGNALS = [
  { stock:'NIFTY50',   action:'CALL BUY', strike:25600, expiry:'27 Feb', prob:78, confidence:'HIGH',   reason:'Bullish engulfing + RSI bounce from 42. FII net buyers. IV at 6-month low.' },
  { stock:'BANKNIFTY', action:'PUT BUY',  strike:55000, expiry:'27 Feb', prob:71, confidence:'MEDIUM', reason:'Bearish divergence on MACD. PCR spike to 1.4. Resistance at 55200 holding.' },
  { stock:'RELIANCE',  action:'CALL BUY', strike:1300,  expiry:'27 Mar', prob:65, confidence:'MEDIUM', reason:'Breakout above 50 EMA. Positive earnings surprise expected. Sector tailwind.' },
  { stock:'HDFCBANK',  action:'PUT BUY',  strike:1750,  expiry:'27 Feb', prob:58, confidence:'LOW',    reason:'Global uncertainty. PCR rising. Key support at 1720 may break if selling continues.' },
];

export const SENTIMENTS = ['Bullish 📈','Bearish 📉','Neutral ➡️','Strongly Bullish 🚀','Mildly Bearish ⚠️'];

// Black-Scholes
const normCDF = (x) => {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign=x<0?-1:1, t=1/(1+p*Math.abs(x));
  return 0.5*(1+sign*(1-t*(a1+t*(a2+t*(a3+t*(a4+t*a5))))*Math.exp(-x*x/2)));
};
const normPDF = (x) => Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);

export const calcBS = (S,K,r,T,sigma,type) => {
  if(T<=0||sigma<=0||S<=0||K<=0) return 0;
  const d1=(Math.log(S/K)+(r+0.5*sigma*sigma)*T)/(sigma*Math.sqrt(T)), d2=d1-sigma*Math.sqrt(T);
  return type==='call' ? S*normCDF(d1)-K*Math.exp(-r*T)*normCDF(d2) : K*Math.exp(-r*T)*normCDF(-d2)-S*normCDF(-d1);
};

export const calcGreeks = (S,K,r,T,sigma) => {
  if(T<=0||sigma<=0) return {dc:0.5,dp:-0.5,gamma:0,theta:0,vega:0};
  const d1=(Math.log(S/K)+(r+0.5*sigma*sigma)*T)/(sigma*Math.sqrt(T)), d2=d1-sigma*Math.sqrt(T);
  return {
    dc:normCDF(d1), dp:normCDF(d1)-1,
    gamma:normPDF(d1)/(S*sigma*Math.sqrt(T)),
    theta:(-(S*normPDF(d1)*sigma)/(2*Math.sqrt(T))-r*K*Math.exp(-r*T)*normCDF(d2))/365,
    vega:S*normPDF(d1)*Math.sqrt(T)/100,
  };
};

export const fakeHistory = (base) => Array.from({length:30},()=>({close:base*(0.88+Math.random()*0.24)}));

export const runPrediction = (price) => {
  const h = fakeHistory(price);
  const last = h[h.length-1].close;
  const trend = (h[h.length-1].close-h[0].close)/h[0].close;
  const mom = trend>0.02?1:trend<-0.02?-1:0;
  const rsi = 30+Math.random()*50, macd=(Math.random()-0.5)*20, sent=Math.random();
  const score = mom*0.3+(sent-0.5)*0.25+(rsi<30?0.04:rsi>70?-0.04:0)+(macd>0?0.15:-0.15);
  const bp = Math.min(Math.max(50+score*50,20),85);
  const regimes = ['Trending Bull','Trending Bear','Sideways','High Volatility'];
  return {
    history: h, current: last,
    p1d: last*(1+score*0.015+(Math.random()-0.5)*0.008),
    p5d: last*(1+score*0.04+(Math.random()-0.5)*0.02),
    p30d: last*(1+score*0.12+(Math.random()-0.5)*0.06),
    bull: Math.round(bp), bear: Math.round(100-bp),
    rsi: Math.round(rsi), macd: macd.toFixed(2),
    sentiment: SENTIMENTS[Math.floor(Math.random()*SENTIMENTS.length)],
    conf: Math.round(60+Math.random()*20),
    regime: regimes[Math.floor(Math.random()*regimes.length)],
    models: { lstm:Math.round(55+Math.random()*20), xgb:Math.round(55+Math.random()*20), prophet:Math.round(50+Math.random()*20), tft:Math.round(60+Math.random()*18) },
    support:(last*0.97).toFixed(2), resistance:(last*1.03).toFixed(2),
    sl:(last*0.95).toFixed(2), target:(last*1.06).toFixed(2),
  };
};
