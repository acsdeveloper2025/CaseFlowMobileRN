# Deployment Guide

This document outlines the deployment process for the CaseFlow Mobile React Native application.

## Environment Configuration

### Environment Variables

The application uses different environment configurations for different stages:

- **Development** (`.env.development`): Local development
- **Staging** (`.env.staging`): Testing environment
- **Production** (`.env.production`): Live application

### Required Environment Variables

Create a `.env` file based on `.env.example` and configure the following variables:

#### API Configuration

- `API_KEY`: Google Gemini AI API key
- `API_BASE_URL`: Backend API base URL
- `API_TIMEOUT`: API request timeout (milliseconds)

#### App Configuration

- `NODE_ENV`: Environment (development/staging/production)
- `APP_VERSION`: Application version
- `APP_NAME`: Application display name

#### Feature Flags

- `ENABLE_ANALYTICS`: Enable/disable analytics
- `ENABLE_CRASH_REPORTING`: Enable/disable crash reporting
- `ENABLE_PUSH_NOTIFICATIONS`: Enable/disable push notifications
- `ENABLE_DEBUG_MODE`: Enable/disable debug mode

## GitHub Secrets Configuration

Configure the following secrets in your GitHub repository settings:

### General Secrets

- `API_KEY`: Your Gemini AI API key
- `API_BASE_URL`: Your backend API URL
- `SNYK_TOKEN`: Snyk security scanning token (optional)

### Android Secrets

- `ANDROID_KEYSTORE_BASE64`: Base64 encoded Android keystore file
- `ANDROID_KEYSTORE_PASSWORD`: Android keystore password
- `ANDROID_KEY_ALIAS`: Android key alias
- `ANDROID_KEY_PASSWORD`: Android key password
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`: Google Play Console service account JSON

### iOS Secrets

- `IOS_DISTRIBUTION_CERTIFICATE_BASE64`: Base64 encoded iOS distribution certificate
- `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD`: iOS certificate password
- `IOS_PROVISIONING_PROFILE_BASE64`: Base64 encoded provisioning profile
- `APPLE_ID_EMAIL`: Apple ID email for App Store Connect
- `APPLE_ID_PASSWORD`: App-specific password for Apple ID

## CI/CD Pipeline

### Continuous Integration (CI)

The CI pipeline runs on every push and pull request:

1. **Lint and Test**

   - ESLint code linting
   - Prettier code formatting check
   - TypeScript type checking
   - Jest unit tests with coverage

2. **Security Scan**

   - npm audit for vulnerabilities
   - Snyk security scanning

3. **Build**
   - Android APK build
   - iOS IPA build (on macOS runners)

### Continuous Deployment (CD)

The CD pipeline runs on:

- Release creation (automatic production deployment)
- Manual workflow dispatch (choose environment)

#### Deployment Targets

- **Android**: Google Play Store
- **iOS**: Apple App Store Connect

## Local Development

### Environment Setup

1. Copy environment template:

   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables in `.env`

3. Install dependencies:
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

### Running the App

#### Development Environment

```bash
# Android
npm run android:dev

# iOS
npm run ios:dev
```

#### Staging Environment

```bash
# Android
npm run android:staging

# iOS
npm run ios:staging
```

#### Production Environment

```bash
# Android
npm run android:prod

# iOS
npm run ios:prod
```

### Building for Release

#### Android

```bash
# Staging
npm run build:android:staging

# Production
npm run build:android:prod
```

#### iOS

```bash
# Staging
npm run build:ios:staging

# Production
npm run build:ios:prod
```

## Manual Deployment

### Android (Google Play Store)

1. Build the release AAB:

   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. Upload to Google Play Console:
   - Go to Google Play Console
   - Select your app
   - Navigate to Release management > App releases
   - Upload the AAB file from `android/app/build/outputs/bundle/release/`

### iOS (App Store Connect)

1. Build and archive:

   ```bash
   xcodebuild -workspace ios/CaseFlowMobileRN.xcworkspace \
     -scheme CaseFlowMobileRN \
     -configuration Release \
     -destination generic/platform=iOS \
     -archivePath ios/build/CaseFlowMobileRN.xcarchive \
     archive
   ```

2. Export IPA:

   ```bash
   xcodebuild -exportArchive \
     -archivePath ios/build/CaseFlowMobileRN.xcarchive \
     -exportPath ios/build \
     -exportOptionsPlist ios/ExportOptions.plist
   ```

3. Upload to App Store Connect:
   ```bash
   xcrun altool --upload-app \
     --type ios \
     --file ios/build/*.ipa \
     --username YOUR_APPLE_ID \
     --password YOUR_APP_SPECIFIC_PASSWORD
   ```

## Troubleshooting

### Common Issues

1. **Environment variables not loading**

   - Ensure `.env` file exists and is properly formatted
   - Check that `react-native-config` is properly linked

2. **Android build failures**

   - Clean the project: `npm run clean:android`
   - Check Java version (requires Java 17)
   - Verify Android SDK installation

3. **iOS build failures**

   - Clean the project: `npm run clean:ios`
   - Update CocoaPods: `cd ios && pod install`
   - Check Xcode version compatibility

4. **CI/CD pipeline failures**
   - Verify all required secrets are configured
   - Check environment variable syntax
   - Review build logs for specific error messages

### Getting Help

- Check the GitHub Actions logs for detailed error messages
- Review the React Native documentation for platform-specific issues
- Consult the deployment platform documentation (Google Play Console, App Store Connect)
