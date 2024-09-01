/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from 'vue';

export default function useCalculate() {
  const cautionLimitNum = ref(2);
  const criticalLimitNum = ref(3);

  const calCautionLimit = (sampleCount: string) => {
    return (parseFloat(sampleCount) * cautionLimitNum.value).toString()
  }
  const calCriticalLimit = (sampleCount: string) => {
    return (parseFloat(sampleCount) * criticalLimitNum.value).toString()
  }
  return {
    calCautionLimit,
    calCriticalLimit,
  }
}
