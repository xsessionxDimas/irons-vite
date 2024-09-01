export default function ILOrganizationUnitRoutes(staticTitle: string) {
  return [
    {
      path: 'shift',
      name: 'ironlake-organization-unit-shift',
      meta: {
        title: `${staticTitle} - Ironlake - Organization Unit - Shift`,
      },
      component: () => {
        return import('@/views/administration/organization-unit/shift/Index.vue')
      },
    },
    {
      path: 'position',
      name: 'ironlake-organization-unit-position',
      meta: {
        title: `${staticTitle} - Ironlake - Organization Unit - Position`,
      },
      component: () => {
        return import('@/views/administration/organization-unit/position/Index.vue')
      },
    },
  ]
}
