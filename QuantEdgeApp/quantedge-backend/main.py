from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import yfinance as yf
from datetime import datetime
import pytz
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="QuantEdge AI — Live Market API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ── Symbol Map: App Symbol → Yahoo Finance Symbol ─────────────────────────────
SYMBOL_MAP = {
    # Indices
    "NIFTY50":"^NSEI","BANKNIFTY":"^NSEBANK","SENSEX":"^BSESN",
    "NIFTYIT":"^CNXIT","NIFTYPHARMA":"^CNXPHARMA","NIFTYAUTO":"^CNXAUTO",
    "NIFTYFMCG":"^CNXFMCG","FINNIFTY":"^CNXFIN","MIDCPNIFTY":"^NSEMDCP50",
    "NIFTYMID50":"^NSEMDCP50",
    # IT
    "TCS":"TCS.NS","INFY":"INFY.NS","WIPRO":"WIPRO.NS","HCLTECH":"HCLTECH.NS",
    "TECHM":"TECHM.NS","LTIM":"LTIM.NS","MPHASIS":"MPHASIS.NS",
    "PERSISTENT":"PERSISTENT.NS","COFORGE":"COFORGE.NS","KPIT":"KPITTECH.NS",
    # Banking
    "HDFCBANK":"HDFCBANK.NS","ICICIBANK":"ICICIBANK.NS","SBIN":"SBIN.NS",
    "KOTAKBANK":"KOTAKBANK.NS","AXISBANK":"AXISBANK.NS","INDUSINDBK":"INDUSINDBK.NS",
    "BANDHANBNK":"BANDHANBNK.NS","FEDERALBNK":"FEDERALBNK.NS",
    "IDFCFIRSTB":"IDFCFIRSTB.NS","PNB":"PNB.NS","CANBK":"CANBK.NS",
    "BANKBARODA":"BANKBARODA.NS",
    # Finance
    "BAJFINANCE":"BAJFINANCE.NS","BAJAJFINSV":"BAJAJFINSV.NS",
    "CHOLAFIN":"CHOLAFIN.NS","MUTHOOTFIN":"MUTHOOTFIN.NS",
    "SHRIRAMFIN":"SHRIRAMFIN.NS","HDFCLIFE":"HDFCLIFE.NS",
    "SBILIFE":"SBILIFE.NS","ICICIPRU":"ICICIPRULIFE.NS","LTFH":"LTFH.NS",
    # Energy
    "RELIANCE":"RELIANCE.NS","ONGC":"ONGC.NS","COALINDIA":"COALINDIA.NS",
    "IOC":"IOC.NS","BPCL":"BPCL.NS","HPCL":"HINDPETRO.NS","GAIL":"GAIL.NS",
    "PETRONET":"PETRONET.NS","ADANIGREEN":"ADANIGREEN.NS",
    "ADANIPORTS":"ADANIPORTS.NS","ADANIENT":"ADANIENT.NS",
    "TATAPOWER":"TATAPOWER.NS","NTPC":"NTPC.NS","POWERGRID":"POWERGRID.NS",
    "NHPC":"NHPC.NS",
    # Auto
    "TATAMOTORS":"TATAMOTORS.NS","MARUTI":"MARUTI.NS","M&M":"M&M.NS",
    "BAJAJ-AUTO":"BAJAJ-AUTO.NS","HEROMOTOCO":"HEROMOTOCO.NS",
    "EICHERMOT":"EICHERMOT.NS","ASHOKLEY":"ASHOKLEY.NS","TVSMOTOR":"TVSMOTOR.NS",
    "MOTHERSON":"MOTHERSON.NS","BOSCHLTD":"BOSCHLTD.NS",
    # FMCG
    "HINDUNILVR":"HINDUNILVR.NS","ITC":"ITC.NS","NESTLEIND":"NESTLEIND.NS",
    "BRITANNIA":"BRITANNIA.NS","DABUR":"DABUR.NS","MARICO":"MARICO.NS",
    "GODREJCP":"GODREJCP.NS","COLPAL":"COLPAL.NS","EMAMILTD":"EMAMILTD.NS",
    "TATACONSUM":"TATACONSUM.NS","VBLLTD":"VBL.NS","UBL":"UBL.NS",
    "MCDOWELL-N":"MCDOWELL-N.NS",
    # Pharma
    "SUNPHARMA":"SUNPHARMA.NS","DRREDDY":"DRREDDY.NS","CIPLA":"CIPLA.NS",
    "DIVISLAB":"DIVISLAB.NS","AUROPHARMA":"AUROPHARMA.NS","BIOCON":"BIOCON.NS",
    "LUPIN":"LUPIN.NS","GLENMARK":"GLENMARK.NS","TORNTPHARM":"TORNTPHARM.NS",
    "ABBOTINDIA":"ABBOTINDIA.NS","APOLLOHOSP":"APOLLOHOSP.NS",
    "FORTIS":"FORTIS.NS","MAXHEALTH":"MAXHEALTH.NS",
    # Metals
    "TATASTEEL":"TATASTEEL.NS","JSWSTEEL":"JSWSTEEL.NS","HINDALCO":"HINDALCO.NS",
    "VEDL":"VEDL.NS","NATIONALUM":"NATIONALUM.NS","HINDZINC":"HINDZINC.NS",
    "SAIL":"SAIL.NS","NMDC":"NMDC.NS","APLAPOLLO":"APLAPOLLO.NS",
    # Infra & Realty
    "LT":"LT.NS","DLF":"DLF.NS","GODREJPROP":"GODREJPROP.NS",
    "PRESTIGE":"PRESTIGE.NS","OBEROIRLTY":"OBEROIRLTY.NS",
    "PHOENIXLTD":"PHOENIXLTD.NS","BRIGADE":"BRIGADE.NS",
    "GMRINFRA":"GMRINFRA.NS","RVNL":"RVNL.NS","IRB":"IRB.NS",
    # Telecom
    "BHARTIARTL":"BHARTIARTL.NS","IDEA":"IDEA.NS","INDUSTOWER":"INDUSTOWER.NS",
    "TATACOMM":"TATACOMM.NS","ZEEL":"ZEEL.NS","SUNTV":"SUNTV.NS","PVR":"PVRINOX.NS",
    # Cement & Paints
    "ULTRACEMCO":"ULTRACEMCO.NS","SHREECEM":"SHREECEM.NS","AMBUJACEM":"AMBUJACEM.NS",
    "ACC":"ACC.NS","DALMIACEM":"DALMIACEM.NS","JKCEMENT":"JKCEMENT.NS",
    "PIDILITIND":"PIDILITIND.NS","ASIANPAINT":"ASIANPAINT.NS",
    "BERGERPAINTS":"BERGEPAINT.NS","KANSAINER":"KANSAINER.NS",
    # Chemicals
    "UPL":"UPL.NS","PIIND":"PIIND.NS","DEEPAKNTR":"DEEPAKNTR.NS",
    "AARTIIND":"AARTIIND.NS","COROMANDEL":"COROMANDEL.NS",
    # Aviation & Logistics
    "INDIGO":"INDIGO.NS","SPICEJET":"SPICEJET.NS","BLUEDART":"BLUEDART.NS",
    "DELHIVERY":"DELHIVERY.NS","CONCOR":"CONCOR.NS","IRCTC":"IRCTC.NS",
    # Consumer
    "TITAN":"TITAN.NS","TRENT":"TRENT.NS","DMART":"DMART.NS",
    "NYKAA":"NYKAA.NS","ZOMATO":"ZOMATO.NS","JUBLFOOD":"JUBLFOOD.NS",
    # Fintech
    "PAYTM":"PAYTM.NS","POLICYBZR":"POLICYBZR.NS",
    # Defence & PSU
    "HAL":"HAL.NS","BEL":"BEL.NS","BHEL":"BHEL.NS","COCHINSHIP":"COCHINSHIP.NS",
    "MAZAGON":"MAZDOCK.NS","GRSE":"GRSE.NS","BEML":"BEML.NS",
    # Engineering & Electricals
    "CUMMINSIND":"CUMMINSIND.NS","THERMAX":"THERMAX.NS","ABB":"ABB.NS",
    "SIEMENS":"SIEMENS.NS","HAVELLS":"HAVELLS.NS","VOLTAS":"VOLTAS.NS",
    "BLUESTAR":"BLUESTAR.NS","CROMPTON":"CROMPTON.NS",
}

