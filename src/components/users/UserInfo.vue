<template>
    <div class="row justify-content-between" style="padding-right:0">
        <!-- left -->
        <div class="col-6">
            <div class="m-2 p-3 rounded d-flex flex-row" style="background:#F9FAFB; width:fit-content; border-radius: 12px;">
                <!-- circle foto-->
                <template v-if="userPic != ''">
                  <div class="symbol symbol-circle">
                    <NwImg
                      class="menu-avatar-img"
                      :src="userPic"
                      alt="metronic"
                   />
                </div>
                </template>
                <template v-else>
                  <div class="symbol symbol-circle firstname-placeholder text-center d-flex flex-row justify-content-center align-items-center">
                    <span>{{ initial }}</span>
                  </div>
                </template>
                <!-- information -->
                <div class="ml-1 d-flex flex-column" style="margin-left: 10px;">
                    <h6 style="font-size:12px; font-weight: 700; margin-bottom: 0;">{{ store.user.Name }}</h6>
                    <label style="font-size:12px; font-weight: 400;">{{ store.user.Position }}</label>
                    <label style="font-size:12px; font-weight: 400;">{{ store.user.Location }}</label>
                </div>
            </div>
        </div>
        <!-- right -->
        <div class="col-6">
            <div class="p-6 d-flex flex-row-reverse" style="text-align:end">
                <NwImg src="/media/logos/bumaau/logout.png" @click.prevent="btnSignOutClick" alt="logout button" width="40" height="40" style="cursor: pointer; margin-left: 10px" />
                <div class="d-flex align-items-center">
                  <online-status></online-status>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  onBeforeMount
} from 'vue'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { computed } from '@vue/reactivity'
import { isUndefined } from 'lodash'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'
import { useOnline } from '@vueuse/core'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  loading: {
    required: false,
    type: Boolean
  }
})

const emits = defineEmits(["onSignOut"]);

const online = useOnline()
const store = useAuthenticationStore();

const userPic = computed(() => {
  return store.userPic
})

const initial = computed(() => {
  return !isUndefined(store.user.Name) ? store.user.Name[0] : ''
})

const btnSignOutClick = () => {
  emits("onSignOut", null)
}


onBeforeMount(async () => {
  if (store.userPic == '') {
    await store.setUserProfilePic(!isOfflineOrSlowInternetConnection())
  }
})
</script>

<style lang="scss" scoped>
  .firstname-placeholder {
    width: 50px;
    height: 50px;
    background-color: #18AF4A;

    span {
      font-size: 24px;
      color: white;
    }
  }
  .date-updated {
    font-family: 'Public Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
  }
  .btn-sync {
    padding: 4px 10px !important;
    gap: 8px;
    background: #DFE3E8;
    border-radius: 8px;
    flex: none;
    order: 1;
    flex-grow: 0;
    width: 150px;
    font-size: 13px !important;
    font-weight: 600;
  }
</style>
