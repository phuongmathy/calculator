import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRule } from '../../context/RuleContext';
import {
  TRIGGER_EVENTS,
  ORGANIZATION_ATTRIBUTES,
  ASSESSMENT_ATTRIBUTES,
} from '../../data/attributes';

const ALL_ATTRIBUTES = [
  ...ORGANIZATION_ATTRIBUTES.map((a) => ({ ...a, category: 'organization' })),
  ...ASSESSMENT_ATTRIBUTES.map((a) => ({ ...a, category: 'assessment' })),
];

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <div
        className="card fade-in"
        style={{ padding: '24px', maxWidth: 400, width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 20 }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule }) {
  const navigate = useNavigate();
  const { editRule, deleteRule, toggleRule } = useRule();
  const [showDelete, setShowDelete] = useState(false);
  const trigger = TRIGGER_EVENTS.find((t) => t.key === rule.triggerEvent);
  const validSubRules = rule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );
  const totalAssignees = new Set(
    validSubRules.flatMap((sr) => (rule.assignments[sr.id] || []).map((a) => a.id))
  ).size;

  function handleEdit() {
    editRule(rule.id);
    navigate('/create');
  }

  function handleDelete() {
    deleteRule(rule.id);
    setShowDelete(false);
  }

  return (
    <>
      <div
        className="card slide-in"
        style={{
          padding: 0,
          overflow: 'hidden',
          opacity: rule.isEnabled ? 1 : 0.65,
          transition: 'opacity var(--transition-normal)',
        }}
      >
        <div style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
                  {rule.name}
                </h3>
                <span
                  className={`badge ${rule.isEnabled ? 'badge-success' : 'badge-gray'}`}
                  style={{ fontSize: '0.6875rem' }}
                >
                  {rule.isEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              {rule.description && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginBottom: 8 }}>
                  {rule.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {trigger && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {trigger.label}
                  </span>
                )}
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {validSubRules.length} sub-rule{validSubRules.length !== 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {totalAssignees} assignee{totalAssignees !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => toggleRule(rule.id)}
                title={rule.isEnabled ? 'Disable rule' : 'Enable rule'}
              >
                {rule.isEnabled ? (
                  <svg width="18" height="18" fill="none" stroke="var(--color-success)" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button className="btn btn-ghost btn-icon" onClick={handleEdit} title="Edit rule">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowDelete(true)}
                title="Delete rule"
                style={{ color: 'var(--color-danger)' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Preview sub-rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {validSubRules.slice(0, 3).map((sr, i) => {
              const conditions = sr.conditions
                .filter((c) => c.attributeKey && c.values.length > 0)
                .map((c) => {
                  const attr = ALL_ATTRIBUTES.find((a) => a.key === c.attributeKey);
                  return `${attr ? attr.label : c.attributeKey}: ${c.values.join(', ')}`;
                });
              const assignees = rule.assignments[sr.id] || [];
              return (
                <div
                  key={sr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    background: 'var(--color-gray-50)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                  }}
                >
                  {i > 0 && (
                    <span className="badge badge-primary" style={{ fontSize: '0.5625rem', fontWeight: 700 }}>
                      OR
                    </span>
                  )}
                  <span style={{ color: 'var(--color-gray-600)', flex: 1 }}>
                    {conditions.join(' & ') || 'No conditions'}
                  </span>
                  <svg width="14" height="14" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>
                    {assignees.map((a) => a.name).join(', ') || 'No assignees'}
                  </span>
                </div>
              );
            })}
            {validSubRules.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', paddingLeft: 10 }}>
                +{validSubRules.length - 3} more sub-rule{validSubRules.length - 3 > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {rule.createdAt && (
          <div
            style={{
              borderTop: '1px solid var(--color-gray-100)',
              padding: '8px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--color-gray-400)',
            }}
          >
            <span>Created {new Date(rule.createdAt).toLocaleDateString()}</span>
            {rule.updatedAt && (
              <span>Updated {new Date(rule.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Delete Rule"
          message={`Are you sure you want to delete "${rule.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

export default function RuleList() {
  const navigate = useNavigate();
  const { state, resetCurrent } = useRule();
  const { savedRules } = state;
  const [filter, setFilter] = useState('all');

  const filteredRules =
    filter === 'all'
      ? savedRules
      : filter === 'active'
      ? savedRules.filter((r) => r.isEnabled)
      : savedRules.filter((r) => !r.isEnabled);

  function handleCreate() {
    resetCurrent();
    navigate('/create');
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>
            Auto-Assign Rules
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: 4 }}>
            Manage rule-based auto-assignment for assessments and CAPAs
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New Rule
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'active', 'disabled'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && ` (${savedRules.length})`}
            {f === 'active' && ` (${savedRules.filter((r) => r.isEnabled).length})`}
            {f === 'disabled' && ` (${savedRules.filter((r) => !r.isEnabled).length})`}
          </button>
        ))}
      </div>

      {/* Rule List */}
      {filteredRules.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--color-primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="28" height="28" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: 8 }}>
            {savedRules.length === 0 ? 'No rules yet' : 'No matching rules'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginBottom: 20 }}>
            {savedRules.length === 0
              ? 'Create your first auto-assign rule to automatically route assessments to the right team members.'
              : 'Try changing the filter to see other rules.'}
          </p>
          {savedRules.length === 0 && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Create First Rule
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredRules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
