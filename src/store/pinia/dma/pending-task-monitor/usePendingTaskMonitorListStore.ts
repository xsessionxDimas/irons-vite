import {
  PendingTask
} from "@/core/types/entities/dma/pending-task-monitor/PendingTask";
import { db } from "@/database/schema/DexieSchema";
import { defineStore } from "pinia";
import { tableToArray } from "@/database/schema/DatabaseWrapper";
import { QueueTask } from "@/database/schema/QueueTask";
import { QueueFileTask } from "@/database/schema/QueueFileTask";


export const usePendingTaskMonitorListStore = defineStore({
  id: "pendingTaskMonitorList",
  state: () => {
    return {
      statePendingList: [] as PendingTask[],
      statePendingFileList: [] as PendingTask[],
      stateTaskList: [] as QueueTask[],
      stateTaskFileList: [] as QueueFileTask[],
      stateLoadingRetry: false,
      statePendingListNew: [] as PendingTask[]
    }
  },
  getters: {
    dataTasks: (state) => {
      return state.stateTaskList
    },
    fileTasks: (state) => {
      return state.stateTaskFileList
    }
  },
  actions: {
    async getPendingWOCount() {
      const pendingTaskArr = await db.pendingTask.filter((f) => {
        return f.syncStatus != 'Sync'
      }).toArray()
      const pendingWo: string[] = []
      pendingTaskArr.forEach((task) => {
        if (!pendingWo.includes(task.workorder)) {
          pendingWo.push(task.workorder)
        }
      })
      return pendingWo.length
    },
    async getPendingTaskList() {
      this.statePendingList = []
      const pendingTaskArr = (await db.pendingTask.toArray()).filter((f) => {
        return f.syncStatus != 'Sync'
      })
      const serviceFormList = await db.serviceSheetDetail.toArray()
      const interventionList = await db.interventionDetail.toArray()

      // get wo
      const pendingWo: string[] = []
      pendingTaskArr.forEach((task) => {
        if (!pendingWo.includes(task.workorder)) {
          pendingWo.push(task.workorder)
        }
      })

      // generate list
      pendingWo.forEach((wo) => {
        let taskPendingCounter = 0
        const pendingTask = {} as PendingTask
        pendingTask.workOrder = wo
        pendingTaskArr.forEach((task) => {
          if (task.workorder == wo) {
            // adding form name
            if (!pendingTask.form) {
              switch (task.module) {
                case "serviceForm":
                  pendingTask.form = "Digital Service Form"
                  break;
                case "Intervention":
                  pendingTask.form = "Component Intervention Form"
                  break;
                default:
                  pendingTask.form = ""
                  break;
              }
            }
            pendingTask.id = task.id
            // counting pendingTask
            taskPendingCounter++
          }
        })

        pendingTask.pendingTask = taskPendingCounter
        this.statePendingList.push(pendingTask)
      })

      // genererate equipment n pstype
      this.statePendingList.forEach(async (pendingList) => {
        switch (pendingList.form) {
          case "Digital Service Form":
            serviceFormList.forEach((serviceForm) => {
              if (serviceForm.general.workOrder == pendingList.workOrder) {
                pendingList.equipment = serviceForm.general.equipment
                pendingList.psType = serviceForm.general.psTypeId
              }
            })
            break
          case "Component Intervention Form":
            interventionList.forEach((intervention) => {
              if (intervention.sapWorkOrder == pendingList.workOrder) {
                pendingList.equipment = intervention.equipment
                pendingList.psType = ""
              }
            })
            break;
          default:
            pendingList.equipment = ""
            pendingList.psType = ""
            break;
        }
      })
    },
    async getPendingFileTaskList() {
      this.statePendingFileList = []
      const pendingTaskArr = (await db.pendingTaskFile.toArray()).filter((f) => {
        return f.syncStatus != 'Sync'
      })
      const serviceFormList = await db.serviceSheetDetail.toArray()
      const interventionList = await db.interventionDetail.toArray()

      // get wo
      const pendingWo: string[] = []
      pendingTaskArr.forEach((task) => {
        if (!pendingWo.includes(task.workorder)) {
          pendingWo.push(task.workorder)
        }
      })

      // generate list
      pendingWo.forEach((wo) => {
        let taskPendingCounter = 0
        const pendingTask = {} as PendingTask
        pendingTask.workOrder = wo
        pendingTaskArr.forEach((task) => {
          if (task.workorder == wo) {
            // adding form name
            if (!pendingTask.form) {
              switch (task.module) {
                case "serviceForm":
                  pendingTask.form = "Digital Service Form"
                  break;
                case "Intervention":
                  pendingTask.form = "Component Intervention Form"
                  break;
                default:
                  pendingTask.form = ""
                  break;
              }
            }
            pendingTask.id = task.id
            // counting pendingTask
            taskPendingCounter++
          }
        })

        pendingTask.pendingTask = taskPendingCounter
        this.statePendingFileList.push(pendingTask)
      })

      // genererate equipment n pstype
      this.statePendingFileList.forEach(async (pendingList) => {
        switch (pendingList.form) {
          case "Digital Service Form":
            serviceFormList.forEach((serviceForm) => {
              if (serviceForm.general.workOrder == pendingList.workOrder) {
                pendingList.equipment = serviceForm.general.equipment
                pendingList.psType = serviceForm.general.psTypeId
              }
            })
            break
          case "Component Intervention Form":
            interventionList.forEach((intervention) => {
              if (intervention.sapWorkOrder == pendingList.workOrder) {
                pendingList.equipment = intervention.equipment
                pendingList.psType = ""
              }
            })
            break;
          default:
            pendingList.equipment = ""
            pendingList.psType = ""
            break;
        }
      })
    },
    pendingList() {
      const sumByKey = {};
      // Iterate over array1 and add counts to the corresponding keys
      this.statePendingList.forEach((item) => {
        const { workOrder, form, equipment, psType, pendingTask } = item;
        const combinedKey = `${workOrder}-${form}-${equipment}-${psType}`;
        sumByKey[combinedKey] = Number((sumByKey[combinedKey] || 0)) + Number(pendingTask);
      });

      // Iterate over array2 and add counts to the corresponding keys
      this.statePendingFileList.forEach((item) => {
        const { workOrder, form, equipment, psType, pendingTask } = item;
        const combinedKey = `${workOrder}-${form}-${equipment}-${psType}`;
        sumByKey[combinedKey] = Number((sumByKey[combinedKey] || 0)) + Number(pendingTask);
      });

      // Convert the object back to an array of objects
      return Object.keys(sumByKey).map((combinedKey) => {
        const [workOrder, form, equipment, psType] = combinedKey.split('-');
        return {
          workOrder,
          form,
          equipment,
          psType,
          pendingTask: sumByKey[combinedKey]
        };
      });
    },
    getpendingList() {
      this.statePendingListNew = this.pendingList()
    },
    updatePendingList(wo) {
      let isDeleteWO = false
      this.statePendingListNew.forEach((item) => {
        if (item.workOrder == wo) {
          if (item.pendingTask > 0) {
            item.pendingTask--
            if (item.pendingTask == 0) {
              isDeleteWO = true
            }
            return
          }
        }
      })
      if (isDeleteWO) {
        this.statePendingListNew = this.statePendingListNew.filter((item) => {
          return item.workOrder != wo
        })
      }
    },
    async getTaskList() {
      this.stateTaskList = (await db.pendingTask.toArray()).filter((f) => {
        return f.syncStatus != 'Sync'
      }) as unknown as QueueTask[]
    },
    async getFileTaskList() {
      this.stateTaskFileList = (await db.pendingTaskFile.toArray()).filter((f) => {
        return f.syncStatus != 'Sync'
      }) as unknown as QueueFileTask[]
    },
    async toggleLoadingRetry(status: boolean) {
      this.stateLoadingRetry = status
    }
  },
})
