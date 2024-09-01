/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from 'vue';

export default function useConditionState() {
/** @note
 *  state 1 Everything else
 *  state 2 FC, MP, Ironforms
 *  state 3 Oil Data
 */
  const stateCondition = ref(1);

  const calStateCondition = (cbmType: string) => {
    switch (cbmType.toLowerCase()) {
      case "filter cut":
      case "mag plug":
      case "iron forms cbm":
        stateCondition.value = 2
        break
      case "oil data":
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
