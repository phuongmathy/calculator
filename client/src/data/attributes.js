export const ORGANIZATION_ATTRIBUTES = [
  {
    key: 'country',
    label: 'Country',
    type: 'select',
    options: [
      'Vietnam', 'China', 'Bangladesh', 'India', 'Cambodia',
      'Indonesia', 'Thailand', 'Myanmar', 'Pakistan', 'Sri Lanka',
      'Turkey', 'Mexico', 'Brazil', 'Canada', 'United States',
      'Italy', 'Portugal', 'Ethiopia', 'Kenya', 'South Africa',
    ],
  },
  {
    key: 'tier',
    label: 'Tier',
    type: 'select',
    options: ['Tier 1', 'Tier 2', 'Tier 3'],
  },
  {
    key: 'region',
    label: 'Region',
    type: 'select',
    options: [
      'Asia Pacific', 'Europe', 'North America',
      'South America', 'Africa', 'Middle East',
    ],
  },
  {
    key: 'factoryStatus',
    label: 'Factory Status',
    type: 'select',
    options: ['Active', 'Inactive', 'Suspended', 'Pending'],
  },
  {
    key: 'businessPartner',
    label: 'Associated Business Partner',
    type: 'select',
    options: [
      'Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E',
    ],
  },
  {
    key: 'productCategory',
    label: 'Product Category',
    type: 'select',
    options: [
      'Apparel', 'Footwear', 'Accessories', 'Home Textiles',
      'Electronics', 'Food & Beverage', 'Toys', 'Furniture',
    ],
  },
];

export const ASSESSMENT_ATTRIBUTES = [
  {
    key: 'scheme',
    label: 'Third-Party Scheme',
    type: 'select',
    options: [
      'SLCP', 'Better Work', 'SMETA', 'BSCI', 'WRAP',
      'SA8000', 'ISO 9001', 'ISO 14001', 'OEKO-TEX',
    ],
  },
  {
    key: 'rating',
    label: 'Assessment Rating',
    type: 'select',
    options: [
      'Acceptable', 'Needs Improvement', 'Probation',
      'Immediate Resolution', 'Not Rated',
    ],
  },
  {
    key: 'status',
    label: 'Assessment Status',
    type: 'select',
    options: ['Created', 'In Progress', 'Submitted', 'Completed', 'Cancelled'],
  },
  {
    key: 'auditType',
    label: 'Audit Type',
    type: 'select',
    options: [
      'Social Compliance', 'Quality', 'Environmental',
      'Safety', 'Structural', 'C-TPAT',
    ],
  },
  {
    key: 'standard',
    label: 'Standard',
    type: 'select',
    options: [
      'APPROVAL - SVP/EVP & GC', 'APPROVAL - Regional',
      'REMEDIATION', 'INITIAL AUDIT', 'FOLLOW-UP',
    ],
  },
];

export const TRIGGER_EVENTS = [
  { key: 'assessment_created', label: 'Assessment Created' },
  { key: 'assessment_completed', label: 'Assessment Completed' },
  { key: 'assessment_submitted', label: 'Assessment Submitted' },
  { key: 'capa_submitted', label: 'CAPA Submitted' },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Ka Ho Yan', email: 'kaho.yan@company.com', role: 'Compliance Manager' },
  { id: 'u2', name: 'Liza Lam', email: 'liza.lam@company.com', role: 'SVP Compliance' },
  { id: 'u3', name: 'John Smith', email: 'john.smith@company.com', role: 'Regional QA Manager' },
  { id: 'u4', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Performance Manager' },
  { id: 'u5', name: 'David Kim', email: 'david.kim@company.com', role: 'BI Manager' },
  { id: 'u6', name: 'Maria Garcia', email: 'maria.garcia@company.com', role: 'Lead Auditor' },
  { id: 'u7', name: 'Ahmed Hassan', email: 'ahmed.hassan@company.com', role: 'Social Compliance Lead' },
  { id: 'u8', name: 'Emily Watson', email: 'emily.watson@company.com', role: 'Sustainability Manager' },
];

export const MOCK_USER_GROUPS = [
  { id: 'g1', name: 'Asian QA Group', memberCount: 5 },
  { id: 'g2', name: 'Global Compliance Team', memberCount: 8 },
  { id: 'g3', name: 'RSSC Team', memberCount: 4 },
  { id: 'g4', name: 'Performance Elevation Team', memberCount: 6 },
  { id: 'g5', name: 'Remediation Team', memberCount: 3 },
];
