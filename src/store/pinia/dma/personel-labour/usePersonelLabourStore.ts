import { defineStore } from 'pinia'
import { Option } from '@/core/types/misc/Option'
import {
  useAuthenticationStore
} from '../../application/useAuthenticationStore'
import { Employee } from '@/core/types/entities/dma/personel-labour/Employee'
import { AxiosResponse } from 'axios'
import { ApiResponse } from '@/core/types/misc/ApiResponse'
import ApiService from '@/core/services/ApiService'
import { DIRECT_MEMBER_API_URL } from './urls'
import {
  updateLoggedInStatusFromAPIResponse
} from '@/core/helpers/authentication-handler'
import { db } from '@/database/schema/DexieSchema'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const usePersonelLabourStore = defineStore({
  id: "personelLabour",
  state: () => {
    return {
      statePersonelLabours: [] as Option[]
    }
  },
  getters: {
    PersonelLabours: (state) => {
      return state.statePersonelLabours
    }
  },
  actions: {
    async getPersonalLabours() {
      const authStore = useAuthenticationStore()
      const params = {
        directid: authStore.user.EmployeeId,
        ver: "v1"
      }
      try {
        const response: AxiosResponse<ApiResponse<Employee>> = await ApiService.get(DIRECT_MEMBER_API_URL, "", new URLSearchParams(params).toString());
        // const labours = response.data.result.content.map((e) => {
        //   return {
        //     label: e.EmployeeName,
        //     value: e.EmployeeId
        //   }
        // })
        const labours: Option[] = []
        response.data.result.content.forEach((e) => {
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
        this.statePersonelLabours = labours
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async setPersonalLaboursLocal() {
      const fitter = await db.fitter.orderBy("label").toArray()
      this.statePersonelLabours = fitter
    }
  }
});