# ── Cache (5 min TTL) ─────────────────────────────────────────────────────────
_cache = {}
CACHE_TTL = 300

def cache_get(key):
    if key in _cache:
        data, ts = _cache[key]
        if (datetime.now() - ts).seconds < CACHE_TTL:
            return data
    return None

def cache_set(key, data):
    _cache[key] = (data, datetime.now())

def ist_time():
    return datetime.now(pytz.timezone("Asia/Kolkata")).strftime("%H:%M:%S IST")

def fetch_one(app_sym: str):
    yf_sym = SYMBOL_MAP.get(app_sym.upper())
    if not yf_sym:
        return None
    try:
        t = yf.Ticker(yf_sym)
        fi = t.fast_info
        price = round(float(fi.last_price), 2)
        prev  = round(float(fi.previous_close), 2)
        chg   = round(price - prev, 2)
        pct   = round(((price - prev) / prev) * 100, 2) if prev else 0.0
        return {"sym": app_sym.upper(), "price": price, "prev_close": prev,
                "change": chg, "change_pct": pct, "updated_at": ist_time()}
    except Exception as e:
        logger.warning(f"Failed {app_sym}: {e}")
        return None

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "service": "QuantEdge AI — Live Market API",
        "status": "running ✅",
        "server_time": ist_time(),
        "total_symbols": len(SYMBOL_MAP),
        "usage": {
            "single":  "GET /price/NIFTY50",
            "bulk":    "GET /bulk?symbols=NIFTY50,TCS,RELIANCE",
            "all":     "GET /all",
            "symbols": "GET /symbols",
            "health":  "GET /health",
        }
    }

