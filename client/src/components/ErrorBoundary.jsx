import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Jeevan Raksha ErrorBoundary Caught Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: 'var(--bg-light)'
        }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <AlertTriangle size={30} />
            </div>
            
            <h2 style={{ fontSize: '1.4rem', color: 'var(--secondary-navy)', marginBottom: '0.5rem' }}>
              Interface Temporary Recovery
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              An interface rendering error was safely caught. In an actual medical emergency, please dial <strong>108</strong> immediately.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: '#6B7280',
                textAlign: 'left',
                marginBottom: '1.5rem',
                fontFamily: 'monospace',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn btn-primary btn-sm"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <a href="/" className="btn btn-outline btn-sm">
                <Home size={14} />
                <span>Go to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
