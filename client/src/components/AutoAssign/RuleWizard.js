import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRule } from '../../context/RuleContext';
import Stepper from './Stepper';
import StepSubRules from './StepSubRules';
import StepAssignees from './StepAssignees';
import StepReview from './StepReview';

const STEP_COMPONENTS = [StepSubRules, StepAssignees, StepReview];

export default function RuleWizard() {
  const navigate = useNavigate();
  const { state, setStep, saveRule, resetCurrent } = useRule();
  const { currentStep, currentRule, isEditing } = state;
  const [showSuccess, setShowSuccess] = useState(false);

  const StepComponent = STEP_COMPONENTS[currentStep];

  const canProceedStep0 = currentRule.name.trim() && currentRule.triggerEvent;
  const validSubRules = currentRule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );
  const canProceedStep1 = validSubRules.length > 0 &&
    validSubRules.some((sr) => (currentRule.assignments[sr.id] || []).length > 0);

  const canProceed = currentStep === 0 ? canProceedStep0 : currentStep === 1 ? true : true;

  function handleNext() {
    if (currentStep < 2) {
      setStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  }

  function handleSubmit() {
    saveRule();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/');
    }, 2000);
  }

  function handleCancel() {
    resetCurrent();
    navigate('/');
  }

  if (showSuccess) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="36" height="36" fill="none" stroke="var(--color-success)" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: 8 }}>
            Rule {isEditing ? 'Updated' : 'Created'} Successfully!
          </h2>
          <p style={{ color: 'var(--color-gray-500)' }}>
            Redirecting to rule management...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleCancel}
          style={{ marginBottom: 12, color: 'var(--color-gray-500)' }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Rules
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
          {isEditing ? 'Edit Auto-Assign Rule' : 'Create New Auto-Assign Rule'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: 4 }}>
          Configure attribute-based rules to automatically assign members to assessments and CAPAs.
        </p>
      </div>

      {/* Stepper */}
      <div className="card" style={{ padding: '16px', marginBottom: 24 }}>
        <Stepper currentStep={currentStep} onStepClick={(s) => s <= currentStep && setStep(s)} />
      </div>

      {/* Step Content */}
      <div style={{ marginBottom: 24 }}>
        <StepComponent />
      </div>

      {/* Navigation */}
      <div
        className="card"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          bottom: 16,
          zIndex: 30,
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          {currentStep > 0 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>
          )}
          {currentStep < 2 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canProceed}
            >
              Next Step
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ background: 'var(--color-success)', gap: 8 }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isEditing ? 'Update Rule' : 'Submit Rule'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
