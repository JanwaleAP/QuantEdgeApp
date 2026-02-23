# 🚀 GitHub Actions APK Build — Step by Step Guide

## What happens automatically:
Every time you push code to GitHub → GitHub builds the APK → You download it

---

## STEP 1 — Create GitHub Account
1. Go to https://github.com
2. Click **Sign up**
3. Enter email, password, username
4. Verify email
✅ Done

---

## STEP 2 — Create New Repository
1. Click the **"+"** button (top right) → **"New repository"**
2. Repository name: `QuantEdgeApp`
3. Set to **Public** (required for free Actions minutes)
4. ✅ Check **"Add a README file"**
5. Click **"Create repository"**
✅ Done

---

## STEP 3 — Upload Your Project Files
You have two options:

### Option A — Upload via GitHub website (easiest)
1. Open your repository on GitHub
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop ALL files from the QuantEdgeApp folder
4. Make sure to include the `.github/workflows/build-apk.yml` file
5. Click **"Commit changes"**

### Option B — Using Git on your computer
```bash
# Install Git from https://git-scm.com
git clone https://github.com/YOUR_USERNAME/QuantEdgeApp.git
cd QuantEdgeApp

# Copy all your project files into this folder, then:
git add .
git commit -m "Initial commit - QuantEdge AI app"
git push origin main
```
✅ Done

---

## STEP 4 — Watch the Build
1. Go to your repository on GitHub
2. Click the **"Actions"** tab (top menu)
3. You'll see **"Build Android APK"** workflow running
4. Click on it to see live build logs
5. Build takes about **8-12 minutes**

### Build Status:
- 🟡 Yellow circle = Building in progress
- ✅ Green checkmark = Build successful, APK ready!
- ❌ Red X = Build failed (check logs)

---

## STEP 5 — Download Your APK
After build succeeds:

1. Click on the completed workflow run
2. Scroll down to **"Artifacts"** section
3. Click **"QuantEdge-APK-v1.0.0-..."** to download
4. You get a ZIP file containing the APK
5. Extract it → you have `QuantEdge-v1.0.0-....apk`

### Also available as GitHub Release:
- Go to repository → **Releases** (right sidebar)
- Every successful build creates a release with APK attached
- Direct download link you can share with anyone!

---

## STEP 6 — Install APK on Android Phone

### Allow installation from unknown sources:
- **Android 8+:** Settings → Apps → Special app access → Install unknown apps → Allow your browser/file manager
- **Older Android:** Settings → Security → Unknown sources → Enable

### Install:
1. Transfer APK to phone (WhatsApp, email, Google Drive, USB)
2. Tap the APK file
3. Tap **Install**
4. Tap **Open**
✅ App is running on your phone!

---

## STEP 7 — Future Updates (Automatic!)
Every time you change code and push to GitHub:
```bash
git add .
git commit -m "Updated stock list"
git push
```
→ GitHub automatically builds new APK
→ New release created
→ Download and install updated APK

---

## Optional — Add Signing Key for Production

For Play Store, generate a proper keystore:

### Generate keystore (run once on your computer):
```bash
# Install Java first, then run:
keytool -genkey -v \
  -keystore quantedge.keystore \
  -alias quantedge \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
Fill in details when prompted. Save the password!

### Convert to Base64:
```bash
# Mac/Linux:
base64 -i quantedge.keystore | tr -d '\n'

# Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("quantedge.keystore"))
```
Copy the output.

### Add to GitHub Secrets:
1. Go to repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these 4 secrets:

| Secret Name          | Value                        |
|----------------------|------------------------------|
| `KEYSTORE_BASE64`    | (base64 string from above)   |
| `KEY_ALIAS`          | `quantedge`                  |
| `STORE_PASSWORD`     | (your keystore password)     |
| `KEY_PASSWORD`       | (your key password)          |

Now builds will be properly signed for Play Store!

---

## Troubleshooting

### ❌ "Gradle build failed"
- Check the Actions log for exact error
- Most common: missing `android/` folder in repo
- Fix: Make sure you uploaded the complete project

### ❌ "No artifact found"
- Build might have failed before APK was created
- Click the failed job → read error message

### ❌ APK installs but crashes
- You uploaded a debug build — this is normal for testing
- For production, add the keystore secrets (Step 7)

### 🟡 Build taking too long
- Normal build time: 8-15 minutes (first build)
- Subsequent builds: 5-8 minutes (Gradle cache helps)
- GitHub free tier: 2,000 minutes/month (more than enough)

---

## GitHub Free Tier Limits

| Resource                | Free Limit              |
|-------------------------|-------------------------|
| Build minutes/month     | 2,000 minutes           |
| APK artifact storage    | 500 MB per artifact     |
| Artifact retention      | 30 days                 |
| Private repo minutes    | 2,000/month             |
| Public repo minutes     | **Unlimited** ✅         |

💡 **Tip:** Keep your repo Public to get unlimited build minutes!
