import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
      state = { hasError: false, error: null }

      static getDerivedStateFromError(error) {
            return { hasError: true, error }
      }

      componentDidCatch(error, info) {
            console.error('[e-Samadhan AI] Render error:', error, info.componentStack)
      }

      render() {
            if (this.state.hasError) {
                  return (
                        <div style={{
                              minHeight: '100vh', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', padding: '24px',
                              background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
                              fontFamily: 'Inter, system-ui, sans-serif',
                        }}>
                              <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                                    <div style={{
                                          width: '72px', height: '72px', borderRadius: '20px',
                                          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          margin: '0 auto 24px', fontSize: '32px',
                                    }}>⚡</div>
                                    <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1e293b', margin: '0 0 8px' }}>
                                          e-Samadhan AI
                                    </h1>
                                    <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>
                                          Something went wrong while loading the page. Please refresh to try again.
                                    </p>
                                    <details style={{
                                          textAlign: 'left', background: '#f8fafc', padding: '16px',
                                          borderRadius: '12px', fontSize: '12px', color: '#94a3b8',
                                          marginBottom: '24px', border: '1px solid #e2e8f0',
                                    }}>
                                          <summary style={{ cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
                                                Error details
                                          </summary>
                                          <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto' }}>
                                                {this.state.error?.toString()}
                                          </pre>
                                    </details>
                                    <button
                                          onClick={() => window.location.reload()}
                                          style={{
                                                padding: '14px 32px',
                                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                                color: 'white', border: 'none', borderRadius: '14px',
                                                fontWeight: 700, cursor: 'pointer', fontSize: '15px',
                                                boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
                                          }}
                                    >
                                          Reload Page
                                    </button>
                              </div>
                        </div>
                  )
            }
            return this.props.children
      }
}

ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
            <ErrorBoundary>
                  <App />
            </ErrorBoundary>
      </React.StrictMode>
)
