export type OfflineDailySchedule = {
  id: number,
  smuDue: string,
  workOrder: string,
  unitNumber: string,
  psType: string,
  shift: string,
  equipmentModel: string
  equipmentModelName: string,
  status: string,
  progress?: string,
  syncStatus?: string
  date?: string,
  label: string,
  value: string,
  icon?: string,
}
