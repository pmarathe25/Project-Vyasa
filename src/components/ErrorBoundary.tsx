import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Alert variant="danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h4>Something went wrong</h4>
            <p style={{ fontSize: 'var(--secondary-font-size)', color: 'var(--text-secondary)' }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <details style={{ textAlign: 'left', marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
              <pre style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: 'var(--code-background)',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                maxHeight: '200px',
              }}>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <Button variant="primary" onClick={this.handleRetry} style={{ marginTop: '15px' }}>
              Try Again
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;