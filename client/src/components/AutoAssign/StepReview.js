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

const BADGE_COLORS = {
  country: { bg: '#dbeafe', color: '#1e40af' },
  tier: { bg: '#fef3c7', color: '#92400e' },
  region: { bg: '#e0e7ff', color: '#4338ca' },
  factoryStatus: { bg: '#d1fae5', color: '#065f46' },
  businessPartner: { bg: '#fce7f3', color: '#9d174d' },
  productCategory: { bg: '#ede9fe', color: '#5b21b6' },
  scheme: { bg: '#dbeafe', color: '#1d4ed8' },
  rating: { bg: '#fef2f2', color: '#dc2626' },
  status: { bg: '#d1fae5', color: '#065f46' },
  auditType: { bg: '#e0e7ff', color: '#4f46e5' },
  standard: { bg: '#fef3c7', color: '#b45309' },
};

const RATING_COLORS = {
  'Acceptable': { bg: '#d1fae5', color: '#065f46' },
  'Needs Improvement': { bg: '#fef3c7', color: '#92400e' },
  'Probation': { bg: '#fed7aa', color: '#c2410c' },
  'Immediate Resolution': { bg: '#fecaca', color: '#dc2626' },
  'Not Rated': { bg: '#f3f4f6', color: '#6b7280' },
};

const STATUS_COLORS = {
  'Submitted': { bg: '#dbeafe', color: '#1d4ed8' },
  'Completed': { bg: '#d1fae5', color: '#065f46' },
  'Created': { bg: '#f3f4f6', color: '#6b7280' },
  'In Progress': { bg: '#fef3c7', color: '#92400e' },
  'Cancelled': { bg: '#fecaca', color: '#dc2626' },
  'CAPA Submitted': { bg: '#ede9fe', color: '#7c3aed' },
};

const MOCK_ORG_NAMES = {
  'Vietnam': ['Win Sheng Garment Co.', 'Hanoi Textile Manufacturing', 'Saigon Apparel Ltd.'],
  'China': ['Ningbo Brother Apparel', 'Shanghai Weaving Co.', 'Guangzhou Textile Inc.'],
  'Bangladesh': ['Dhaka Garments Ltd.', 'Chittagong Textile Co.'],
  'India': ['Mumbai Fabrics Ltd.', 'Delhi Cotton Works'],
  'Cambodia': ['Phnom Penh Apparel Co.', 'Siem Reap Garments Ltd.'],
  'Indonesia': ['Jakarta Textile Corp.', 'Surabaya Manufacturing Co.'],
};

const AVATAR_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#0d9488'];

function AttrBadge({ attrKey, value }) {
  let c = BADGE_COLORS[attrKey] || { bg: '#f3f4f6', color: '#4b5563' };
  if (attrKey === 'rating' && RATING_COLORS[value]) c = RATING_COLORS[value];
  if (attrKey === 'status' && STATUS_COLORS[value]) c = STATUS_COLORS[value];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 9999, fontSize: '.75rem', fontWeight: 500, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>
      {value}
    </span>
  );
}

function buildAssigneeView(currentRule) {
  const vs = currentRule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );
  const map = {};

  vs.forEach((sr, idx) => {
    const assignees = currentRule.assignments[sr.id] || [];
    const orgConds = sr.conditions.filter((c) => c.attributeKey && c.values.length > 0 && ALL_ATTRIBUTES.find((a) => a.key === c.attributeKey)?.category === 'organization');
    const assConds = sr.conditions.filter((c) => c.attributeKey && c.values.length > 0 && ALL_ATTRIBUTES.find((a) => a.key === c.attributeKey)?.category === 'assessment');

    assignees.forEach((a) => {
      if (!map[a.id]) map[a.id] = { ...a, rules: [], orgAttrs: {}, assAttrs: {} };
      map[a.id].rules.push({ idx: idx + 1, name: sr.name, id: sr.id });
      orgConds.forEach((c) => {
        if (!map[a.id].orgAttrs[c.attributeKey]) map[a.id].orgAttrs[c.attributeKey] = new Set();
        c.values.forEach((v) => map[a.id].orgAttrs[c.attributeKey].add(v));
      });
      assConds.forEach((c) => {
        if (!map[a.id].assAttrs[c.attributeKey]) map[a.id].assAttrs[c.attributeKey] = new Set();
        c.values.forEach((v) => map[a.id].assAttrs[c.attributeKey].add(v));
      });
    });
  });

  if (currentRule.fallbackAssignees.length > 0) {
    currentRule.fallbackAssignees.forEach((a) => {
      if (!map[a.id]) map[a.id] = { ...a, rules: [], orgAttrs: {}, assAttrs: {} };
      map[a.id].rules.push({ idx: 'FB', name: 'Fallback (ELSE)', id: 'fallback' });
    });
  }

  return Object.values(map);
}

function orgSummary(orgAttrs) {
  const parts = [];
  if (orgAttrs.country) parts.push([...orgAttrs.country].join(', '));
  if (orgAttrs.tier) parts.push([...orgAttrs.tier].join(', '));
  return parts.join(' · ') || null;
}

