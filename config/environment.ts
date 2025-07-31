import Config from 'react-native-config';

export interface AppConfig {
  // App Configuration
  NODE_ENV: string;
  APP_VERSION: string;
  APP_NAME: string;

  // API Configuration
  API_KEY: string;
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // Authentication
  JWT_SECRET?: string;
  OAUTH_CLIENT_ID?: string;
  OAUTH_CLIENT_SECRET?: string;

  // Database
  DATABASE_URL?: string;

  // Third-party Services
  ANALYTICS_KEY?: string;
  CRASHLYTICS_KEY?: string;
  FCM_SERVER_KEY?: string;

  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  ENABLE_PUSH_NOTIFICATIONS: boolean;
  ENABLE_DEBUG_MODE: boolean;

  // Build Configuration
  CODEPUSH_DEPLOYMENT_KEY_ANDROID?: string;
  CODEPUSH_DEPLOYMENT_KEY_IOS?: string;
  BUNDLE_ID: string;
  PACKAGE_NAME: string;
}

class EnvironmentConfig {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AppConfig {
    return {
      // App Configuration
      NODE_ENV: Config.NODE_ENV || 'development',
      APP_VERSION: Config.APP_VERSION || '1.0.0',
      APP_NAME: Config.APP_NAME || 'CaseFlow Mobile',

      // API Configuration
      API_KEY: Config.API_KEY || '',
      API_BASE_URL: Config.API_BASE_URL || 'http://localhost:3000',
      API_TIMEOUT: parseInt(Config.API_TIMEOUT || '30000', 10),

      // Authentication
      JWT_SECRET: Config.JWT_SECRET,
      OAUTH_CLIENT_ID: Config.OAUTH_CLIENT_ID,
      OAUTH_CLIENT_SECRET: Config.OAUTH_CLIENT_SECRET,

      // Database
      DATABASE_URL: Config.DATABASE_URL,

      // Third-party Services
      ANALYTICS_KEY: Config.ANALYTICS_KEY,
      CRASHLYTICS_KEY: Config.CRASHLYTICS_KEY,
      FCM_SERVER_KEY: Config.FCM_SERVER_KEY,

      // Feature Flags
      ENABLE_ANALYTICS: Config.ENABLE_ANALYTICS === 'true',
      ENABLE_CRASH_REPORTING: Config.ENABLE_CRASH_REPORTING === 'true',
      ENABLE_PUSH_NOTIFICATIONS: Config.ENABLE_PUSH_NOTIFICATIONS === 'true',
      ENABLE_DEBUG_MODE: Config.ENABLE_DEBUG_MODE === 'true',

      // Build Configuration
      CODEPUSH_DEPLOYMENT_KEY_ANDROID: Config.CODEPUSH_DEPLOYMENT_KEY_ANDROID,
      CODEPUSH_DEPLOYMENT_KEY_IOS: Config.CODEPUSH_DEPLOYMENT_KEY_IOS,
      BUNDLE_ID: Config.BUNDLE_ID || 'com.caseflowmobilern',
      PACKAGE_NAME: Config.PACKAGE_NAME || 'com.caseflowmobilern',
    };
  }

  private validateConfig(): void {
    const requiredFields = ['API_KEY'];
    const missingFields = requiredFields.filter(
      field => !this.config[field as keyof AppConfig],
    );

    if (missingFields.length > 0) {
      console.warn(
        `Missing required environment variables: ${missingFields.join(', ')}`,
      );

      // In development, we can be more lenient
      if (this.config.NODE_ENV === 'production') {
        throw new Error(
          `Missing required environment variables: ${missingFields.join(', ')}`,
        );
      }
    }
  }

  public get(): AppConfig {
    return this.config;
  }

  public getApiKey(): string {
    if (!this.config.API_KEY) {
      throw new Error('API_KEY environment variable is not set.');
    }
    return this.config.API_KEY;
  }

  public getApiBaseUrl(): string {
    return this.config.API_BASE_URL;
  }

  public isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  public isStaging(): boolean {
    return this.config.NODE_ENV === 'staging';
  }

  public isFeatureEnabled(
    feature: keyof Pick<
      AppConfig,
      | 'ENABLE_ANALYTICS'
      | 'ENABLE_CRASH_REPORTING'
      | 'ENABLE_PUSH_NOTIFICATIONS'
      | 'ENABLE_DEBUG_MODE'
    >,
  ): boolean {
    return this.config[feature];
  }
}

// Export singleton instance
export const environment = new EnvironmentConfig();
export default environment;
