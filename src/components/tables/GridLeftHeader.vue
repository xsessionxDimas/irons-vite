<template>
  <div class="grid-left-header">
    <table aria-describedby="table">
      <tr
        v-for="(item, index) in headerdata"
        :key="item"
        :class="{ nodata: !datafinal[item.props] }"
      >
        <th>{{ item.header }}</th>
        <td
          v-show="!loading && datafinal[item.props]"
          v-for="(data, index) in datafinal[item.props]"
          :key="data"
        >
          <slot :name="item.props" :data="data" :col="propsdata[index]">
            {{ data || "-" }}
          </slot>
        </td>
        <td v-if="index == 0 && (loading || !datafinal[item.props])"></td>
        <td
          v-if="loading && index == 1"
          :rowspan="headerdata.length"
          class="text-center"
        >
          <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </td>
        <td
          v-else-if="!datafinal[item.props] && index == 1"
          :rowspan="headerdata.length"
        >
          {{ translate("NODATA", t, te) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRef,
  watch
} from "vue"
import { arrayToObject } from "@/core/helpers/json-formatter"
import { translate } from "@/core/helpers/language"
import { useI18n } from "vue-i18n"

export default defineComponent({
  props: ["data", "headerandprops", "loading"],
  setup(props) {
    const datafinal = ref(arrayToObject(props.data))
    const { t, te } = useI18n()
    const propsdata = toRef(props, "data")
    const headerdata = toRef(props, "headerandprops")

    const convertDatatoJson = () => {
      datafinal.value = arrayToObject(props.data)
    }

    watch(
      () => {
        return props.data
      },
      () => {
        convertDatatoJson()
      },
    )

    return {
      datafinal,
      propsdata,
      headerdata,
      translate,
      t,
      te,
    }
  },
})
</script>


<style lang="scss" scoped>
.grid-left-header {
  width: 100%;
  overflow-x: auto;
  table {
    table-layout: fixed;
    width: 100%;
  }
  tr:not(.nodata):hover {
    td,
    th {
      background-color: #f2f6fa;
    }
  }
  td,
  th {
    padding: 12px 0;
  }
  td {
    width: 200px;
    font-size: 12px;
    font-weight: 400;
    line-height: 23px;
    padding-right: 10px;
  }
  th {
    width: 250px;
    text-transform: capitalize;
    font-size: 12px;
    color: var(--el-table-header-font-color);
    font-weight: 600;
  }
  tr:not(:first-child) {
    td {
      color: var(--el-table-font-color);
    }
  }
  tr:first-child {
    th:first-of-type {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      padding-left: 10px;
    }
    th,
    td {
      background-color: #f3f6f9;
      font-weight: 600;
      color: var(--el-table-header-font-color);
    }
    td:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }
  tr {
    th:first-of-type {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
