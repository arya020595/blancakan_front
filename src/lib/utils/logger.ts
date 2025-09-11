/**
 * Logger Interface and Implementations
 * Follows Single Responsibility Principle - each logger has one purpose
 */

export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

export class ConsoleLogger implements ILogger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  info(message: string, meta?: any): void {
    console.log(`ℹ️ [${this.prefix}] ${message}`, meta || "");
  }

  error(message: string, error?: any): void {
    console.error(`❌ [${this.prefix}] ${message}`, error || "");
  }

  warn(message: string, meta?: any): void {
    console.warn(`⚠️ [${this.prefix}] ${message}`, meta || "");
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(`🔍 [${this.prefix}] ${message}`, meta || "");
    }
  }
}

export class NoOpLogger implements ILogger {
  info(): void {}
  error(): void {}
  warn(): void {}
  debug(): void {}
}

export const createLogger = (prefix: string): ILogger => {
  return process.env.NODE_ENV === "development"
    ? new ConsoleLogger(prefix)
    : new NoOpLogger();
};