export default function StepReview() {
  const { state } = useRule();
  const { currentRule } = state;
  const trigger = TRIGGER_EVENTS.find((t) => t.key === currentRule.triggerEvent);

  const validSubRules = currentRule.subRules.filter(
    (sr) => sr.conditions.some((c) => c.attributeKey && c.values.length > 0)
  );
  const assigneeRows = buildAssigneeView(currentRule);
  const hasAssignees = assigneeRows.length > 0;

  const triggerBadges = [];
  if (trigger && trigger.label.includes('Submitted')) triggerBadges.push({ key: 'status', val: 'Asm Submitted' });
  if (currentRule.triggerEvent === 'capa_submitted') triggerBadges.push({ key: 'status', val: 'CAPA Submitted' });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!hasAssignees && (
        <div style={{ background: 'var(--color-danger-light)', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" fill="none" stroke="var(--color-danger)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>No assignees configured. Go back to Step 2 to assign users or groups.</span>
        </div>
      )}

      {/* General Info */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px 20px', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Rule Name</span>
          <span style={{ fontWeight: 600 }}>{currentRule.name || '(not set)'}</span>
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Trigger Event</span>
          <span>{trigger ? <span className="badge badge-primary">{trigger.label}</span> : '(not set)'}</span>
          {currentRule.description && (
            <>
              <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Description</span>
              <span style={{ color: 'var(--color-gray-600)' }}>{currentRule.description}</span>
            </>
          )}
          <span style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Sub-Rules</span>
          <span>{validSubRules.length} sub-rule{validSubRules.length !== 1 ? 's' : ''} with <span style={{ fontWeight: 500 }}>{assigneeRows.length}</span> unique assignee{assigneeRows.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Assignee Preview Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" fill="none" stroke="var(--color-gray-500)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>Assignment Preview</h3>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)' }}>{assigneeRows.length} assignee{assigneeRows.length !== 1 ? 's' : ''}</span>
        </div>

        {assigneeRows.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-gray-400)' }}>
            <svg width="40" height="40" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p style={{ fontWeight: 500, marginTop: 12 }}>No assignees to preview</p>
            <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>Go back to Step 2 to assign users or groups.</p>
          </div>
        ) : (
          <div>
            {assigneeRows.map((row, ri) => {
              const isGroup = row.type === 'group';
              const initials = isGroup ? null : row.name.split(' ').map((n) => n[0]).join('');
              const avatarBg = AVATAR_COLORS[ri % AVATAR_COLORS.length];
              const orgKeys = Object.keys(row.orgAttrs);
              const assKeys = Object.keys(row.assAttrs);
              const countries = row.orgAttrs.country ? [...row.orgAttrs.country] : [];
              const mockOrgs = countries.flatMap((c) => (MOCK_ORG_NAMES[c] || []).slice(0, Math.ceil(3 / countries.length)));
              const orgCount = Math.max(mockOrgs.length, Math.floor(Math.random() * 15) + 3);
              const asmCount = Math.floor(Math.random() * 80) + 10;

              return (
                <div key={row.id} className="slide-in" style={{ borderBottom: ri < assigneeRows.length - 1 ? '1px solid var(--color-gray-200)' : 'none', animationDelay: `${ri * 80}ms` }}>
                  <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: isGroup ? 'var(--color-warning-light)' : avatarBg, color: isGroup ? '#92400e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isGroup ? '0.875rem' : '0.8125rem', fontWeight: 700, flexShrink: 0 }}>
                        {isGroup ? (
                          <svg width="18" height="18" fill="none" stroke="#92400e" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>{row.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isGroup ? <span>{row.memberCount} members</span> : <span>{row.role || 'Member'}</span>}
                          {row.rules.some((r) => r.id === 'fallback') && (
                            <span className="badge badge-warning" style={{ fontSize: '0.625rem', fontWeight: 600, padding: '1px 6px' }}>FALLBACK</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, textAlign: 'center', flexShrink: 0 }}>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>{row.rules.length}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-400)' }}>Rule{row.rules.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>{orgCount}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-400)' }}>Orgs</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-gray-800)' }}>{asmCount}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--color-gray-400)' }}>Asms</div>
                      </div>
                    </div>
                  </div>

                  {assKeys.length > 0 && (
                    <div style={{ padding: '0 24px 12px', paddingLeft: 78 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <svg width="13" height="13" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assessment attributes this person handles</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {triggerBadges.map((tb) => <AttrBadge key={tb.val} attrKey={tb.key} value={tb.val} />)}
                        {assKeys.map((k) => [...row.assAttrs[k]].map((v) => <AttrBadge key={k + v} attrKey={k} value={v} />))}
                      </div>
                    </div>
                  )}

                  {orgKeys.length > 0 && (
                    <div style={{ padding: '0 24px 16px', paddingLeft: 78 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <svg width="13" height="13" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organizations ({orgSummary(row.orgAttrs) || 'All'})</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        {mockOrgs.slice(0, 2).map((o) => <span key={o} style={{ fontSize: '0.8125rem', color: 'var(--color-gray-700)' }}>{o}</span>)}
                        {orgCount > 2 && <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500, cursor: 'pointer' }}>+{orgCount - 2} more</span>}
                      </div>
                    </div>
                  )}

                  {orgKeys.length === 0 && assKeys.length === 0 && (
                    <div style={{ padding: '0 24px 16px', paddingLeft: 78 }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>Fallback assignee — handles all unmatched assessments</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{validSubRules.length}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Sub-Rules</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-success)' }}>{assigneeRows.length}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Unique Assignees</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-warning)' }}>
            {validSubRules.reduce((sum, sr) => sum + sr.conditions.filter((c) => c.attributeKey && c.values.length > 0).length, 0)}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>Total Conditions</div>
        </div>
      </div>
    </div>
  );
}
