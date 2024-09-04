import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterView,
} from "vue-router";
import { useBreadcrumbsStore } from "../store/templates/useBreadcrumbStore";
import { useConfigStore } from "../store/templates/useConfigStore";
import { Mutations, Actions } from "../store/enums/StoreEnums";
import { breadcrumbMapper } from "../core/data/menu-mapper";
// ADM Routes
import BusinessPartnerRoutes from "./iron-lake/BusinessPartnerRoutes";
import EquipmentRoutes from "./iron-lake/EquipmentRoutes";
import TaskRoutes from "./iron-lake/TaskRoutes";
import MaintenanceRoutes from "./iron-lake/MaintenanceRoutes";
import ParameterRoutes from "./iron-lake/ParameterRoutes";
import DmaRoutes from "./dma/dmaRoutes";
import CrackAssignmentRoutes from "./iron-lake/CrackAssignmentRoutes";
import ReportRoutes from "./iron-lake/ReportRoutes";
import EmployeeRoutes from "./iron-lake/EmployeeRoutes";
import AssetsRoutes from "./iron-lake/AssetsRoutes";
import MasterRoutes from "./iron-lake/MasterRoutes";
import ConfigIronPortal from "./iron-lake/ConfigRoutes";
import ILOrganizationUnitRoutes from './iron-lake/IronlakeOrganizationUnitRoutes'
import RoleManagementRoutes from "./iron-lake/RoleManagementRoutes";
// IronPortal Routes
import IronPortalDashboardRoutes from "./iron-portal/IronPortalDashboardRoutes";
import IronPortalConfigurationRoutes from "./iron-portal/IronPortalConfigurationRoutes";
import IronPortalTransactionalRoutes from "./iron-portal/IronPortalTransactionalRoutes";
import IronPortalDashboardMenuRoutes from "./iron-portal/IronPortalDashboardMenuRoutes";
import IronPortalHistoricalRoutes from "./iron-portal/IronPortalHistoricalRoutes";
import {
  useNewCameraStore
} from "../store/pinia/application/refactor/useNewCameraStore";
import { aesDecode } from "../core/helpers/encryption";
import { nextTick } from "vue";
import { db } from "../database/schema/DexieSchema";
import { useAnalyticApi } from "../analytics/api/analyticApi";



const staticTitle = "BUMA AUSTRALIA";

