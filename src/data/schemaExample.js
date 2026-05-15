export const boqProjectSchemaExample = {
  id: 'brand-branch-revision',
  projectName: 'Brand Branch Name',
  brand: 'Brand',
  branch: 'Branch or location',
  revision: 'REV01',
  status: 'Review | Approved | Data pending review',
  currentBudget: 0,
  previousBudget: 0,
  deltaAmount: 0,
  deltaPercent: 0,
  lastUpdated: 'DD Month YYYY',
  areaSqm: 0,
  costBreakdown: [
    { name: 'Architectural', value: 0, color: '#1c1917' },
    { name: 'Electrical', value: 0, color: '#64748b' },
    { name: 'AC', value: 0, color: '#7c6f5f' },
    { name: 'Water System', value: 0, color: '#b08968' },
  ],
  revisionDelta: {
    items: [{ label: 'Architectural', value: 0 }],
    notes: ['Discount increased'],
  },
  risks: [
    {
      title: 'Risk title',
      detail: 'Owner-readable implication of the risk.',
      level: 'Scope gap | Hidden cost | Owner supply | External cost',
      ownerVisible: true,
    },
  ],
  negotiationChecklist: [{ label: 'Confirm item or specification', ownerVisible: true }],
  ownerSupplyItems: ['Owner supplied fixture or equipment'],
  ownerSummary: 'Plain-language owner summary suitable for client review.',
  internalNotes: {
    overpricedItems: ['Strategic pricing observation'],
    contractorAnalysis: 'Internal read on contractor behavior or quote structure.',
    negotiationNotes: ['Private negotiation point'],
  },
}

export const aiImportMappingGuide = [
  'Use one object per BOQ or quotation revision.',
  'Normalize monetary values as numbers without commas or currency symbols.',
  'Map headline project identity into id, projectName, brand, branch, and revision.',
  'Map package totals into costBreakdown using stable category names.',
  'Map revision movement by category into revisionDelta.items with negative values for reductions.',
  'Put owner-safe explanations in ownerSummary and private strategy in internalNotes.',
  'Leave unknown fields as null, empty strings, or empty arrays so the UI can show Data pending review.',
]
