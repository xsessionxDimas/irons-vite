/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from 'vue';

export default function useConditionState() {
/** @note
 * state 1 Sensor Data
 *  state 2 Oil Data
 *  state 3 CBM Threshold FC, MP, Ironforms
 */
  const stateCondition = ref(1);

  const calStateCondition = (cbmType: string) => {
    switch (cbmType.toLowerCase()) {
      case "vims":
      case "vhms":
      case "eqp":
        stateCondition.value = 1
        break;
      case "oil data":
        stateCondition.value = 2
        break;
      case "filter cut":
      case "mag plug":
      case "iron forms cbm":
        stateCondition.value = 3
        break
      default:
        stateCondition.value = 1
        break;
    }
  }

  return {
    stateCondition,
    calStateCondition,
  }
}
