import { Group } from "@/core/types/entities/dma/e-form/group";

export type classGeneratorParams = {
    groupId: string
    group: Group
    selectedGroup: Group | undefined
    isUpdated: boolean
    skipPreService: boolean
    enableSkipPreservice: boolean
    preServiceGroup: { doneTask: number, totalTask: number, groupName: string } | undefined
}

export function classGenerator(params: classGeneratorParams) {
  const classNames:string[] = [];
  if (params.groupId === params.selectedGroup?.id) classNames.push('active');
  if (params.group && params.group.isDisable && params.group.isDisable === "true") classNames.push('disabled');
  if (params.isUpdated && !params.skipPreService && params.enableSkipPreservice) {
    const preServiceIncomplete = params.preServiceGroup && params.preServiceGroup.doneTask !== params.preServiceGroup.totalTask;
    const isGroupNameExcluded = params.group.groupName !== params.preServiceGroup?.groupName && params.group.groupName !== "DEFECT_IDENTIFIED_SERVICE" && params.group.groupName !== "General";
    if (preServiceIncomplete && isGroupNameExcluded) {
      classNames.push('disabled');
    }
  }
  return classNames.join(' ');
}
