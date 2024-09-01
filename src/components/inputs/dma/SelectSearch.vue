<template>
    <div class="row select-search">
        <div class="input-group col-md-4">
          <div class="form-control py-2 border-right-0 border d-flex align-items-center position-relative" @click="toggleClick" :class="props.disabled ? 'disabled': ''" v-html="selectedValue ? `<span style='color: #202124;'>${selectedValue}</span>` : `<span class='placeholder'>${placeholder}</span>`"></div>
          <span class="input-group-append">
            <button class="btn btn-outline-secondary border" :class="props.disabled ? 'disabled': ''" type="button" @click="toggleClick">
              <em class="fa" :class="caretClass"></em>
            </button>
          </span>
            <div v-if="toggle" class="option-wrapper m-0">
                <div class="w-100 top-0">
                    <div class="input-group col-md-4">
                        <span class="input-group-append">
                            <button class="p-5 btn btn-outline-secondary border-right-0 border" type="button">
                                <em class="fa fa-search"></em>
                            </button>
                        </span>
                        <input class="form-control py-2 border-left-0 border" type="text" v-model="searchValue" placeholder="Search here.." >
                    </div>
                </div>
                <hr style="background: lightgray;" />
                <ul class="text-left">
                    <li @click="optionSelected(opt)" class="option" v-for="(opt, indexOpt) in options" :key="indexOpt" v-html="optionWithBadge(opt)"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
  defineProps,
  defineEmits,
  PropType,
  onUnmounted,
  onMounted,
  watch,
} from 'vue';
import { Option } from "@/core/types/misc/Option";
import { isUndefined } from 'lodash';
import {
  statusBadge
} from "@/store/pinia/dma/e-form/helpers"

/* props */
const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<Option[]>
  },
  value: {
    required: false,
    type: String,
  },
  placeholder: {
    required: false,
    type: String,
    default: "Select here.."
  },
  displayLabel: {
    required: false,
    type: Boolean,
    default: false
  },
  disabled: {
    required: false,
    type: Boolean
  },
  dialogVisible: {
    required: false,
    type: Boolean,
    default: null
  }
});

/* emits */
const emits = defineEmits(["onSelected", "onFocus", "onLostFocus"]);

/* refs */
const toggle = ref(false);
const caretClass = ref("fa-chevron-down");
const searchValue = ref("");
const selectedValue = ref(props.value);

/* computed */
const options = computed(() => {
  if (searchValue.value == "") {
    return props.data;
  }
  return props.data.filter((element) => {
    if (element.labelPlain?.toLowerCase().includes(searchValue.value.toLowerCase()) || element.label?.toLowerCase().includes(searchValue.value.toLowerCase())) {
      return true;
    }
  });
});

/* methods */
const toggleClick = () => {
  toggle.value = !toggle.value;
  if (toggle.value) {
    caretClass.value = "fa-chevron-up";
    emits("onFocus");
  } else {
    caretClass.value = "fa-chevron-down";
    searchValue.value = "";
    emits("onLostFocus");
  }
}

const optionSelected = (value: Option) => {
  selectedValue.value = props.displayLabel ? value.label : value.value;
  toggle.value = false;
  caretClass.value = "fa-chevron-down";
  searchValue.value = "";
  /* emit event */
  emits('onSelected', value);
}

onMounted(() => {
  selectedValue.value = isUndefined(props.value) ? '' : props.value
})

onUnmounted(() => {
  selectedValue.value = ''
})

const dialog = computed(() => {
  return props.dialogVisible
})

const status = (item) => {
  return statusBadge(item.status, item.progress)
}

const optionWithBadge = (opt) => {
  const statusOption = status(opt)
  let badge = ""
  if (opt.status) {
    // badge = `<span class="status-badge p-1 ${statusBadgeColor(statusOption)} text-nowrap">${statusOption}</span>`
  }
  return `<span class="me-3">${opt.label}</span>` + badge
}

watch(dialog, () => {
  if (props.dialogVisible === false) {
    toggle.value = false
    caretClass.value = "fa-chevron-down";
    searchValue.value = "";
    selectedValue.value = "";
    emits("onLostFocus");
  }
})
</script>

<style lang="scss" scoped>
 @import "@/assets/sass/pages/floating-label.scss";
 @import "@/assets/sass/pages/select-search.scss";
</style>
<style lang="scss">

.select-search {
  .form-control {
    white-space: break-spaces;
    .placeholder {
      color: #A1A5B7 !important;
    }
  }
  .yellow {
    color: #CC9A06;
  }
  .red {
    color: #FF4842;
  }
 }
</style>