@app.get("/health")
def health():
    return {"status": "ok", "time": ist_time()}

@app.get("/symbols")
def list_symbols():
    return {"total": len(SYMBOL_MAP), "symbols": list(SYMBOL_MAP.keys())}

@app.get("/price/{symbol}")
@limiter.limit("60/minute")
def get_price(symbol: str, request: Request):
    sym = symbol.upper()
    cached = cache_get(f"p_{sym}")
    if cached:
        return {**cached, "cached": True}
    data = fetch_one(sym)
    if not data:
        raise HTTPException(404, f"Symbol '{sym}' not found. See /symbols for valid list.")
    cache_set(f"p_{sym}", data)
    return {**data, "cached": False}

@app.get("/bulk")
@limiter.limit("20/minute")
def get_bulk(symbols: str, request: Request):
    sym_list = [s.strip().upper() for s in symbols.split(",") if s.strip()][:50]
    cache_key = "bulk_" + "_".join(sorted(sym_list))
    cached = cache_get(cache_key)
    if cached:
        return {"data": cached, "cached": True, "count": len(cached), "updated_at": ist_time()}
    results = {}
    for sym in sym_list:
        d = fetch_one(sym)
        if d:
            results[sym] = d
    cache_set(cache_key, results)
    return {"data": results, "cached": False, "count": len(results), "updated_at": ist_time()}

@app.get("/all")
@limiter.limit("5/minute")
def get_all(request: Request):
    cached = cache_get("all_prices")
    if cached:
        return {"data": cached, "cached": True, "count": len(cached), "updated_at": ist_time()}
    results = {}
    for sym in SYMBOL_MAP:
        d = fetch_one(sym)
        if d:
            results[sym] = d
    cache_set("all_prices", results)
    return {"data": results, "cached": False, "count": len(results), "updated_at": ist_time()}
