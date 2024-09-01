export default function MaintenanceRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/maintenance/maintenance-strategy',
      name: 'maintenancestrategy',
      meta: {
        title: `${staticTitle} - Iron Lake - Maintenance - Maintenance Strategy`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/maintenance/maintenance-strategy/Index.vue')
      },
    },
    {
      path: '/ironlake/maintenance/cbm-parameter',
      name: 'cbm_parameter',
      meta: {
        title: `${staticTitle} - Iron Lake - Maintenance - CBM Parameter`
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/maintenance/cbm-parameter/Index.vue')
      },
    },
    {
      path: '/ironlake/maintenance/maintenance-strategy-assignment',
      name: 'maintenancestrategyassignment',
      meta: {
        title: `${staticTitle} - Iron Lake - Maintenance - Maintenance Strategy Assignment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/maintenance/maintenance-strategy-assignment/Index.vue')
      },
    },
  ]
}
