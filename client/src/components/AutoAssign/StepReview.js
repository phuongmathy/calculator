import React from 'react';
import { useRule } from '../../context/RuleContext';
import {
  ORGANIZATION_ATTRIBUTES,
  ASSESSMENT_ATTRIBUTES,
  TRIGGER_EVENTS,
} from '../../data/attributes';

const ALL_ATTRIBUTES = [
  ...ORGANIZATION_ATTRIBUTES.map((a) => ({ ...a, category: 'organization' })),
  ...ASSESSMENT_ATTRIBUTES.map((a) => ({ ...a, category: 'assessment' })),
];

function formatCondition(cond) {
  const attr = ALL_ATTRIBUTES.find((a) => a.key === cond.attributeKey);
  const label = attr ? attr.label : cond.attributeKey;
  const opMap = { equals: 'equals', not_equals: 'does not equal', contains: 'contains' };
  return { label, operator: opMap[cond.operator] || cond.operator, values: cond.values };
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>{title}</h3>
    </div>
  );
}

function AssigneeBadge({ assignee }) {
  const isGroup = assignee.type === 'group';
  return (
    <span
      className={`badge ${isGroup ? 'badge-warning' : 'badge-success'}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
    >
      {isGroup && (
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {assignee.name}
    </span>
  );
}

export default function StepReview() {
  const { state } = useRule();
  const { currentRule } = state;
  const trigger = TRIGGER_EVENTS.find((t) => t.key === currentRule.triggerEvent);

  const validSubRules = currentRule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );

  const hasAssignments = validSubRules.some(
    (sr) => (currentRule.assignments[sr.id] || []).length > 0
  );
  const hasFallback = currentRule.fallbackAssignees.length > 0;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Validation Alerts */}
      {(!hasAssignments && !hasFallback) && (
        <div
          style={{
            background: 'var(--color-danger-light)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg width="18" height="18" fill="none" stroke="var(--color-danger)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>
            No assignees configured. Go back to Step 2 to assign users or groups.
          </span>
        </div>
      )}

      {/* General Info */}
      <div className="card" style={{ padding: '24px' }}>
        <SectionHeader
          icon={
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="General Information"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            gap: '10px 20px',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Rule Name</span>
          <span style={{ fontWeight: 500 }}>{currentRule.name || '(not set)'}</span>
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Trigger Event</span>
          <span>
            {trigger ? (
              <span className="badge badge-primary">{trigger.label}</span>
            ) : (
              '(not set)'
            )}
          </span>
          {currentRule.description && (
            <>
              <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Description</span>
              <span style={{ color: 'var(--color-gray-600)' }}>{currentRule.description}</span>
            </>
          )}
        </div>
      </div>

      {/* Sub-Rules & Assignments */}
      <div className="card" style={{ padding: '24px' }}>
        <SectionHeader
          icon={
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Rules & Assignments"
        />

        {validSubRules.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--color-gray-400)',
              background: 'var(--color-gray-50)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            No sub-rules with conditions defined.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {validSubRules.map((sr, i) => {
              const assignees = currentRule.assignments[sr.id] || [];
              const conditions = sr.conditions.filter(
                (c) => c.attributeKey && c.values.length > 0
              );
              return (
                <div
                  key={sr.id}
                  className="slide-in"
                  style={{
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    style={{
                      background: 'var(--color-gray-50)',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--color-gray-200)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-primary" style={{ fontWeight: 600 }}>
                        Sub-rule {i + 1}
                      </span>
                      {sr.name && (
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{sr.name}</span>
                      )}
                      {i > 0 && (
                        <span className="badge badge-gray" style={{ fontSize: '0.625rem', fontWeight: 700, marginLeft: 4 }}>
                          OR
                        </span>
                      )}
                    </div>
                    {assignees.length > 0 ? (
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        {assignees.length} assignee{assignees.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                        No assignees
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ marginBottom: 12 }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        When
                      </span>
                      <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {conditions.map((cond, j) => {
                          const fmt = formatCondition(cond);
                          return (
                            <div key={cond.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {j > 0 && (
                                <span className="badge badge-warning" style={{ fontSize: '0.625rem', fontWeight: 700 }}>
                                  AND
                                </span>
                              )}
                              <span style={{ fontSize: '0.8125rem' }}>
                                <strong>{fmt.label}</strong>{' '}
                                <span style={{ color: 'var(--color-gray-500)' }}>{fmt.operator}</span>{' '}
                                {fmt.values.map((v, k) => (
                                  <React.Fragment key={k}>
                                    {k > 0 && <span style={{ color: 'var(--color-gray-400)' }}>, </span>}
                                    <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                                      {v}
                                    </span>
                                  </React.Fragment>
                                ))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-gray-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Then assign to
                      </span>
                      <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {assignees.length > 0 ? (
                          assignees.map((a) => <AssigneeBadge key={a.id} assignee={a} />)
                        ) : (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
                            No assignees selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fallback */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderLeft: `4px solid ${hasFallback ? 'var(--color-success)' : 'var(--color-warning)'}`,
        }}
      >
        <SectionHeader
          icon={
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Fallback (ELSE) Assignment"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {hasFallback ? (
            currentRule.fallbackAssignees.map((a) => <AssigneeBadge key={a.id} assignee={a} />)
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
              No fallback assignees — assessments may be left unassigned if no sub-rule matches.
            </span>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {validSubRules.length}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Sub-Rules</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {new Set(
              validSubRules.flatMap((sr) =>
                (currentRule.assignments[sr.id] || []).map((a) => a.id)
              )
            ).size}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Unique Assignees</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-warning)' }}>
            {validSubRules.reduce(
              (sum, sr) =>
                sum + sr.conditions.filter((c) => c.attributeKey && c.values.length > 0).length,
              0
            )}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Total Conditions</div>
        </div>
      </div>
    </div>
  );
}
