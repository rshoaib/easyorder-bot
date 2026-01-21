# Android App Build Guide 📱

Since your local environment doesn't have the Android SDK/Java installed, you'll need to run the build process manually. I've pre-configured the `twa-manifest.json` for you.

## Prerequisites
1.  **Node.js**: You already have this.
2.  **Java JDK 17+**: Required for the Android build tools.
3.  **Android SDK**: Bubblewrap will try to install this for you if missing.

## Steps

### 1. Install Bubblewrap CLI
Open your terminal (PowerShell) and run:
```powershell
npm install -g @bubblewrap/cli
```

### 2. Initialize the Project
Since I created `twa-manifest.json`, you can try to skip initialization, but it's safer to let Bubblewrap check your environment.
Run:
```powershell
npx @bubblewrap/cli build
```
*   **If it asks to install JDK/Android SDK**: Say **Yes** (Y).
*   **Keystore**: It will complain that `android.keystore` is missing. It should ask to create one.
    *   **KeyStore Path**: Press Enter (default).
    *   **KeyStore Password**: Create a secure password and **SAVE IT**.
    *   **Key Alias**: `android` (default).
    *   **Key Password**: Same as KeyStore password.
    *   **Name**: Your Name / Company Name.

### 3. Build the App
Once the environment is set up and the keystore is created, the command will generate your files.
Look for:
- **`app-release-bundle.aab`**: This is the file you upload to Google Play Console.
- **`app-release-signed.apk`**: This is for testing on your phone.

## Google Play Console

1.  **Create App**: Go to Play Console, create a new app "Pizza Demo Store".
2.  **Upload**: Go to **Production** (or Internal Testing) -> **Create new release** -> Upload `app-release-bundle.aab`.
3.  **Digital Asset Links**:
    - Play Console will likely show a warning about verification.
    - Go to **Deep links** settings in Play Console.
    - Copy the **SHA-256 fingerprint** from "Asset links JSON".
    - You must add this fingerprint to your website's `assetlinks.json` file (hosted at `https://orderviachat.com/.well-known/assetlinks.json`).
    *   *Let me know if you need help creating this file.*
