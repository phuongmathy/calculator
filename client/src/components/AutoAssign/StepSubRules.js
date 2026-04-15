import React, { useState } from 'react';
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

function MultiSelect({ options, selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o)
  );

  return (
    <div className="multi-select" style={{ position: 'relative' }}>
      <div
        className="multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
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
        {selected.length === 0 && (
          <span style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem' }}>
            {placeholder || 'Select values...'}
          </span>
        )}
        {selected.map((val) => (
          <span
            key={val}
            className="badge badge-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            {val}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(selected.filter((s) => s !== val));
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.875rem',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                lineHeight: 1,
              }}
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
            maxHeight: 200,
            overflow: 'auto',
            marginTop: 4,
          }}
        >
          <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--color-gray-100)' }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', border: '1px solid var(--color-gray-200)', fontSize: '0.8125rem' }}
              autoFocus
            />
          </div>
          {filtered.map((opt) => (
            <div
              key={opt}
              onClick={(e) => {
                e.stopPropagation();
                onChange([...selected, opt]);
                setSearch('');
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'var(--color-primary-50)')}
              onMouseLeave={(e) => (e.target.style.background = 'transparent')}
            >
              {opt}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '12px', color: 'var(--color-gray-400)', fontSize: '0.875rem', textAlign: 'center' }}>
              No options
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

function ConditionRow({ condition, subRuleId, isLast, isOnly }) {
  const { updateCondition, removeCondition } = useRule();
  const attr = ALL_ATTRIBUTES.find((a) => a.key === condition.attributeKey);

  return (
    <div className="fade-in" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: isLast ? 0 : 0 }}>
      <div style={{ minWidth: 140 }}>
        <select
          value={condition.attributeKey}
          onChange={(e) => {
            const selected = ALL_ATTRIBUTES.find((a) => a.key === e.target.value);
            updateCondition(subRuleId, condition.id, {
              attributeKey: e.target.value,
              attributeCategory: selected?.category || '',
              values: [],
            });
          }}
          style={{ width: '100%' }}
        >
          <option value="">Select attribute</option>
          <optgroup label="Organization Attributes">
            {ORGANIZATION_ATTRIBUTES.map((a) => (
              <option key={a.key} value={a.key}>{a.label}</option>
            ))}
          </optgroup>
          <optgroup label="Assessment Attributes">
            {ASSESSMENT_ATTRIBUTES.map((a) => (
              <option key={a.key} value={a.key}>{a.label}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div style={{ minWidth: 100 }}>
        <select
          value={condition.operator}
          onChange={(e) => updateCondition(subRuleId, condition.id, { operator: e.target.value })}
          style={{ width: '100%' }}
        >
          <option value="equals">equals</option>
          <option value="not_equals">not equals</option>
          <option value="contains">contains</option>
        </select>
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        {attr ? (
          <MultiSelect
            options={attr.options}
            selected={condition.values}
            onChange={(vals) => updateCondition(subRuleId, condition.id, { values: vals })}
            placeholder={`Select ${attr.label}...`}
          />
        ) : (
          <input
            type="text"
            placeholder="Select an attribute first"
            disabled
            style={{ width: '100%', background: 'var(--color-gray-50)' }}
          />
        )}
      </div>

      <button
        className="btn btn-icon btn-ghost"
        onClick={() => removeCondition(subRuleId, condition.id)}
        disabled={isOnly}
        style={{ opacity: isOnly ? 0.3 : 1, flexShrink: 0, marginTop: 2 }}
        title="Remove condition"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function SubRuleCard({ subRule, index, isOnly }) {
  const { removeSubRule, updateSubRule, addCondition } = useRule();

  return (
    <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'var(--color-gray-50)',
          borderBottom: '1px solid var(--color-gray-200)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            className="badge badge-primary"
            style={{ fontWeight: 600, fontSize: '0.8125rem' }}
          >
            Sub-rule {index + 1}
          </span>
          <input
            type="text"
            placeholder="Sub-rule name (optional)"
            value={subRule.name}
            onChange={(e) => updateSubRule(subRule.id, { name: e.target.value })}
            style={{
              border: 'none',
              background: 'transparent',
              fontWeight: 500,
              fontSize: '0.875rem',
              width: 220,
              padding: '4px 8px',
            }}
          />
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => removeSubRule(subRule.id)}
          disabled={isOnly}
          style={{
            color: isOnly ? 'var(--color-gray-300)' : 'var(--color-danger)',
            opacity: isOnly ? 0.5 : 1,
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Remove
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Conditions
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)' }}>
            (all conditions must match — AND logic)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subRule.conditions.map((cond, i) => (
            <React.Fragment key={cond.id}>
              <ConditionRow
                condition={cond}
                subRuleId={subRule.id}
                isLast={i === subRule.conditions.length - 1}
                isOnly={subRule.conditions.length === 1}
              />
              {i < subRule.conditions.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 0 0 4px' }}>
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem', fontWeight: 700 }}>AND</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--color-gray-200)' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => addCondition(subRule.id)}
          style={{ marginTop: 12, color: 'var(--color-primary)' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add AND condition
        </button>
      </div>
    </div>
  );
}

export default function StepSubRules() {
  const { state, setRuleField, addSubRule } = useRule();
  const { currentRule } = state;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Rule General Info */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--color-gray-800)' }}>
          General Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-gray-700)' }}>
              Rule Name <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Vietnam Tier 1 Assessment Assignment"
              value={currentRule.name}
              onChange={(e) => setRuleField('name', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-gray-700)' }}>
              Trigger Event <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <select
              value={currentRule.triggerEvent}
              onChange={(e) => setRuleField('triggerEvent', e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Select trigger event...</option>
              {TRIGGER_EVENTS.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-gray-700)' }}>
              Description
            </label>
            <textarea
              placeholder="Describe when and why this rule should trigger..."
              value={currentRule.description}
              onChange={(e) => setRuleField('description', e.target.value)}
              rows={2}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* Sub-rules */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-gray-800)' }}>
              Sub-Rules
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: 2 }}>
              Sub-rules are evaluated with <span className="badge badge-primary" style={{ fontSize: '0.7rem', fontWeight: 700, verticalAlign: 'middle' }}>OR</span> logic — any matching sub-rule triggers assignment.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={addSubRule}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add Sub-Rule
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {currentRule.subRules.map((sr, i) => (
            <React.Fragment key={sr.id}>
              {i > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--color-gray-300)', borderStyle: 'dashed' }} />
                  <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px' }}>
                    OR
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--color-gray-300)', borderStyle: 'dashed' }} />
                </div>
              )}
              <SubRuleCard
                subRule={sr}
                index={i}
                isOnly={currentRule.subRules.length === 1}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
