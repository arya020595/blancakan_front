/**
 * Error Boundary Component for Optimistic Updates
 * Provides graceful error handling at the page/component level
 */

"use client";

import { createLogger } from "@/lib/utils/logger";
import React, { ErrorInfo, ReactNode } from "react";

const logger = createLogger("ERROR BOUNDARY");

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorId: string, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: "page" | "component" | "section";
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    const errorId = `error-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for monitoring
    logger.error("Error boundary caught an error", {
      error: error.message,
      stack: error.stack,
      errorInfo,
      level: this.props.level || "component",
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({
      errorInfo,
    });
  }

  retry = () => {
    logger.info("Error boundary retry triggered");
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: "",
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorId,
          this.retry
        );
      }

      // Default fallback UI based on level
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorId={this.state.errorId}
          level={this.props.level || "component"}
          onRetry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
  error: Error;
  errorId: string;
  level: "page" | "component" | "section";
  onRetry: () => void;
}

function DefaultErrorFallback({
  error,
  errorId,
  level,
  onRetry,
}: DefaultErrorFallbackProps) {
  const isProduction = process.env.NODE_ENV === "production";

  const getLevelStyles = () => {
    switch (level) {
      case "page":
        return "min-h-screen flex items-center justify-center bg-gray-50";
      case "section":
        return "p-8 bg-gray-50 rounded-lg";
      default:
        return "p-4 bg-red-50 border border-red-200 rounded-md";
    }
  };

  const getErrorMessage = () => {
    if (isProduction) {
      return "Something went wrong. Please try again.";
    }
    return error.message || "An unexpected error occurred.";
  };

  return (
    <div className={getLevelStyles()}>
      <div className="text-center max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {level === "page" ? "Page Error" : "Something went wrong"}
        </h3>

        {/* Error Message */}
        <p className="text-sm text-gray-600 mb-6">{getErrorMessage()}</p>

        {/* Development Info */}
        {!isProduction && (
          <details className="text-left mb-6 p-3 bg-gray-100 rounded text-xs">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Error Details (Development)
            </summary>
            <div className="space-y-2">
              <div>
                <strong>Error ID:</strong> {errorId}
              </div>
              <div>
                <strong>Message:</strong> {error.message}
              </div>
              <div>
                <strong>Stack:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-xs text-gray-600">
                  {error.stack}
                </pre>
              </div>
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Try Again
          </button>

          {level === "page" && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Reload Page
            </button>
          )}
        </div>

        {/* Report Link */}
        {isProduction && (
          <div className="mt-4">
            <a
              href={`mailto:support@yourapp.com?subject=Error Report&body=Error ID: ${errorId}`}
              className="text-sm text-indigo-600 hover:text-indigo-500">
              Report this issue
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// HOC for easy error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryClass {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Main error boundary export
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => (
  <ErrorBoundaryClass {...props} />
);

// Specialized error boundaries for different use cases
export const PageErrorBoundary: React.FC<Omit<ErrorBoundaryProps, "level">> = (
  props
) => <ErrorBoundary {...props} level="page" />;

export const ComponentErrorBoundary: React.FC<
  Omit<ErrorBoundaryProps, "level">
> = (props) => <ErrorBoundary {...props} level="component" />;

export const SectionErrorBoundary: React.FC<
  Omit<ErrorBoundaryProps, "level">
> = (props) => <ErrorBoundary {...props} level="section" />;

export default ErrorBoundary;