const authPage = (to, from, next) => {
  if (localStorage.getItem('user-menu')) {
    const availableMenu = JSON.parse(aesDecode(localStorage.getItem('user-menu') || '', import.meta.env.VITE_APP_ENC_SALT as string))
    const isAuth = availableMenu.filter((menu) => {
      return menu.MenuName.includes(to.path)
    })
    if (isAuth.length < 1) {
      next({ name: '401' });
    } else {
      next();
    }
  } else {
    next({ name: 'signin' })
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => {
      return import("../layout/NoSideLayout.vue");
    },
    children: [
      {
        path: "/dashboard",
        name: "mydashboard",
        meta: {
          title: `${staticTitle} - Dashboard`,
          analytic: {
            module: 'irons',
            productCode: 'general',
            menu: 'dashboard',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/Dashboard.vue");
        },
      },
      {
        path: "/personal-info",
        name: "personalinfo",
        meta: {
          title: `${staticTitle} - Personal Info`,
        },
        component: () => {
          return import("../views/Profile.vue");
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: () => {
      return import("../layout/FullscreenLayout.vue");
    },
    children: [
      // ================================================================
      // ========================== Ash Silo ============================
      // ================================================================
      {
        path: "/ash-silo",
        name: "ashsilo",
        meta: {
          title: `${staticTitle} - Ash Silo Dashboard`,
        },
        beforeEnter: authPage,
        component: () => {
          return import("../views/ash-silo/pbi-embedded/Index.vue")
        },
      },
    ],
  },
  {
    path: "/",
    component: () => {
      return import("../layout/DMAFormLayout.vue");
    },
    children: DmaRoutes(staticTitle)
  },
  {
    path: "/",
    component: () => {
      return import("../layout/DMALayout.vue");
    },
    children: [
      {
        path: "/ironforms",
        name: "ironforms",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'dashboard',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/Home.vue")
        },
      },
    ]
  },
  {
    path: "/",
    component: () => {
      return import("../views/dma/layout/SidebarLayout.vue");
    },
    children: [
      {
        path: "/ironforms/pending-task-monitor",
        name: "pendingtaskmonitor",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'pending task monitor',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/pending-task-monitor/Index.vue");
        },
      },
      {
        path: "/ironforms/identified-defects",
        name: "identifieddefects",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'identified defect',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/identified-defects/List.vue");
        },
      },
      {
        path: "/ironforms/defects",
        name: "defects",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'defects approval',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects/List.vue");
        },
      },
      {
        path: "/ironforms/defects-planner",
        name: "defectsplanner",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'plannner defects approval',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects-planner/List.vue");
        },
      },
      {
        path: "/ironforms/monitoring-status",
        name: "monitoringstatus",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'monitoring status',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/monitoring-status/Index.vue")
        },
      },
      {
        path: "/ironforms/approval",
        name: "approval",
        meta: {
          title: `${staticTitle} - IronForms`
        },
        component: () => {
          return import("../views/dma/approval/Index.vue")
        },
      },
      {
        path: "/ironforms/sos-print-label",
        name: "sosprintlabel",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'sos print label',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/sos-print-label/Index.vue");
        },
      },
    ]
  },
  {
    path: "/",
    component: () => {
      return import("../views/dma/layout/NoSidebarLayout.vue");
    },
    children: [
      {
        path: "/ironforms/defects/detail",
        name: "defectsdetail",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects/Detail.vue");
        },
      },
      {
        path: "/ironforms/defects/detail-planner",
        name: "defectsdetailplanner",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'planner defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects-planner/Detail.vue");
        },
      },
      {
        path: "/ironforms/identified-defects/service-form-detail",
        name: "identifieddefectsserviceformdetail",
        meta: {
          title: `${staticTitle} - IronForms`,
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'identified defect Service Form Detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/identified-defects/service-form/DefectDetail.vue");
        },
      },
      {
        path: "/ironforms/defects/interim",
        name: "defectsinterimdetail",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'interim defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects/components/interim-engine-service/Detail.vue");
        },
      },
      {
        path: "/ironforms/defects/interim-planner",
        name: "defectsinterimdetailplanner",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'interim planner defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects-planner/interim-engine-service/Detail.vue");
        },
      },
      {
        path: "/ironforms/defects/intervention",
        name: "defectsinterventiondetail",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'intervention defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects/components/component-intervention/Detail.vue");
        },
      },
      {
        path: "/ironforms/defects/intervention-planner",
        name: "defectsinterventiondetailplanner",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'intervention planner defect detail',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/defects-planner/component-intervention/Detail.vue");
        },
      },
      {
        path: "/ironforms/sos-print-label/preview",
        name: "sosprintlabelpreview",
        meta: {
          analytic: {
            module: 'irons',
            product: 'ironforms',
            menu: 'sos print label preview',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/dma/sos-print-label/Preview.vue");
        },
      },
    ]
  },
  {
    path: "/ironforms/versionhistory",
    name: "changelog",
    meta: {
      analytic: {
        module: 'irons',
        product: 'ironforms',
        menu: 'version history',
        action: 'view'
      }
    },
    component: () => {
      return import("../views/dma/change-log/Index.vue");
    }
  },
  {
    path: "/ironforms/versionhistory/:model/:pstype",
    component: () => {
      return import("../views/dma/change-log/Index.vue");
    }
  },
  {
    path: "/ironforms/versionhistory/:menu",
    name: "taskcollection",
    component: () => {
      return import("../views/dma/change-log/Index.vue");
    }
  },
  {
    path: "/ironforms/formpreview/:model/:pstype",
    name: "formpreview",
    component: () => {
      return import("../views/dma/change-log/FormPreview.vue");
    }
  },
  // ================================================================
  // ================= IronPortal Version History ===================
  // ================================================================
  {
    path: "/ironportal/versionhistory",
    name: "changelogIronportal",
    meta: {
      analytic: {
        module: 'irons',
        productCode: 'ironportal',
        menu: 'version history',
        action: 'view'
      }
    },
    component: () => {
      return import("../views/iron-portal/change-log/Index.vue");
    }
  },
  {
    path: "/",
    component: () => {
      return import("../layout/Layout.vue");
    },
    children: [
      // ================================================================
      // ========================== IronPortal ==========================
      // ================================================================
      {
        path: "/ironportal",
        name: "ironportal",
        beforeEnter: authPage,
        meta: {
          title: `${staticTitle} - IronPortal`,
          analytic: {
            module: 'irons',
            productCode: 'ironportal',
            menu: 'dashboard',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/iron-portal/Landing.vue")
        },
      },
      {
        path: "/ironportal/iron-portal-configuration",
        component: RouterView,
        beforeEnter: authPage,
        children: IronPortalConfigurationRoutes(staticTitle, "IronPortal"),
        redirect: "/ironportal/iron-portal-configuration/type"
      },
      {
        path: "/ironportal/iron-portal-transactional",
        component: RouterView,
        beforeEnter: authPage,
        children: IronPortalTransactionalRoutes(staticTitle),
        redirect: "/ironportal/iron-portal-transactional/counter-reading"
      },
      // ================================================================
      // ======================= Administration =========================
      // ================================================================
      {
        path: "/administration",
        name: "administration",
        meta: {
          title: `${staticTitle} - Administration`
        },
        component: () => {
          return import("../views/administration/Landing.vue")
        },
      },
      // ================================================================
      // =============== Ironlake menus with Breadcrumbs ================
      // ================================================================
      {
        path: "/ironlake",
        name: "ironlake",
        meta: {
          title: `${staticTitle} - Iron Lake`
        },
        component: () => {
          return import(/* webpackChunkName: "ironlake" */ "../views/iron-lake/Landing.vue")
        },
        beforeEnter: authPage,
      },
      {
        path: "/ironlake/business-partner",
        component: RouterView,
        beforeEnter: authPage,
        children: BusinessPartnerRoutes(staticTitle),
      },
      {
        path: "/ironlake/equipment",
        component: RouterView,
        beforeEnter: authPage,
        children: EquipmentRoutes(staticTitle),
      },
      {
        path: "/ironlake/maintenance",
        component: RouterView,
        beforeEnter: authPage,
        children: MaintenanceRoutes(staticTitle),
      },
      {
        path: "/ironlake/task",
        component: RouterView,
        beforeEnter: authPage,
        children: TaskRoutes(staticTitle),
      },
      {
        path: "/ironlake/parameter",
        component: RouterView,
        beforeEnter: authPage,
        children: ParameterRoutes(staticTitle),
      },
      {
        path: "/ironlake/crack-assignment",
        component: RouterView,
        beforeEnter: authPage,
        children: CrackAssignmentRoutes(staticTitle),
      },
      {
        path: "/ironlake/report",
        component: RouterView,
        beforeEnter: authPage,
        children: ReportRoutes(staticTitle),
      },
      {
        path: "/ironlake/employee-management",
        component: RouterView,
        beforeEnter: authPage,
        children: EmployeeRoutes(staticTitle),
      },
      {
        path: "/ironlake/organization-unit",
        component: RouterView,
        beforeEnter: authPage,
        children: ILOrganizationUnitRoutes(staticTitle),
      },
      {
        path: "/ironlake/role-management",
        component: RouterView,
        beforeEnter: authPage,
        children: RoleManagementRoutes(staticTitle),
      },
      {
        path: "/ironlake/config",
        component: RouterView,
        beforeEnter: authPage,
        children: ConfigIronPortal(staticTitle, 'IronLake'),
      },
    ],
  },
  // ================================================================
  // ========================= Iron Lake ============================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronLakeLayout.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironlake/asset",
        component: RouterView,
        beforeEnter: authPage,
        children: AssetsRoutes(staticTitle),
      },
      {
        path: "/ironlake/master",
        component: RouterView,
        beforeEnter: authPage,
        children: MasterRoutes(staticTitle),
      },
    ],
  },
  // ================================================================
  // ===================== IronPortal Dashboard =====================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayout.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal-dashboard",
        name: "ironportaldashboard",
        meta: {
          title: `${staticTitle} - IronPortal`
        },
        component: () => {
          return import("../views/iron-portal/dashboard/Landing.vue")
        },
      },
      {
        path: "/ironportal-dashboard",
        component: RouterView,
        children: IronPortalDashboardRoutes(staticTitle),
      },
    ],
  },
  // ================================================================
  // ================= IronPortal Dashboard No Menu =================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayoutNoMenu.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal/ironportal-dashboard",
        component: RouterView,
        children: IronPortalDashboardMenuRoutes(staticTitle)
      },
    ],
  },
  // ================================================================
  // ================ IronPortal Historical No Menu =================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayoutNoMenu.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal/iron-portal-historical",
        component: RouterView,
        children: IronPortalHistoricalRoutes(staticTitle),
        redirect: "/ironportal/iron-portal-historical/comp-health"
      },
    ],
  },
  {
    path: "/",
    component: () => {
      return import("../components/page-layouts/Auth.vue");
    },
    children: [
      {
        path: "/sign-in",
        name: "signin",
        meta: {
          analytic: {
            module: 'irons',
            productCode: 'general',
            menu: 'sign-in',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/crafted/authentication/basic-flow/SignIn.vue");
        },
      },
      {
        path: "/sign-in-dma",
        name: "signindma",
        component: () => {
          return import("../views/crafted/authentication/basic-flow/SignInDMA.vue");
        },
      },
      {
        path: "/password-reset",
        name: "passwordreset",
        component: () => {
          return import(
            "../views/crafted/authentication/basic-flow/PasswordReset.vue"
          );
        },
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => {
      return import("../views/crafted/authentication/Error404.vue");
    },
  },
  {
    path: "/401",
    name: "401",
    component: () => {
      return import("../views/crafted/authentication/Error401.vue");
    },
  },
  {
    path: "/ash-silo-report",
    name: "ashsiloreport",
    component: () => {
      return import("../views/public/Index.vue");
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


export default {
  install(app) {
    router.install(app)
    router.afterEach((to, from, failure) => {
      (async function () {
        if (!failure) {
          nextTick(async () => {
            const analyticApi = useAnalyticApi();
            if (analyticApi && analyticApi.provider) {
              const user = await db.userInfo.toCollection().first()
              if (user && user.Email) {
                const userAnalyticPayload = {
                  uniqueId: user.EmployeeId.toString(),
                  name: user.Name,
                  email: user.Email
                }
                const analyticService = analyticApi.provider;
                /* need to set user */
                analyticService.setUser(userAnalyticPayload)
                if (!analyticService.isUserIdentified) return
                const args = to.meta.analytic as AnalyticApiAppInfo & Pick<AnalyticApiOptions, 'productCode'>;
                if (args) {
                  console.log(args)
                  const eventName = `${args.module}_${args.productCode}_${args.menu}_`;
                  analyticService.eventAction(eventName, "view", to.fullPath, args);
                }
              }
            }
          });
          const counter = await db.reloadCounter.toArray()[0]
          if (counter) {
            counter.counter = 1
          }
        }
      })();
    });

    router.onError(async (error) => {
      if (/loading chunk \d* failed./i.test(error.message) || (/loading CSS chunk \d* failed./i.test(error.message))) {
        const counter = await db.reloadCounter.toArray()[0]
        if (!counter) {
          await db.reloadCounter.add({
            counter: 1
          })
        } else {
          if (counter.counter > 5) return
        }
        window.location.reload()
      }
    })

    router.beforeEach(async (to, _from, next) => {
      if (to.fullPath == '/404' && to.redirectedFrom?.path.includes('code=')) {
        return {
          path: '/sign-in',
          force: true
        }
      }

      const cameraStore = useNewCameraStore()      
      const store = useBreadcrumbsStore();
      const configStore = useConfigStore();

      if (to.name == 'ironforms' && _from.name == 'componentinterventionforms' && cameraStore.IsVisible) {
        next(false)
        return ''
      }
      try {
        // reset config to initial state
        configStore[Mutations.RESET_LAYOUT_CONFIG]();
        if (to) {
          store[Actions.SET_BREADCRUMB_ACTION](breadcrumbMapper[to.name as string]);
        }// Scroll page to top on every route change
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        const title = to.meta.title ? to.meta.title : `${staticTitle}`;
        document.title = `${title}`;
        next();
      } catch (err) {
        console.error(err);
      }
    });
  },
};
