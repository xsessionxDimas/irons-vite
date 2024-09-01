import { Header } from '@/core/types/entities/dma/defects/Header'
import { Defect } from '@/database/schema/Defect'
import { head, isUndefined } from 'lodash'

export const priorityClass = (priority: string): string => {
  let priorityClass = ""
  switch (priority) {
    case "P1":
      priorityClass = "red"
      break
    case "P2":
      priorityClass = "gold"
      break
    case "P3":
      priorityClass = "yellow"
      break
    case "P4":
      priorityClass = "green"
      break
  }
  return priorityClass
}

export const formClass = (headerId: string, headers: Header[], isPlanner = false): string => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (header) {
    const status = isPlanner ? header.plannerStatus : header.status
    switch (status) {
      case "":
      case "Submited":
        cssClass = "light-yellow color-dark-yellow"
        break
      case "Acknowledge":
        cssClass = "light-green color-dark-green"
        break
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}

export const formClassDefect = (taskId: string, headers: Defect[]): string => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.taskId === taskId
  })
  if (header) {
    switch (header.status) {
      case "Submited":
        cssClass = "light-yellow color-dark-yellow"
        break
      case "Acknowledge":
        cssClass = "light-green color-dark-green"
        break
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}

export const formClassDefectGeneric = (defectHeaderId: string, headers: Defect[]): string => {
  let cssClass = "light-yellow color-dark-yellow"
  const header = headers?.find((h) => {
    return h.defectHeaderId === defectHeaderId
  })
  if (header) {
    switch (header.status) {
      case "Submited":
        cssClass = "light-yellow color-dark-yellow"
        break
      case "Acknowledge":
        cssClass = "light-green color-dark-green"
        break
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green"
    }
  }
  return cssClass
}

export const moFillable = (headerId: string, headers: Header[], supervisor = true, fitterId = ""): boolean => {
  let disabled = true
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (header) {
    if (fitterId) return true
    // const priorities: string[] = supervisor ? ['P1', 'P2'] : ['P3', 'P4']
    // disabled = !priorities.includes(header.priority)
    // if (disabled) return disabled
    let status;
    if (supervisor) {
      status = header.status
    } else {
      status = header.plannerStatus
    }
    disabled = !(status === 'Acknowledge')
    if (disabled) return disabled
    disabled = !(!header.defectWorkorder || header.defectWorkorder == "")
  }
  return disabled
}

export const defectMoFillable = (headerId: string, headers: Header[], supervisor = true, fitterId = ""): boolean => {
  let disabled = true
  const header = headers?.find((h) => {
    return h.id === headerId
  })
  if (header) {
    if (fitterId) return true
    const priorities: string[] = ['P1', 'P2', 'P3', 'P4']
    disabled = !priorities.includes(header.priority)
    if (disabled) return disabled
    disabled = !(header.status === 'Acknowledge')
    if (disabled) return disabled
    disabled = !(!header.defectWorkorder || header.defectWorkorder == "")
  }
  return disabled
}

export const repairedClass = (defect: any): string => {
  let className = defect.repairedStatus == 'Repaired' ? 'green' : 'red'
  className = !defect.priority ? 'green' : className
  return className
}
export const allowedClass = (priority: string | undefined): string => {
  return priority ? 'allowed' : ''
}

export const isNotConfirmed = (headerId: string, headers: Header[]) => {
  let confirmed = false
  const header = headers.find((h) => {
    return h.id === headerId
  })
  if (header) {
    confirmed = header.cbmNAStatus === "Not-Confirm"
  }
  return confirmed
}

export const defectIsNotConfirmed = (headerId: string, headers: Header[], plannerApprove) => {
  let confirmed = false
  const header = headers.find((h) => {
    return h.id === headerId
  })
  if (plannerApprove) {
    confirmed = isUndefined(header!.plannerCbmNAStatus)
  } else {
    if (header) {
      confirmed = header.cbmNAStatus === "Not-Confirm"
    }
  }
  return confirmed
}

export const defectReviewPage = () => {
  const isEformPage = window.location.href.includes("e-form#!")
  const isEformOfflinePage = window.location.href.includes("e-form-offline#!")
  const isMonitoringPage = (window.location.href.includes("monitoring-status"))
  const isApprovalPage = (window.location.href.includes("approval"))
  if (isEformPage || isMonitoringPage || isApprovalPage || isEformOfflinePage) return false
  return true
}
