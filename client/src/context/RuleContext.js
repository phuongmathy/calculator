import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RuleContext = createContext();

function createEmptyCondition() {
  return {
    id: uuidv4(),
    attributeKey: '',
    attributeCategory: '',
    operator: 'equals',
    values: [],
  };
}

function createEmptySubRule() {
  return {
    id: uuidv4(),
    name: '',
    conditions: [createEmptyCondition()],
  };
}

function createInitialRule() {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    triggerEvent: '',
    resultFilter: [],
    isEnabled: true,
    subRules: [createEmptySubRule()],
    assignments: {},
    fallbackAssignees: [],
  };
}

const initialState = {
  currentRule: createInitialRule(),
  currentStep: 0,
  savedRules: JSON.parse(localStorage.getItem('autoAssignRules') || '[]'),
  isEditing: false,
  editingRuleId: null,
};

function ruleReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_RULE_FIELD':
      return {
        ...state,
        currentRule: { ...state.currentRule, [action.field]: action.value },
      };

    case 'ADD_SUB_RULE':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: [...state.currentRule.subRules, createEmptySubRule()],
        },
      };

    case 'REMOVE_SUB_RULE':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: state.currentRule.subRules.filter((sr) => sr.id !== action.payload),
        },
      };

    case 'UPDATE_SUB_RULE':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: state.currentRule.subRules.map((sr) =>
            sr.id === action.subRuleId ? { ...sr, ...action.updates } : sr
          ),
        },
      };

    case 'ADD_CONDITION': {
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: state.currentRule.subRules.map((sr) =>
            sr.id === action.subRuleId
              ? { ...sr, conditions: [...sr.conditions, createEmptyCondition()] }
              : sr
          ),
        },
      };
    }

    case 'REMOVE_CONDITION':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: state.currentRule.subRules.map((sr) =>
            sr.id === action.subRuleId
              ? { ...sr, conditions: sr.conditions.filter((c) => c.id !== action.conditionId) }
              : sr
          ),
        },
      };

    case 'UPDATE_CONDITION':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          subRules: state.currentRule.subRules.map((sr) =>
            sr.id === action.subRuleId
              ? {
                  ...sr,
                  conditions: sr.conditions.map((c) =>
                    c.id === action.conditionId ? { ...c, ...action.updates } : c
                  ),
                }
              : sr
          ),
        },
      };

    case 'SET_ASSIGNMENT':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          assignments: {
            ...state.currentRule.assignments,
            [action.subRuleId]: action.assignees,
          },
        },
      };

    case 'SET_FALLBACK_ASSIGNEES':
      return {
        ...state,
        currentRule: {
          ...state.currentRule,
          fallbackAssignees: action.payload,
        },
      };

    case 'SAVE_RULE': {
      const rule = {
        ...state.currentRule,
        updatedAt: new Date().toISOString(),
      };
      let newRules;
      if (state.isEditing) {
        newRules = state.savedRules.map((r) => (r.id === state.editingRuleId ? rule : r));
      } else {
        rule.createdAt = new Date().toISOString();
        newRules = [...state.savedRules, rule];
      }
      localStorage.setItem('autoAssignRules', JSON.stringify(newRules));
      return {
        ...state,
        savedRules: newRules,
        currentRule: createInitialRule(),
        currentStep: 0,
        isEditing: false,
        editingRuleId: null,
      };
    }

    case 'EDIT_RULE': {
      const ruleToEdit = state.savedRules.find((r) => r.id === action.payload);
      if (!ruleToEdit) return state;
      return {
        ...state,
        currentRule: { ...ruleToEdit },
        currentStep: 0,
        isEditing: true,
        editingRuleId: action.payload,
      };
    }

    case 'DELETE_RULE': {
      const newRules = state.savedRules.filter((r) => r.id !== action.payload);
      localStorage.setItem('autoAssignRules', JSON.stringify(newRules));
      return { ...state, savedRules: newRules };
    }

    case 'TOGGLE_RULE': {
      const newRules = state.savedRules.map((r) =>
        r.id === action.payload ? { ...r, isEnabled: !r.isEnabled } : r
      );
      localStorage.setItem('autoAssignRules', JSON.stringify(newRules));
      return { ...state, savedRules: newRules };
    }

    case 'RESET_CURRENT':
      return {
        ...state,
        currentRule: createInitialRule(),
        currentStep: 0,
        isEditing: false,
        editingRuleId: null,
      };

    default:
      return state;
  }
}

export function RuleProvider({ children }) {
  const [state, dispatch] = useReducer(ruleReducer, initialState);

  const setStep = useCallback((step) => dispatch({ type: 'SET_STEP', payload: step }), []);
  const setRuleField = useCallback(
    (field, value) => dispatch({ type: 'SET_RULE_FIELD', field, value }),
    []
  );
  const addSubRule = useCallback(() => dispatch({ type: 'ADD_SUB_RULE' }), []);
  const removeSubRule = useCallback(
    (id) => dispatch({ type: 'REMOVE_SUB_RULE', payload: id }),
    []
  );
  const updateSubRule = useCallback(
    (subRuleId, updates) => dispatch({ type: 'UPDATE_SUB_RULE', subRuleId, updates }),
    []
  );
  const addCondition = useCallback(
    (subRuleId) => dispatch({ type: 'ADD_CONDITION', subRuleId }),
    []
  );
  const removeCondition = useCallback(
    (subRuleId, conditionId) => dispatch({ type: 'REMOVE_CONDITION', subRuleId, conditionId }),
    []
  );
  const updateCondition = useCallback(
    (subRuleId, conditionId, updates) =>
      dispatch({ type: 'UPDATE_CONDITION', subRuleId, conditionId, updates }),
    []
  );
  const setAssignment = useCallback(
    (subRuleId, assignees) => dispatch({ type: 'SET_ASSIGNMENT', subRuleId, assignees }),
    []
  );
  const setFallbackAssignees = useCallback(
    (assignees) => dispatch({ type: 'SET_FALLBACK_ASSIGNEES', payload: assignees }),
    []
  );
  const saveRule = useCallback(() => dispatch({ type: 'SAVE_RULE' }), []);
  const editRule = useCallback((id) => dispatch({ type: 'EDIT_RULE', payload: id }), []);
  const deleteRule = useCallback((id) => dispatch({ type: 'DELETE_RULE', payload: id }), []);
  const toggleRule = useCallback((id) => dispatch({ type: 'TOGGLE_RULE', payload: id }), []);
  const resetCurrent = useCallback(() => dispatch({ type: 'RESET_CURRENT' }), []);

  const value = {
    state,
    setStep,
    setRuleField,
    addSubRule,
    removeSubRule,
    updateSubRule,
    addCondition,
    removeCondition,
    updateCondition,
    setAssignment,
    setFallbackAssignees,
    saveRule,
    editRule,
    deleteRule,
    toggleRule,
    resetCurrent,
  };

  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
}

export function useRule() {
  const ctx = useContext(RuleContext);
  if (!ctx) throw new Error('useRule must be used within RuleProvider');
  return ctx;
}
