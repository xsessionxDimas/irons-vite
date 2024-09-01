import { defineStore } from 'pinia'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse } from '@/core/types/misc/ApiResponse'
import ApiService from '@/core/services/ApiService'
import {
  ACTIVE_SYMPTOM_API_URL,
  ACTIVE_CAUSES_API_URL,
  ACTIVE_ACTION_API_URL,
  ACTIVE_NA_API_URL,
  ACTIVE_CBM_MAPPING_API_URL,
  DIRECT_MEMBER_API_URL,
  LOOKUP_DMA_API_URL,
  LOOKUP_OWNERSHIP_API_URL
} from './urls'
import { Symptom } from '@/core/types/entities/dma/masters/Symptom'
import { Causes } from '@/core/types/entities/dma/masters/Causes'
import { Action } from '@/core/types/entities/dma/masters/Action'
import { NACondition } from '@/core/types/entities/dma/masters/NACondition'
import { CBMMapping } from '@/core/types/intervention/CBMMapping'
import { Employee } from '@/core/types/entities/dma/personel-labour/Employee'
import { Option } from '@/core/types/misc/Option'
import { db } from '@/database/schema/DexieSchema'
import {
  useAuthenticationStore
} from '../../application/useAuthenticationStore'
import { Position } from '@/core/types/entities/dma/masters/Position'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { Ownership } from '@/core/types/entities/dma/masters/Ownership'

