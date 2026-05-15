export const karunPhuketRev01 = {
  projectName: 'Karun Phuket Old Town',
  revisionStatus: 'REV01 Review',
  currentBudget: 7483632.5,
  previousBudget: 7532450,
  budgetDelta: -48817.5,
  lastUpdated: '15 May 2026',
  scopeCompleteness: '82%',
  hiddenCostRisk: 'Medium',
  ownerSupplyCount: 1,
  negotiationPriority: 'High',
  costReduction: 48817.5,
  costBreakdown: [
    { name: 'Architectural', value: 4862942.5, color: '#1c1917' },
    { name: 'Electrical', value: 1064500, color: '#64748b' },
    { name: 'AC', value: 836900, color: '#7c6f5f' },
    { name: 'Water System', value: 719290, color: '#b08968' },
  ],
  deltas: [
    { label: 'Architectural', value: -12967.5 },
    { label: 'Electrical', value: -44550 },
    { label: 'AC', value: -31900 },
    { label: 'Water System', value: 40600 },
  ],
  revisionNotes: ['Discount increased'],
  risks: [
    {
      title: 'PEA expansion excluded',
      detail: 'Potential authority-side expansion work is outside the current BOQ.',
      level: 'External cost',
    },
    {
      title: 'Communication main excluded',
      detail: 'Main communication line scope remains outside contractor pricing.',
      level: 'Scope gap',
    },
    {
      title: 'Chandelier by owner',
      detail: 'Owner supply item should be tracked for procurement timing and install readiness.',
      level: 'Owner supply',
    },
    {
      title: 'Possible condenser support structure cost',
      detail: 'AC support structure may require a separate allowance after site confirmation.',
      level: 'Hidden cost',
    },
  ],
  checklist: [
    'Confirm AC model/spec',
    'Request water system breakdown',
    'Confirm Lux level',
    'Confirm BTU performance',
    'Confirm owner supply items',
  ],
  internal: {
    overpricedItems: [
      'Water system increase needs itemized labor and equipment validation.',
      'Electrical reductions may hide relocated scope or excluded main feed items.',
    ],
    contractorAnalysis:
      'REV01 is net lower, but the water system increase and external exclusions should be separated before owner approval.',
    negotiationNotes: [
      'Use AC reduction as proof that specification review is creating savings.',
      'Ask contractor to preserve discount level while clarifying exclusions.',
      'Request alternate pricing for condenser support before site install.',
    ],
  },
}
