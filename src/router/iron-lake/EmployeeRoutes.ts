export default function EmployeeRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/employee-management/employee',
      name: 'employee',
      meta: {
        title: `${staticTitle} - Iron Lake - Employee Management - Employee`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/employee-management/employee/Index.vue')
      },
    },
    {
      path: '/ironlake/employee-management/employee-v1',
      name: 'employee-v1',
      meta: {
        title: `${staticTitle} - Iron Lake - Employee Management - Employee v1`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/employee-management/employee-v1/Index.vue')
      },
    },
    {
      path: '/ironlake/employee-management/employee-direct',
      name: 'userdirect',
      meta: {
        title: `${staticTitle} - Iron Lake - Employee Management - Employee Direct`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/employee-management/user-direct/Index.vue')
      }
    },
  ]
}
