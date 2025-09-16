import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/** 应用配置接口 */
export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  siteName: string;
  outputDir: string;
  templatesDir: string;
  defaultTheme: 'light' | 'dark';
  autoOpenBrowser: boolean;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
  };
}

/** 获取环境变量，支持默认值 */
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue!;
}

/** 获取环境变量数字值 */
function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  const parsed = value ? parseInt(value, 10) : defaultValue!;
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return parsed;
}

/** 获取环境变量布尔值 */
function getEnvBoolean(name: string, defaultValue?: boolean): boolean {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  if (!value) return defaultValue!;
  return value.toLowerCase() === 'true' || value === '1';
}

/** 验证NODE_ENV值 */
function validateNodeEnv(env: string): 'development' | 'production' | 'test' {
  if (['development', 'production', 'test'].includes(env)) {
    return env as 'development' | 'production' | 'test';
  }
  console.warn(`Invalid NODE_ENV: ${env}, falling back to 'development'`);
  return 'development';
}

// Export configuration
export const config: AppConfig = {
  nodeEnv: validateNodeEnv(getEnvVar('NODE_ENV', 'development')),
  siteName: getEnvVar('SITE_NAME', 'Oboe'),
  outputDir: getEnvVar('OUTPUT_DIR', './output'),
  templatesDir: getEnvVar('TEMPLATES_DIR', './templates'),
  defaultTheme: getEnvVar('DEFAULT_THEME', 'light') as 'light' | 'dark',
  autoOpenBrowser: getEnvBoolean('AUTO_OPEN_BROWSER', true),
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
    enableConsole: getEnvBoolean('ENABLE_CONSOLE_LOG', true),
  },
};

/** 日志工具 */
export class Logger {
  private static instance: Logger;
  private logLevel: 'debug' | 'info' | 'warn' | 'error';
  private enableConsole: boolean;

  private constructor() {
    this.logLevel = config.logging.level;
    this.enableConsole = config.logging.enableConsole;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex && this.enableConsole;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const env = config.nodeEnv.toUpperCase();
    return `[${timestamp}] [${env}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', `🔍 ${message}`));
    }
  }

  info(message: string): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', `ℹ️ ${message}`));
    }
  }

  warn(message: string): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', `⚠️ ${message}`));
    }
  }

  error(message: string): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', `❌ ${message}`));
    }
  }

  success(message: string): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', `✅ ${message}`));
    }
  }

  /** 本地开发环境专用日志 */
  dev(message: string): void {
    if (config.nodeEnv === 'development' && this.shouldLog('debug')) {
      console.log(this.formatMessage('dev', `🚀 ${message}`));
    }
  }

  /** 生产环境专用日志 */
  prod(message: string): void {
    if (config.nodeEnv === 'production' && this.shouldLog('info')) {
      console.log(this.formatMessage('prod', `🏭 ${message}`));
    }
  }
}

// Export singleton logger instance
export const logger = Logger.getInstance();

// Log configuration on startup (development only)
if (config.nodeEnv === 'development') {
  logger.dev('Configuration loaded:');
  logger.debug(`NODE_ENV: ${config.nodeEnv}`);
  logger.debug(`Site Name: ${config.siteName}`);
  logger.debug(`Output Directory: ${config.outputDir}`);
  logger.debug(`Templates Directory: ${config.templatesDir}`);
  logger.debug(`Default Theme: ${config.defaultTheme}`);
  logger.debug(`Auto Open Browser: ${config.autoOpenBrowser}`);
  logger.debug(`Log Level: ${config.logging.level}`);
}