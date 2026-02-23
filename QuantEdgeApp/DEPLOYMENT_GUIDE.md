# QuantEdge AI — Complete Deployment Guide
## React Native (Android + iOS) + Render.com Backend

---

## 📁 Project Structure

```
QuantEdgeApp/               ← React Native mobile app
├── App.js                  ← Root navigation + state
├── package.json
├── src/
│   ├── screens/
│   │   ├── MarketsScreen.js
│   │   ├── PredictScreen.js
│   │   ├── OptionsScreen.js
│   │   ├── SignalsScreen.js
│   │   └── WatchlistScreen.js
│   ├── components/index.js ← Shared UI components
│   ├── hooks/useLivePrices.js
│   ├── utils/stocks.js
│   └── theme/index.js

quantedge-backend/          ← Python FastAPI backend
├── main.py                 ← Live price API
├── requirements.txt
├── render.yaml
└── Procfile
```

---

## PART 1 — Deploy Backend on Render.com (Do this FIRST)

### Step 1 — Create GitHub account
Go to https://github.com and sign up (free)

### Step 2 — Create new repository
1. Click **"New repository"**
2. Name it: `quantedge-backend`
3. Set to **Public**
4. Click **"Create repository"**

### Step 3 — Upload backend files
Upload these 4 files to the repo:
- `main.py`
- `requirements.txt`
- `render.yaml`
- `Procfile`

### Step 4 — Deploy on Render
1. Go to https://render.com → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select the `quantedge-backend` repo
5. Render auto-detects settings from `render.yaml`
6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment

### Step 5 — Get your backend URL
After deploy, you'll get a URL like:
```
https://quantedge-backend.onrender.com
```

### Step 6 — Test it works
Open in browser:
```
https://quantedge-backend.onrender.com/
https://quantedge-backend.onrender.com/price/NIFTY50
https://quantedge-backend.onrender.com/price/RELIANCE
```
You should see live JSON prices!

### Step 7 — Update frontend URL
In `src/utils/stocks.js`, replace line 4:
```js
// BEFORE:
export const API_BASE = 'https://quantedge-api.onrender.com';

// AFTER (use YOUR actual URL):
export const API_BASE = 'https://quantedge-backend.onrender.com';
```

---

## PART 2 — Setup React Native Development Environment

### Requirements
- Computer: Windows, Mac, or Linux
- RAM: Minimum 8GB (16GB recommended)
- Storage: 20GB free space

### Step 1 — Install Node.js
Download from https://nodejs.org → Install LTS version
```bash
# Verify:
node --version   # Should show v18 or higher
npm --version
```

### Step 2 — Install React Native CLI
```bash
npm install -g react-native-cli
npm install -g @react-native-community/cli
```

### Step 3 — Install Java JDK (for Android)
Download JDK 17 from https://adoptium.net
```bash
# Verify:
java -version   # Should show 17.x
```

### Step 4 — Install Android Studio
1. Download from https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio → SDK Manager
4. Install: **Android 14 (API 34)**
5. Install: **Android SDK Build-Tools 34**

### Step 5 — Set Environment Variables (Windows)
Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x
```
Add to PATH:
```
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

### Step 6 — Set Environment Variables (Mac/Linux)
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

---

## PART 3 — Run the App

### Step 1 — Install dependencies
```bash
cd QuantEdgeApp
npm install
```

### Step 2 — Install iOS pods (Mac only)
```bash
cd ios && pod install && cd ..
```

### Step 3 — Start Android Emulator
In Android Studio → Device Manager → Create Virtual Device
→ Pixel 7 → Android 14 → Launch

OR connect real Android phone:
- Enable Developer Options on phone (tap Build Number 7 times)
- Enable USB Debugging
- Connect via USB cable

### Step 4 — Run the app
```bash
# Android:
npx react-native run-android

# iOS (Mac only):
npx react-native run-ios
```

The app will build and launch on your device/emulator!

---

## PART 4 — Build Release APK (Android)

### Step 1 — Generate signing key
```bash
keytool -genkey -v -keystore quantedge.keystore -alias quantedge -keyalg RSA -keysize 2048 -validity 10000
```
Fill in the details when prompted. Save the password!

### Step 2 — Place keystore file
Copy `quantedge.keystore` to `android/app/`

### Step 3 — Configure signing
Edit `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=quantedge.keystore
MYAPP_UPLOAD_KEY_ALIAS=quantedge
MYAPP_UPLOAD_STORE_PASSWORD=YourPassword
MYAPP_UPLOAD_KEY_PASSWORD=YourPassword
```

Edit `android/app/build.gradle`, find `buildTypes` and update:
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
    }
}
```

### Step 4 — Build the APK
```bash
cd android
./gradlew assembleRelease
```

APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

Transfer to your phone and install!

---

## PART 5 — Publish to Google Play Store

### Step 1 — Create developer account
Go to https://play.google.com/console
Pay one-time $25 fee (~₹2,100)

### Step 2 — Build App Bundle (instead of APK)
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 3 — Create app listing
- App name: "QuantEdge AI Market Oracle"
- Category: Finance
- Screenshots: Take from emulator
- Icon: 512x512 PNG

### Step 4 — Upload and publish
Upload the `.aab` file → Review → Publish
Usually takes 1-3 days for Google review

---

## PART 6 — iOS App Store (Mac required)

### Step 1 — Apple Developer account
https://developer.apple.com → $99/year (~₹8,200)

### Step 2 — Build
```bash
npx react-native run-ios --configuration Release
```

### Step 3 — Archive in Xcode
Open `ios/QuantEdgeApp.xcworkspace` in Xcode
Product → Archive → Distribute App → App Store Connect

---

## Quick Reference

| Task                          | Command                              |
|-------------------------------|--------------------------------------|
| Start Metro bundler           | `npx react-native start`             |
| Run Android                   | `npx react-native run-android`       |
| Run iOS                       | `npx react-native run-ios`           |
| Build Android APK             | `cd android && ./gradlew assembleRelease` |
| Build Android Bundle          | `cd android && ./gradlew bundleRelease` |
| Clean build                   | `cd android && ./gradlew clean`      |
| Reset cache                   | `npx react-native start --reset-cache` |

---

## Troubleshooting

**"SDK location not found"**
→ Set ANDROID_HOME environment variable

**"Metro bundler port already in use"**
→ Run: `npx react-native start --port 8082`

**"Gradle build failed"**
→ Run: `cd android && ./gradlew clean`

**Backend showing error / demo prices**
→ Render free tier sleeps after 15min inactivity
→ First request wakes it up (takes ~30 seconds)
→ Upgrade to Render Starter ($7/month) to avoid sleep

**App crashes on Android**
→ Check logcat: `adb logcat | grep ReactNative`

---

## Cost Summary

| Item                          | Cost              |
|-------------------------------|-------------------|
| Render.com backend (free tier)| ₹0/month          |
| Google Play Store             | ₹2,100 one-time   |
| Apple App Store               | ₹8,200/year       |
| Total (Android only)          | **₹2,100**        |
| Total (Android + iOS)         | **₹10,300 + ₹8,200/yr** |
