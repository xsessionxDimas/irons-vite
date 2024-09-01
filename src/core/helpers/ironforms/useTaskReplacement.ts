// import { ref } from "vue";
import { Group } from "@/core/types/entities/dma/e-form/group";
import { SubGroup } from "@/core/types/entities/dma/e-form/subGroup";
// import { TaskGroup } from '@/core/types/entities/dma/e-form/taskGroup';
import { Task } from "@/core/types/entities/dma/e-form/Task";
// import { Item } from "@/core/types/entities/dma/e-form/Item";

export const useTaskReplacement = (activeGroup: Group) => {
  const getTaskReplacement = (activeGroupTaskId: string, subGroup: SubGroup[]) => {
    const taskReplacementArray: Task[] = []
    subGroup[0].taskGroup.forEach((taskGroupItem) => {
      const filteredArray = taskGroupItem.task.filter((taskItem) => {
        return taskItem.groupTaskId === activeGroupTaskId
      })
      taskReplacementArray.push(...filteredArray)
    });
    return taskReplacementArray
  };

  const getTaskReplacementInSubGroup = (subGroup: SubGroup[]) => {
    const taskReplacementArray: Task[] = []
    subGroup[0].taskGroup.forEach((taskGroupItem) => {
      const filteredArray = taskGroupItem.task.filter((taskItem) => {
        return taskItem.groupTaskId
      })
      taskReplacementArray.push(...filteredArray)
    });
    const filterAutoReplacement = taskReplacementArray.filter((task) => {
      return task.rating === "AUTOMATIC_REPLACEMENT" || task.rating === "AUTOMATIC_REPLACEMENT_GAP"
    })
    return filterAutoReplacement
  };

  const getCameraItem = (activeGroupTaskId: string, subGroup: SubGroup[]) => {
    const taskCamera = getTaskReplacement(activeGroupTaskId, subGroup).find((task) => {
      return task.rating === "CAB_SIDE"
    })
    return taskCamera
  }

  const getReplacementTool = (activeGroupTaskId: string, subGroup: SubGroup[]) => {
    const taskAutomaticReplacement = getTaskReplacementInSubGroup(subGroup).filter((task) => {
      return task.groupTaskId === activeGroupTaskId
    })

    let tool = ""
    switch (taskAutomaticReplacement[0].SectionData) {
      case "HV Alternator":
        tool = "alternator"
        break;
      case "Retarder Grid Box 1":
      case "Retarder Grid Box 2":
        tool = "blower motor";
        break;
      default:
        break;
    }

    return tool
  }

  return {
    activeGroup,
    getTaskReplacement,
    getCameraItem,
    getTaskReplacementInSubGroup,
    getReplacementTool
  }
};
