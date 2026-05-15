const requiredProjectFields = [
  'id',
  'projectName',
  'brand',
  'branch',
  'revision',
  'status',
  'currentBudget',
  'previousBudget',
  'deltaAmount',
  'deltaPercent',
  'lastUpdated',
  'costBreakdown',
  'revisionDelta',
  'risks',
  'negotiationChecklist',
  'ownerSupplyItems',
  'ownerSummary',
  'internalNotes',
]

const requiredInternalNoteFields = [
  'overpricedItems',
  'contractorAnalysis',
  'negotiationNotes',
]

const hasOwnField = (project, field) =>
  Object.prototype.hasOwnProperty.call(project, field)

export function validateProjectData(projects) {
  return projects.flatMap((project, index) => {
    const label = project?.id || `project at index ${index}`
    const missingFields = requiredProjectFields.filter(
      (field) => !hasOwnField(project, field),
    )
    const warnings = missingFields.map(
      (field) => `${label} is missing required field "${field}"`,
    )

    if (!Array.isArray(project.costBreakdown)) {
      warnings.push(`${label} costBreakdown should be an array`)
    }

    if (!Array.isArray(project.risks)) {
      warnings.push(`${label} risks should be an array`)
    }

    if (!Array.isArray(project.negotiationChecklist)) {
      warnings.push(`${label} negotiationChecklist should be an array`)
    }

    if (!project.revisionDelta || typeof project.revisionDelta !== 'object') {
      warnings.push(`${label} revisionDelta should be an object`)
    } else if (!Array.isArray(project.revisionDelta.items)) {
      warnings.push(`${label} revisionDelta.items should be an array`)
    }

    if (!project.internalNotes || typeof project.internalNotes !== 'object') {
      warnings.push(`${label} internalNotes should be an object`)
    } else {
      requiredInternalNoteFields.forEach((field) => {
        if (!hasOwnField(project.internalNotes, field)) {
          warnings.push(`${label} internalNotes is missing "${field}"`)
        }
      })
    }

    return warnings
  })
}

export function warnForInvalidProjects(projects) {
  const warnings = validateProjectData(projects)

  if (warnings.length > 0) {
    console.warn('[BOQ import validation]', warnings)
  }
}
