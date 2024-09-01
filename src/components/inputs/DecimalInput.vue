<template>
  <div class="fv-row" :class="gridClass">
  <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item>
      <el-input
        v-model="inputValue"
        :placeholder="placeholder"
        class="select-bg-grey"
        :maxlength="max"
        @keypress="onlyNumber"
        @focus="removeDecimal"
        @blur="formatDecimal"
        @input="validate"
      ></el-input>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
} from "vue";

const props = defineProps({
  margin: {
    type: Boolean,
    default: true
  },
  gridClass: {
    required: false,
    type: String,
    default: ""
  },
  max: {
    type: Number,
    default: 524288
  },
  value: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  label: {
    required: false,
    type: String,
  },
  placeholder: {
    required: false,
    type: String,
    default: 'Input Text'
  },
  disabled: {
    default: false
  }
});
const emits = defineEmits(["handleChange"]);

const inputValue = computed({
  get: () => {
    return props.value;
  },
  set: (val) => {
    emits("handleChange", val);
  },
});

const validate = (e) => {
  let t = e;
  inputValue.value = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 3) : t;
}

// https://stackoverflow.com/a/52685887

const parseDecimal = (value) => {
  if (!value) {
    return '0.00';
  }
  const a = value.toString();
  const isNegative = a.startsWith('-');

  let b = a.split('.')[0];
  let c = a.split('.')[1];
  b = b === '' ? '0' : b.replace(/[^0-9]/g, '');
  if (c === undefined) c = '00';
  else if (c.length === 1) c += '0';
  else c = c.toString().substring(0, 2);

  return `${isNegative ? '-' : ''}${b}.${c}`;
}

const onlyNumber = (e) => {
  const keyCode = e.which ? e.which : e.keyCode;

  // only allow number and one dot
  if (
    (keyCode < 48 || keyCode > 57)
        && (keyCode !== 46 || inputValue.value.indexOf('.') !== -1)
  ) {
    // 46 is dot
    e.preventDefault();
  }
  // handle other number after 0
  if (inputValue.value[0] === '0' && inputValue.value[1] !== '.') {
    if (keyCode !== 46) {
      e.preventDefault();
    }
  }
}

const removeDecimal = () => {
  // check if nominal zero or zero decimal
  if (inputValue.value === '0' || inputValue.value === '0.00') {
    // set nominal to empty string
    inputValue.value = '';
  }
}

const formatDecimal = () => {
  let _nominal = inputValue.value;
  const num = inputValue.value.split('.')[1];
  if (parseFloat(_nominal) === 0) {
    inputValue.value = parseDecimal('0');
    return;
  }
  if (_nominal === '') {
    inputValue.value = parseDecimal('0');
    emits("handleChange", inputValue.value);
    return;
  }
  if (num !== '' || typeof num === 'undefined') {
    _nominal = parseDecimal(inputValue.value);
    emits("handleChange", _nominal);
    return;
  }
  _nominal += '00';
  inputValue.value = parseDecimal(_nominal);
}
</script>
