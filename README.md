# CaseFlow Mobile

A React Native mobile application for case flow management, built with TypeScript and modern development practices.

## 🚀 Features

- **Cross-platform**: iOS and Android support
- **TypeScript**: Full type safety and better developer experience
- **Modern UI**: Built with NativeWind (Tailwind CSS for React Native)
- **AI Integration**: Google Gemini AI for case summarization
- **Environment Management**: Multiple environment configurations
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## 📋 Prerequisites

Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Required Tools

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Java**: 17 (for Android development)
- **Xcode**: Latest version (for iOS development)
- **Android Studio**: Latest version (for Android development)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/acsdeveloper2025/CaseFlowMobileRN.git
   cd CaseFlowMobileRN
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install iOS dependencies** (iOS only)

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Configuration

### Environment Variables

The app uses environment-specific configuration files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Copy `.env.example` to `.env` and configure the required variables:

```bash
# Required
API_KEY=your_gemini_api_key_here
API_BASE_URL=https://your-api-url.com

# Optional
ENABLE_ANALYTICS=true
ENABLE_DEBUG_MODE=false
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete configuration details.

## 🏃‍♂️ Getting Started

### Development

1. **Start Metro bundler**

   ```bash
   npm start
   ```

2. **Run the app**

   **For Android:**

   ```bash
   # Development environment
   npm run android:dev

   # Staging environment
   npm run android:staging

   # Production environment
   npm run android:prod
   ```

   **For iOS:**

   ```bash
   # Development environment
   npm run ios:dev

   # Staging environment
   npm run ios:staging

   # Production environment
   npm run ios:prod
   ```

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔍 Code Quality

The project includes automated code quality checks:

```bash
# Lint code
npm run lint

# Format code
npx prettier --write .

# Type check
npx tsc --noEmit
```

### Pre-commit Hooks

The project uses Husky and lint-staged for pre-commit hooks that automatically:

- Run ESLint and fix issues
- Format code with Prettier
- Run type checking

## 🏗️ Building for Production

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
