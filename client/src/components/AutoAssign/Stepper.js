import React from 'react';

const STEPS = [
  { label: 'Define Sub-Rules', description: 'Set conditions with OR/AND logic' },
  { label: 'Assign Members', description: 'Map assignees to each sub-rule' },
  { label: 'Review & Submit', description: 'Verify and save your rule' },
];

export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '0 8px',
      }}
    >
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        const isClickable = i <= currentStep;

        return (
          <React.Fragment key={i}>
            <button
              onClick={() => isClickable && onStepClick(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                background: isActive ? 'var(--color-primary-50)' : 'transparent',
                border: isActive ? '1px solid var(--color-primary-light)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                cursor: isClickable ? 'pointer' : 'default',
                opacity: !isClickable && !isActive ? 0.5 : 1,
                transition: 'all var(--transition-fast)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                  background: isCompleted
                    ? 'var(--color-success)'
                    : isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-200)',
                  color: isCompleted || isActive ? 'white' : 'var(--color-gray-500)',
                  transition: 'all var(--transition-normal)',
                }}
              >
                {isCompleted ? (
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-gray-700)' : 'var(--color-gray-500)',
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-400)', lineHeight: 1.3, marginTop: 1 }}>
                  {step.description}
                </div>
              </div>
            </button>

            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  minWidth: 32,
                  background: isCompleted ? 'var(--color-success)' : 'var(--color-gray-200)',
                  borderRadius: 1,
                  transition: 'background var(--transition-normal)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
