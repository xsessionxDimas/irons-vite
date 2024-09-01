import { formatDateWithUtcOffsetHelper } from "@/core/helpers/date-format";
import { IServiceLabour } from "@/core/interfaces/IServiceLabour";
import { Shift } from "@/core/types/entities/dma/component-intervention/Shift";

export default class ServiceLabourClass implements IServiceLabour {
  /* define fields here */
  private shiftList: Shift[]

  constructor(availableShift: Shift[]) {
    // base constructor
    this.shiftList = availableShift
  }

  public GetShift(): string {
    const currentTime = formatDateWithUtcOffsetHelper(import.meta.env.VITE_APP_TIME_ZONE_GMT as string, 'HH')
    return +currentTime < 18 ? 'Day Shift' : 'Night Shift'
  }

}
