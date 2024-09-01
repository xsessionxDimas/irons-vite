export default function OrganizationUnitRoutes(staticTitle: string) {
  return [
    {
      path: '/administration/organization-unit/shift',
      name: 'shift',
      meta: {
        title: `${staticTitle} - Management - Organization Unit - Shift`,
      },
      component: () => {
        return import('@/views/administration/organization-unit/shift/Index.vue')
      },
    },
    {
      path: '/administration/organization-unit/position',
      name: 'position',
      meta: {
        title: `${staticTitle} - Administration - Organization Unit - Position`,
      },
      component: () => {
        return import('@/views/administration/organization-unit/position/Index.vue')
      },
    },
  ]
}
