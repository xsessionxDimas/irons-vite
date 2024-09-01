<template>
  <div
    v-if="!src || src === ''"
    :style="avatarStyle"
    class="container-avatar d-flex align-items-center"
  >
    <p class="text-white text-subheading centered font-medium w-100 m-0 text-bold">{{ initial.toUpperCase() }}</p>
    <slot />
  </div>
  <div v-else :style="avatarStyle" class="place-items-center rounded-circle">
    <img :src="src" alt="avatar" :style="avatarStyle" class="rounded-circle object-cover w-100" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { computed } from "@vue/reactivity";

const props = defineProps({
  size: {
    type: Number,
    default: 64,
  },
  src: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  background: {
    type: String,
    default: '#1976d2',
  },
});

const avatarStyle = computed(() => {
  return {
    width: `${props.size.toString()}px`,
    height: `${props.size.toString()}px`,
    background: `${props.background.toString()}`
  }
})
const initial = computed(() => {
  const nameword = props.placeholder.split(' ');
  return `${nameword[0][0]}${nameword[nameword.length - 1] && nameword.length > 1 ? nameword[nameword.length - 1][0] : ''}`
})
const src = computed(() => {
  return props.src;
});


</script>
<style scoped lang="scss">
.container-avatar {
  background-color: #1976d2;
  border-radius: 100%;
}
.centered {
  text-align: center;
}
</style>
