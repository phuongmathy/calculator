import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RuleProvider } from '../context/RuleContext';
import RuleList from './AutoAssign/RuleList';
import RuleWizard from './AutoAssign/RuleWizard';

export default function App() {
  return (
    <BrowserRouter>
      <RuleProvider>
        <div style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
          {/* Top nav bar */}
          <header
            style={{
              background: 'white',
              borderBottom: '1px solid var(--color-gray-200)',
              padding: '0 24px',
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 40,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-gray-800)' }}>
                Inspectorio
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-gray-400)',
                  borderLeft: '1px solid var(--color-gray-200)',
                  paddingLeft: 12,
                  marginLeft: 4,
                }}
              >
                Auto-Assign Configuration
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                BA
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-gray-700)' }}>
                Brand Admin
              </span>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<RuleList />} />
            <Route path="/create" element={<RuleWizard />} />
          </Routes>
        </div>
      </RuleProvider>
    </BrowserRouter>
  );
}
