export type ListItem = {
  dailyScheduleId: number,
  unitNumber: string,
  smuDue: string,
  workOrder: string,
  psType: string,
  dateService: Date,
  lastWorkOrder: string,
  lastPsType: string,
  lastDateService: Date,
  shift: string,
  startDate: Date,
  endDate: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  changedBy: string,
  changedOn: Date,
  status: string
}
