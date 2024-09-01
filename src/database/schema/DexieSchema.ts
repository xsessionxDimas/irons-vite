import Dexie from 'dexie'
import { WorkOrder } from '@/core/types/intervention/WorkOrder'
import { Option } from '@/core/types/misc/Option'
import { Action } from '@/core/types/entities/dma/masters/Action'
import { Ownership } from '@/core/types/entities/dma/masters/Ownership'
import { Causes } from '@/core/types/entities/dma/masters/Causes'
import { NACondition } from '@/core/types/entities/dma/masters/NACondition'
import { Symptom } from '@/core/types/entities/dma/masters/Symptom'
import { SMUTolerance } from '@/core/types/entities/dma/masters/SMUTolerance'
import {
  Shift
} from '@/core/types/entities/dma/component-intervention/Shift'
import { Menu } from './Menu'
import { UserInfo } from './UserInfo'
import { Intervention } from '@/core/types/intervention/Intervention'
import { QueueTask } from './QueueTask'
import { QueueFileTask } from './QueueFileTask'
import { SyncMessage } from './SyncMessage'
import { TaskImages } from './TaskImages'
import { OffsetDate } from '@/core/types/intervention/OffsetDate'
import { OutstandingBadge } from '@/core/types/intervention/OutstandingBadge'
import { Defect } from './Defect'
import { Comment } from './Comment'
import { CBMMapping } from '@/core/types/intervention/CBMMapping'
import { ValidTokenNew } from './ValidTokenNew'
import {
  OfflineDailySchedule
} from '@/core/types/entities/dma/daily-schedule/OfflineDailySchedule'
import {
  GenerateServiceSheet
} from '@/core/types/entities/dma/e-form/OfflineGenerateServiceSheet'
import { OilTolerance } from '@/core/types/entities/dma/e-form/OilTolerance'
import {
  TimeZone,
  TimeZoneDesc
} from '@/core/types/entities/dma/TimeZone'
import { ServiceSheetDefect } from './ServiceSheetDefect'
import { HmOffset } from '@/core/types/entities/dma/e-form/general/HmOffset'
import {
  SkipPreServiceOption
} from '@/core/types/entities/dma/masters/SkipPreserviceOption'
import { TaskReference } from './TaskReferences'
import {
  MultiplePreviousCrack
} from '@/core/types/entities/dma/e-form/cracks/MultiplePreviousCrack'
import { CalibrationForm } from '@/core/types/entities/dma/CalibrationForm'
import { ServiceFormPreviousTandem } from './ServiceFormPreviousTandem'
import {
  ServiceFormReplacementDefaultValue
} from './ServiceFormReplacementDefaultValue'
import {
  serviceFormPreviousReplacement
} from './ServiceFormPreviousReplacmenet'
import { SyncProgress } from './SyncProgress'
import { SyncToken } from './SyncToken'
import { ReloadCounter } from './ReloadCounter'

