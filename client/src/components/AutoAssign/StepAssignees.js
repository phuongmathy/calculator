import React, { useState, useRef, useEffect } from 'react';
import { useRule } from '../../context/RuleContext';
import {
  ORGANIZATION_ATTRIBUTES,
  ASSESSMENT_ATTRIBUTES,
  MOCK_USERS,
  MOCK_USER_GROUPS,
} from '../../data/attributes';

const ALL_ATTRIBUTES = [
  ...ORGANIZATION_ATTRIBUTES.map((a) => ({ ...a, category: 'organization' })),
  ...ASSESSMENT_ATTRIBUTES.map((a) => ({ ...a, category: 'assessment' })),
];

function AssigneePicker({ selected, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('users');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentAssignees = selected || [];

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) &&
      !currentAssignees.some((a) => a.id === u.id)
  );
  const filteredGroups = MOCK_USER_GROUPS.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) &&
      !currentAssignees.some((a) => a.id === g.id)
  );

  const addAssignee = (item, type) => {
    onChange([...currentAssignees, { ...item, type }]);
    setSearch('');
  };

  const removeAssignee = (id) => {
    onChange(currentAssignees.filter((a) => a.id !== id));
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          minHeight: 38,
          border: '1px solid var(--color-gray-300)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          alignItems: 'center',
          cursor: 'pointer',
          background: 'white',
        }}
      >
        {currentAssignees.length === 0 && (
          <span style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem' }}>
            {label || 'Assign users or groups...'}
          </span>
        )}
        {currentAssignees.map((a) => (
          <span
            key={a.id}
            className={`badge ${a.type === 'group' ? 'badge-warning' : 'badge-success'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            {a.type === 'group' && (
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {a.name}
            <button
              onClick={(e) => { e.stopPropagation(); removeAssignee(a.id); }}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 1, fontSize: '0.875rem', color: 'inherit' }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid var(--color-gray-100)' }}>
            <input
              type="text"
              placeholder="Search users or groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: '1px solid var(--color-gray-200)', fontSize: '0.8125rem' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-gray-100)' }}>
            <button
              onClick={() => setTab('users')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: tab === 'users' ? 'var(--color-primary-50)' : 'transparent',
                color: tab === 'users' ? 'var(--color-primary)' : 'var(--color-gray-500)',
                borderBottom: tab === 'users' ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              Users ({filteredUsers.length})
            </button>
            <button
              onClick={() => setTab('groups')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: tab === 'groups' ? 'var(--color-primary-50)' : 'transparent',
                color: tab === 'groups' ? 'var(--color-primary)' : 'var(--color-gray-500)',
                borderBottom: tab === 'groups' ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              Groups ({filteredGroups.length})
            </button>
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {tab === 'users' &&
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => addAssignee(u, 'user')}
                  style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {u.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>{u.role}</div>
                  </div>
                </div>
              ))}
            {tab === 'groups' &&
              filteredGroups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => addAssignee(g, 'group')}
                  style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-gray-50)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--color-warning-light)',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{g.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>{g.memberCount} members</div>
                  </div>
                </div>
              ))}
            {((tab === 'users' && filteredUsers.length === 0) ||
              (tab === 'groups' && filteredGroups.length === 0)) && (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-gray-400)', fontSize: '0.8125rem' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function summarizeConditions(conditions) {
  return conditions
    .filter((c) => c.attributeKey && c.values.length > 0)
    .map((c) => {
      const attr = ALL_ATTRIBUTES.find((a) => a.key === c.attributeKey);
      const label = attr ? attr.label : c.attributeKey;
      const op = c.operator === 'not_equals' ? '≠' : c.operator === 'contains' ? '∋' : '=';
      return `${label} ${op} ${c.values.join(', ')}`;
    });
}

export default function StepAssignees() {
  const { state, setAssignment, setFallbackAssignees } = useRule();
  const { currentRule } = state;

  const validSubRules = currentRule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: 'var(--color-gray-800)' }}>
          Assign Members per Sub-Rule
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginBottom: 20 }}>
          For each sub-rule, specify which users or groups should be auto-assigned when the conditions match.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 16px', background: 'var(--color-gray-50)', borderBottom: '2px solid var(--color-gray-200)', fontWeight: 600, color: 'var(--color-gray-600)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                  Sub-Rule
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', background: 'var(--color-gray-50)', borderBottom: '2px solid var(--color-gray-200)', fontWeight: 600, color: 'var(--color-gray-600)', fontSize: '0.8125rem' }}>
                  Conditions Summary
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', background: 'var(--color-gray-50)', borderBottom: '2px solid var(--color-gray-200)', fontWeight: 600, color: 'var(--color-gray-600)', fontSize: '0.8125rem', minWidth: 300 }}>
                  Assignees
                </th>
              </tr>
            </thead>
            <tbody>
              {validSubRules.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: '40px 16px',
                      textAlign: 'center',
                      color: 'var(--color-gray-400)',
                      background: 'var(--color-gray-50)',
                    }}
                  >
                    <div>
                      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px', color: 'var(--color-gray-300)' }}>
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p style={{ fontWeight: 500 }}>No valid sub-rules yet</p>
                      <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>
                        Go back to Step 1 and add conditions with selected values.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                validSubRules.map((sr, i) => {
                  const conditions = summarizeConditions(sr.conditions);
                  return (
                    <tr key={sr.id} className="slide-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <td
                        style={{
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--color-gray-100)',
                          verticalAlign: 'top',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span className="badge badge-primary" style={{ fontWeight: 600 }}>
                          #{i + 1}
                        </span>
                        {sr.name && (
                          <span style={{ marginLeft: 8, fontWeight: 500, color: 'var(--color-gray-700)' }}>
                            {sr.name}
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--color-gray-100)',
                          verticalAlign: 'top',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {conditions.map((cond, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {j > 0 && (
                                <span className="badge badge-warning" style={{ fontSize: '0.625rem', fontWeight: 700 }}>
                                  AND
                                </span>
                              )}
                              <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)' }}>
                                {cond}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--color-gray-100)',
                          verticalAlign: 'top',
                        }}
                      >
                        <AssigneePicker
                          selected={currentRule.assignments[sr.id] || []}
                          onChange={(assignees) => setAssignment(sr.id, assignees)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fallback */}
      <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--color-warning)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <svg width="20" height="20" fill="none" stroke="var(--color-warning)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
            Fallback Assignment (ELSE)
          </h3>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginBottom: 12 }}>
          If no sub-rule matches, these assignees will be used as a fallback so no assessment is left unassigned.
        </p>
        <AssigneePicker
          selected={currentRule.fallbackAssignees}
          onChange={(assignees) => setFallbackAssignees(assignees)}
          label="Select fallback assignees..."
        />
      </div>
    </div>
  );
}
