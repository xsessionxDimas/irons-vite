export default function IronPortalDashboardRoutes(staticTitle: string) {
  return [
    {
      path: '/ironportal-dashboard/buma-level',
      name: 'ironportaldashboardbumalevel',
      meta: {
        title: `${staticTitle} - IronPortal - BUMA Level`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard buma level',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ '@/views/iron-portal/dashboard/buma-level/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/site-level',
      name: 'ironportaldashboardsitelevel',
      meta: {
        title: `${staticTitle} - IronPortal - Site Level`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard site level',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ '@/views/iron-portal/dashboard/site-level/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/equipment',
      name: 'ironportaldashboardequipment',
      props: true,
      meta: {
        title: `${staticTitle} - IronPortal - Equipment`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard equipment',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ '@/views/iron-portal/dashboard/equipment/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/dynamic-graph',
      name: 'ironportaldashboarddynamicgraph',
      meta: {
        title: `${staticTitle} - IronPortal - Dynamic Graph`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard dynamic graph',
          action: 'view'
        }
      },
      component: () => {
        return import('@/views/iron-portal/dashboard/dynamic-graph/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/realtime-graph',
      name: 'ironportaldashboardrealtimegraph',
      meta: {
        title: `${staticTitle} - IronPortal - Realtime Graph`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard realtime graph',
          action: 'view'
        }
      },
      component: () => {
        return import('@/views/iron-portal/dashboard/realtime-graph/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/intervention',
      name: 'ironportaldashboardintervention',
      meta: {
        title: `${staticTitle} - IronPortal - Intervention`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard intervention',
          action: 'view'
        }
      },
      component: () => {
        return import('@/views/iron-portal/dashboard/intervention/Index.vue')
      },
    },
    {
      path: '/ironportal-dashboard/maintenance-report',
      name: 'ironportaldashboardmaintenancereport',
      meta: {
        title: `${staticTitle} - IronPortal - Maintenance Report 2`,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'dashboard maintenance report',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ '@/views/iron-portal/dashboard/maintenance-report/Index.vue')
      },
    },
  ]
}