export class DexieSchema extends Dexie {
  interventionHeader!: Dexie.Table<WorkOrder, string>
  interventionDetail!: Dexie.Table<Intervention, string>
  interventionDetailView!: Dexie.Table<Intervention, string>
  interventionDefect!: Dexie.Table<Defect, number>
  interventionComment!: Dexie.Table<Comment, number>
  task!: Dexie.Table<SyncMessage, number>
  pendingTask!: Dexie.Table<QueueTask, number>
  pendingTaskFile!: Dexie.Table<QueueFileTask, number>
  retryTask!: Dexie.Table<SyncMessage, number>
  taskImage!: Dexie.Table<TaskImages, number>
  fitter!: Dexie.Table<Option, string>
  smuTolerance!: Dexie.Table<SMUTolerance, number>
  symptom!: Dexie.Table<Symptom, number>
  action!: Dexie.Table<Action, number>
  causes!: Dexie.Table<Causes, number>
  naCondition!: Dexie.Table<NACondition, number>
  position!: Dexie.Table<Option, string>
  shift!: Dexie.Table<Shift, number>
  menu!: Dexie.Table<Menu, string>
  ownership!: Dexie.Table<Ownership, string>
  userInfo!: Dexie.Table<UserInfo, string>
  offsetDate!: Dexie.Table<OffsetDate, number>
  outstandingBadge!: Dexie.Table<OutstandingBadge, string>
  cbmMapping!: Dexie.Table<CBMMapping, number>
  validTokenNew!: Dexie.Table<ValidTokenNew, string>
  // service sheets
  serviceSheetHeader!: Dexie.Table<OfflineDailySchedule, number>
  serviceSheetDetail!: Dexie.Table<GenerateServiceSheet, string>
  oilTolerance!: Dexie.Table<OilTolerance, number>
  timeZone!: Dexie.Table<TimeZone, string>
  timeZoneDesc!: Dexie.Table<TimeZoneDesc, string>
  serviceSheetDefect!: Dexie.Table<ServiceSheetDefect, number>
  hmOffset!: Dexie.Table<HmOffset, number>
  preServiceReason!: Dexie.Table<SkipPreServiceOption, number>
  taskReference!: Dexie.Table<TaskReference, number>
  previousCrack!: Dexie.Table<MultiplePreviousCrack, number>
  serviceFormComment!: Dexie.Table<Comment, number>
  serviceFormPayloadCalibration!: Dexie.Table<CalibrationForm, string>
  serviceFormPreviousTandem!: Dexie.Table<ServiceFormPreviousTandem, string>
  serviceFormPreviousReplacement!: Dexie.Table<serviceFormPreviousReplacement, string>
  serviceFormReplacementDefaultValue!: Dexie.Table<ServiceFormReplacementDefaultValue, string>
  intervetionReplacementDefaultValue!: Dexie.Table<ServiceFormReplacementDefaultValue, string>
  syncProgress!: Dexie.Table<SyncProgress, number>
  syncToken!: Dexie.Table<SyncToken, number>
  interventionFormComment!: Dexie.Table<Comment, number>
  reloadCounter!: Dexie.Table<ReloadCounter, number>

