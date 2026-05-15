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
  'ใช้หนึ่ง object ต่อหนึ่งรอบ BOQ หรือ quotation',
  'กรอกตัวเลขเป็น number เท่านั้น ไม่ใส่ comma หรือสัญลักษณ์สกุลเงิน',
  'แยกข้อมูลโครงการหลักเป็น id, projectName, brand, branch และ revision',
  'นำยอดรวมแต่ละหมวดใส่ใน costBreakdown โดยใช้ชื่อหมวดให้สม่ำเสมอ',
  'ใส่ส่วนต่างจากรอบก่อนใน revisionDelta.items โดยค่าลดลงให้เป็นตัวเลขติดลบ',
  'ใส่ข้อความที่เจ้าของอ่านได้ใน ownerSummary และกลยุทธ์ภายในใน internalNotes',
  'ถ้ายังไม่ทราบข้อมูล ให้ใช้ null, empty string หรือ empty array เพื่อให้ระบบแสดงรอตรวจสอบข้อมูล',
]
