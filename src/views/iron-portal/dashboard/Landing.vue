<template>
  <!-- Button -->
  <div class="d-flex flex-column justify-content-center align-items-center flex-wrap h-100">
    <el-row>
      <el-col>
        <router-link :to="menuList[0].MenuName">
          <el-button
            class="start-button text-large"
            type="success"
            size="large"
          >
            Start IronPortal
          </el-button>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeMount
} from 'vue'
import { useMenuStore } from '@/store/pinia/application/useMenuStore'
import { isFunction } from 'lodash'
import {
  checkSignInStatus,
  checkDMASignInStatus,
} from '@/core/helpers/get-user-info'
import { useOnline } from '@vueuse/core'
import { useMsal } from '@/msal/api/useMsal'

const online = useOnline()
const menuStore = useMenuStore();
const { instance } = useMsal()

const notAllowedPageNames = [
  "CBM Compliance Report",
]

const menuList = computed(() => {
  if (isFunction(menuStore.menu.getAllProductMenu)) {
    const products = menuStore.menu.getAllProductMenu("IronPortal");
    const dashboardMenu = products.find((e) => {
      return e.MenuName.includes("/ironportal-dashboard")
    })
    if (dashboardMenu) {
      const menu = menuStore.menu.getAllFeatureMenu(dashboardMenu.MenuId)
      return menu.filter((menu) => {
        return notAllowedPageNames.indexOf(menu.PageName) < 0; // Returns true for menu that's not found in notAllowedPageNames.
      });
    }
  }
  return [{ MenuName: '/ironportal-dashboard' }]
});

onBeforeMount(async () => {
  await checkSignInStatus(instance)
  await checkDMASignInStatus(online.value, instance)
});

</script>

<style scoped>
.start-button {
  margin: 0 auto;
  width: 10em;
  height: 3em;
}
</style>