export const useMasterStore = defineStore({
  id: "master",
  state: () => {
    return {
      stateSymptoms: [] as Symptom[],
      stateCauses: [] as Causes[],
      stateActions: [] as Action[],
      stateNAConditions: [] as NACondition[],
      stateCBMMappings: [] as CBMMapping[],
      stateFitters: [] as Option[],
      statePositions: [] as Option[],
      stateMasterIsSet: false,
      stateMasterFitterIsSet: false,
      stateOwnershipList: [] as Ownership[],
      stateMasterPhase: ''
    }
  },
  getters: {
    Symptoms: (state) => {
      return state.stateSymptoms
    },
    Causes: (state) => {
      return state.stateCauses
    },
    Actions: (state) => {
      return state.stateActions
    },
    NAConditions: (state) => {
      return state.stateNAConditions
    },
    CBMMappings: (state) => {
      return state.stateCBMMappings
    },
    Fitters: (state) => {
      return state.stateFitters
    },
    Positions: (state) => {
      return state.statePositions
    },
    Ownership: (state) => {
      return state.stateOwnershipList
    }
  },
  actions: {
    getSymptomData(): Promise<AxiosResponse<ApiResponse<Symptom>>> {
      return ApiService.get(`${ACTIVE_SYMPTOM_API_URL}`)
    },
    getActionData(): Promise<AxiosResponse<ApiResponse<Action>>> {
      return ApiService.get(`${ACTIVE_ACTION_API_URL}`)
    },
    getCausesData(): Promise<AxiosResponse<ApiResponse<Causes>>> {
      return ApiService.get(`${ACTIVE_CAUSES_API_URL}`)
    },
    getNAConditionData(): Promise<AxiosResponse<ApiResponse<NACondition>>> {
      return ApiService.get(`${ACTIVE_NA_API_URL}`)
    },
    getCBMMappingData(): Promise<AxiosResponse<ApiResponse<CBMMapping>>> {
      return ApiService.get(`${ACTIVE_CBM_MAPPING_API_URL}`)
    },
    getOwnershipData(): Promise<AxiosResponse<ApiResponse<Ownership>>> {
      const params = {
        ver: "v1",
        Page: "1",
        PageSize: "100000",
      }
      return ApiService.get(`${LOOKUP_OWNERSHIP_API_URL}`, '', new URLSearchParams(params).toString())
    },
    getFittersData(): Promise<AxiosResponse<ApiResponse<Employee>>> {
      const authStore = useAuthenticationStore()
      const params = {
        directid: authStore.user.EmployeeId,
        ver: "v1"
      }
      return ApiService.get(DIRECT_MEMBER_API_URL, "", new URLSearchParams(params).toString())
    },
    getPositionsData(): Promise<AxiosResponse<SingleApiResponse<Position>>> {
      const params = {
        Position: "",
        PositionDescription: ""
      }
      return ApiService.post(`${LOOKUP_DMA_API_URL}?ver=v1`, params as AxiosRequestConfig)
    },
    async getSymptoms() {
      const others = [{
        id: 0,
        symptom: 'Other'
      }]
      this.stateSymptoms = [...(await db.symptom.toArray()), ...others]
    },
    async getActions() {
      const others = [{
        id: 0,
        action: 'Other'
      }]
      this.stateActions = [...(await db.action.toArray()), ...others]
    },
    async getCauses() {
      const others = [{
        id: 0,
        causes: 'Other'
      }]
      this.stateCauses = [...(await db.causes.toArray()), ...others]
    },
    async getNAConditions() {
      const others = [{
        id: 0,
        naCondition: 'Other',
        reviseNaCondition: 'Other'
      }]
      this.stateNAConditions = [...(await db.naCondition.toArray()), ...others]
    },
    async getCBMMappings() {
      this.stateCBMMappings = await db.cbmMapping.toArray()
    },
    async getFitters() {
      this.stateFitters = await db.fitter.toArray()
    },
    async getPositions() {
      this.statePositions = await db.position.toArray()
    },
    async getOwnership() {
      this.stateOwnershipList = await db.ownership.toArray()
    },
    async storeSymptomToLocalDB(data: Symptom[]) {
      await db.symptom.clear()
      await db.symptom.bulkAdd(data)
    },
    async storeActionToLocalDB(data: Action[]) {
      await db.action.clear()
      await db.action.bulkAdd(data)
    },
    async storeCausesToLocalDB(data: Causes[]) {
      await db.causes.clear()
      await db.causes.bulkAdd(data)
    },
    async storeNAConditionToLocalDB(data: NACondition[]) {
      await db.naCondition.clear()
      await db.naCondition.bulkAdd(data)
    },
    async storeCBMMappingsToLocalDB(data: CBMMapping[]) {
      await db.cbmMapping.clear()
      await db.cbmMapping.bulkAdd(data)
    },
    async storeFittersToLocalDB(data: Employee[]) {
      const labours: Option[] = []
      data.forEach((e) => {
        const a = {
          label: e.EmployeeName,
          value: e.EmployeeId
        }
        const existLabour = labours.find((labour) => {
          return labour.value == e.EmployeeId
        })
        if (!existLabour) {
          labours.push(a)
        }
      })
      await db.fitter.clear()
      await db.fitter.bulkAdd(labours)
    },
    async storePositionsToLocalDB(data: Position) {
      const positions = data.position.map((e) => {
        return {
          label: e,
          value: e
        }
      })
      await db.position.clear()
      await db.position.bulkAdd(positions)
    },
    async storeOwnershipToLocalDB(data: Ownership[]) {
      const ownership = data.map((e) => {
        return {
          equipmentNumber: e.equipmentNumber,
          ownership: e.ownership,
          serialNumber: e.serialNumber
        }
      })
      await db.ownership.clear()
      await db.ownership.bulkAdd(ownership)
    },
    async getCBMMappingDataFromServer(): Promise<void> {
      try {
        const dtCBMMappings = await this.getCBMMappingData()
        this.stateMasterPhase = 'cbmmappings start'
        await this.storeCBMMappingsToLocalDB(dtCBMMappings.data.result.content)
        this.getCBMMappings()
      } catch (error) {
        console.log("error get CBM mapping");
      }
    },
    async getMasterDataFromServer(): Promise<void> {
      if (!this.stateMasterIsSet) {
        await Promise.all([
          this.getSymptomData(),
          this.getActionData(),
          this.getCausesData(),
          this.getNAConditionData(),
          this.getPositionsData(),
          this.getOwnershipData()
        ]).then(async ([
          dtSymtoms,
          dtActions,
          dtCauses,
          dtConditions,
          dtPositions,
          dtOwnership
        ]) => {
          try {
            this.stateMasterPhase = 'symptom start'
            await this.storeSymptomToLocalDB(dtSymtoms.data.result.content)
            this.stateMasterPhase = 'action start'
            await this.storeActionToLocalDB(dtActions.data.result.content)
            this.stateMasterPhase = 'causes start'
            await this.storeCausesToLocalDB(dtCauses.data.result.content)
            this.stateMasterPhase = 'na condition start'
            await this.storeNAConditionToLocalDB(dtConditions.data.result.content)
            this.stateMasterPhase = 'positions start'
            await this.storePositionsToLocalDB(dtPositions.data.result.content)
            this.stateMasterPhase = 'ownership start'
            await this.storeOwnershipToLocalDB(dtOwnership.data.result.content)
            await this.getSymptoms()
            await this.getActions()
            await this.getCauses()
            await this.getNAConditions()
            await this.getPositions()
            await this.getOwnership()
            await this.getOwnership()
          } catch (error) {
            console.log('error master data api', error)
            console.log('phase', this.stateMasterPhase)
          }
          this.stateMasterIsSet = true
        })
      } else {
        await this.getSymptoms()
        await this.getActions()
        await this.getCauses()
        await this.getNAConditions()
        await this.getPositions()
        await this.getOwnership()
        await this.getOwnership()
      }
    },
    async getMasterDataFitterFromServer(): Promise<void> {
      return await this.getFittersData().then(async (
        dtFitters
      ) => {
        await this.storeFittersToLocalDB(dtFitters.data.result.content)
        await this.getFitters()
      })
    },
    resetMasterIsSet() {
      this.stateMasterIsSet = false
      this.stateMasterFitterIsSet = false
    }
  }
})
