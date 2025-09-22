import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "../../common/components/Button";

/**
 * Error boundary component for handling routing errors
 * Displays user-friendly error messages with recovery options
 */
export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = "Unknown Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-red-600" />
        </div>

        {/* Error Status */}
        <h1 className="text-h1 font-semibold text-text-primary mb-2">
          {errorStatus}
        </h1>

        {/* Error Message */}
        <p className="text-body text-text-secondary mb-8 leading-relaxed">
          {errorMessage}
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && error instanceof Error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Error Details:
            </h3>
            <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
              {error.stack}
            </pre>
          </div>
        )}

        {/* Recovery Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            onClick={handleRefresh}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={Home}
            onClick={handleGoHome}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-caption text-text-muted mt-6">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};
