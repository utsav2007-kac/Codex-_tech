import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50 text-slate-800">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold font-heading text-navy-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            An unexpected error occurred while loading this section.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
