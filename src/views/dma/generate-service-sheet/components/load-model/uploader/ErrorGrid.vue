<template>
  <div class="error-summary">
    Data Invalid Please Check Documentation: https://bukittechnology.atlassian.net/wiki/spaces/BAA/pages/183566350/Generate+Service+Sheet, and please use the following formula excel for generate GUID: =LOWER(CONCATENATE(DEC2HEX(RANDBETWEEN(0;POWER(16;8));8);\"-\";DEC2HEX(RANDBETWEEN(0;POWER(16;4));4);\"-\";\"4\";DEC2HEX(RANDBETWEEN(0;POWER(16;3));3);\"-\";DEC2HEX(RANDBETWEEN(8;11));DEC2HEX(RANDBETWEEN(0;POWER(16;3));3);\"-\";DEC2HEX(RANDBETWEEN(0;POWER(16;8));8);DEC2HEX(RANDBETWEEN(0;POWER(16;4));4)))
  </div>
  <el-table :data="data"
      style="width: 100%" height="300">
      <el-table-column label="No" width="90" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lineError" label="Column" width="90" align="center">
        <template #default="scope">
          <span>{{ extractColumn(scope.row.lineError) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lineError" label="Rows" width="100" align="center">
        <template #default="scope">
          <span>{{ extractRows(scope.row.lineError) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="Error Message" />
    </el-table>
</template>

<script lang="ts" setup>
import { GenerateError } from '@/core/types/misc/GenerateError';
import { PropType, defineProps } from 'vue'

defineProps({
  data: {
    type: Array as PropType<GenerateError[]>,
    required: true
  }
})

const startIndex = 1

// methods
const extractColumn = (lineError: string): string => {
  return lineError[0]
}
const extractRows = (lineError: string): string => {
  return lineError.slice(1).replace('[', '').replace(']', '')
}
</script>

<style lang="scss" scoped>
  .error-summary {
    border: 1px solid;
    margin: 10px 0px;
    padding: 15px 10px 15px 50px;
    background-repeat: no-repeat;
    background-position: 10px center;
    color: #D8000C;
    background-color: #FFBABA;
  }
</style>
