<template>
    <div class="row">
        <div class="input-group col-md-4">
            <div class="form-floating flex-fill">
              <label>{{  fieldLabel }}</label>
              <input class="form-control border-right-0 border"
              readonly
              @click="toggleClick" style="height: 100%;"
              type="text" :disabled="props.disabled"
              :class="[props.disabled ? 'disabled': '', 'form-floating']"
              :value="selectedValue">
            </div>
            <span class="input-group-append">
                <button class="btn btn-outline-secondary border form-floating" :class="props.disabled ? 'disabled': ''" type="button" @click="toggleClick">
                    <em class="fa" :class="caretClass"></em>
                </button>
            </span>
            <div v-if="toggle" class="option-wrapper">
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
                    <li @click="optionSelected(opt)" class="option" v-for="(opt, index) in options" :key="index">{{ opt.label }}</li>
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
  defineExpose,
} from 'vue';
import { Option } from "@/core/types/misc/Option";
import { isUndefined } from 'lodash';


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
  fieldLabel: {
    required: true,
    type: String
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
    if (element.label.toLowerCase().includes(searchValue.value.toLowerCase())) {
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

defineExpose({
  optionSelected
})
</script>

<style lang="scss" scoped>
 @import "@/assets/sass/pages/floating-label.scss";
 @import "@/assets/sass/pages/select-search.scss";
</style>