  constructor() {
    super('DexieSchema')
    this.version(parseFloat(import.meta.env.VITE_APP_DB_VERSION as string)).stores({
      interventionHeader: `id, equipment, equipmentDesc, sampleStatus, componentDescription, sapWorkOrder, mdInterventionStatusId, 
      interventionStatus, interventionDiagnosis, followUpPriority, status, estimationCompletionDate, headerChangedOn, interventionExecution, progress, componentSystem`,
      interventionDetail: `id, key, siteId, sitedesc, trInterventionHeaderId, interventionNumber, equipment, equipmentDesc, 
      equipmentModel, equipmentBrand, equipmentGroup, componentId, componentCode, componentDescription, sampleType, interventionCode, interventionReason, sampleDate, sampleStatus,
      smu, smuDue, componentHm, components, mdInterventionStatusId, interventionStatus, interventionStatusDesc, interventionDiagnosis, sapWorkOrder,
      statusDatetime, interventionExecutionId, interventionExecution, interventionExecutionBy, cautionRatingDate, followUpPriority, followUpPriorityUomId,
      followUpPriorityUom, keyPbi, estCompletionDate, log, serviceStart, serviceEnd, supervisor, statusHistory, riskAssesment, safetyPrecaution,
      imageEquipment, interventionSMU, details, additionalInformation, reason, isActive, isDeleted, createdBy, createdDate, updatedBy, updatedDate, _rid, _self, _etag,
      _attachments, _ts, version, servicePersonnels, isApprovedSmu, smuBy, smuDate`,
      interventionDetailView: `id, key, siteId, sitedesc, trInterventionHeaderId, interventionNumber, equipment, equipmentDesc, 
      equipmentModel, equipmentBrand, equipmentGroup, componentId, componentCode, componentDescription, sampleType, interventionCode, interventionReason, sampleDate, sampleStatus,
      smu, smuDue, componentHm, components, mdInterventionStatusId, interventionStatus, interventionStatusDesc, interventionDiagnosis, sapWorkOrder,
      statusDatetime, interventionExecutionId, interventionExecution, interventionExecutionBy, cautionRatingDate, followUpPriority, followUpPriorityUomId,
      followUpPriorityUom, keyPbi, estCompletionDate, log, serviceStart, serviceEnd, supervisor, statusHistory, riskAssesment, safetyPrecaution,
      imageEquipment, interventionSMU, details, additionalInformation, reason, isActive, isDeleted, createdBy, createdDate, updatedBy, updatedDate, _rid, _self, _etag,
      _attachments, _ts, version, servicePersonnels, isApprovedSmu, smuBy, smuDate`,
      interventionDefect: `++id, category, interventionId, taskId, taskNo, taskDesc, defectType,
      taskValue, priority, cbmMeasurement, cbmUom, sapWorkorder, taskKey, type, defectHeaderId, defectDetailId, defectWorkorder, repairedStatus, defectData, cbmNAStatus, status, plannerStatus, declineReason, statusSync, declineBy, declineDate, approvedBy, approvedDate, createdBy, createdDate, commentValue, updatedBy, updatedDate, downloadHistory, otherFitterUpdatedBy, correctedValue, correctedMeasurement, correctedUom, approveReason, plannerApproveReason`,
      interventionComment: `++id, taskKey, taskDesc, taskComment, workOrder, createdBy, createdDate, updatedBy, updatedDate`,
      task: '++id, module, section, type, workorder, payload, syncDate, createdBy, createdDate, itemKey, syncStatus',
      pendingTask: '++id, module, section, type, key, bindingKey, workorder, payload, syncDate, createdBy, createdDate, itemKey, syncStatus',
      pendingTaskFile: '++id, module, type, fileType, workorder, createdBy, email, key, filename, originalFilename, blob, errorMessage, syncDate, syncStatus',
      retryTask: '++id, module, section, type, workorder, payload, syncDate, errorMessage',
      taskImage: '++id, taskKey, sapWorkorder, updatedBy, filename, image, status, fileType',
      fitter: 'value, label',
      symptom: '++id, symptom',
      action: '++id, action',
      causes: '++id, causes',
      naCondition: '++id, naCondition, reviseNaCondition',
      smuTolerance: '++no, min, max',
      position: 'value, label',
      shift: '++shiftId, shift, startHour, startHourType, endHour, endHourType',
      menu: 'Path, MenuName, Icon, Sequence, MenuId',
      userInfo: 'EmployeeId, ADAccount, Name, Email, Gender, Position, Location, StartDate, EndDate, SiteId, isHO, isPlanner',
      offsetDate: '++id, offsetDate',
      outstandingBadge: 'menuName, outstanding, menuId',
      cbmMapping: '++id, model, psType, detail',
      validTokenNew: 'token, expired, lastUpdated, expiredDate, lastUpdatedDate',
      ownership: 'equipmentNumber, ownership, serialNumber',
      // service sheets
      serviceSheetHeader: 'id, smuDue, workOrder, unitNumber, psType, shift, equipmentModel, equipmentModelName, status, progress, syncStatus, date',
      serviceSheetDetail: 'id, general, serviceSheet',
      oilTolerance: '++id, min, max, uom',
      timeZone: '++id, timeZone',
      timeZoneDesc: '++id, timeZone',
      serviceSheetDefect: `++id, key, form, formDefect, assetNumber, imageAvailable, defectType, cbmUom, cbmImageKey, cbmImageProp, isCbmAdjusment, repairedStatus, workorder,
      createdBy, createdDate, updatedBy, updatedDate, plannerCbmNAStatus, category, serviceSheetDetailId, taskId, taskNo, taskDesc, taskValue, priority, cbmMeasurement, defectHeaderId,
      defectDetailId, defectWorkorder, defectData, cbmNAStatus, status, plannerStatus, declineReason, statusSync, isActive, declineBy, declineDate, approvedBy, approvedDate, descriptionDefect, defectDetailKey`,
      hmOffset: `++id, equipmentNo, hmOffset, resetDate, createdOn, createdBy, modifiedOn, modifiedBy, SiteId, SiteName`,
      preServiceReason: `++id, reason`,
      taskReference: `++id, workorder, filename, file, fileType, createdDate`,
      previousCrack: `++id, taskId, workOrder, previousCrack`,
      serviceFormComment: `++id, taskKey, taskDesc, taskComment, workOrder, createdBy, createdDate, updatedBy, updatedDate`,
      serviceFormPayloadCalibration: `id, header, detail`,
      serviceFormPreviousTandem: `id, ServiceFormPreviousTandem`,
      serviceFormPreviousReplacement: `id, ServiceFormPreviousTandem`,
      serviceFormReplacementDefaultValue: `id, ServiceFormReplacementDefaultValue`,
      intervetionReplacementDefaultValue: `id, ServiceFormReplacementDefaultValue`,
      syncProgress: `++id, syncDate, syncCounter`,
      syncToken: `++id, syncDate`,
      interventionFormComment: `++id, taskKey, taskDesc, taskComment, workOrder, createdBy, createdDate, updatedBy, updatedDate`,
      reloadCounter: `++id, counter`
    })
  }
}

export const db = new DexieSchema()
