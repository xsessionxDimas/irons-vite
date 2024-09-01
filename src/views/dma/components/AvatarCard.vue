<template>
 <div class="avatar-card py-3">
  <div class="row justify-content-center mb-0 mt-2">
    <template v-if="userPic != ''">
      <img class="px-0" style="height: 42px; width: 42px; border-radius: 28px;" :src="userPic" alt="">
    </template>
    <template v-else>
      <div class="symbol symbol-circle firstname-placeholder text-center d-flex flex-row justify-content-center align-items-center">
        <span>{{ initial }}</span>
      </div>
    </template>
  </div>
  <div class="col text-center mt-4">
    <h4>{{ user?.Name }}</h4>
    <span>{{ user?.Position }}</span> <br>
    <span>{{ user?.Location }}</span>
  </div>
</div>
</template>

<script lang="ts" setup>
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { computed } from 'vue';
import { isUndefined } from 'lodash'

const userStore = useAuthenticationStore()
const user = computed(() => {
  return userStore.user || {}
})

const userPic = computed(() => {
  return userStore.userPic || ''
})

const initial = computed(() => {
  return !isUndefined(userStore.user.Name) ? userStore.user.Name[0] : ''
})

</script>

<style lang="scss" scoped>
  .avatar-card {
    background-color: #F9FAFB;
    border-radius: 10px;
  }

  .firstname-placeholder {
    width: 42px;
    height: 42px;
    background-color: #18AF4A;

    span {
      font-size: 24px;
      color: white;
    }
  }
</style>
