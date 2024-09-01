export default function RoleManagementRoutes(staticTitle: string) {
  return [
    {
      path: 'user-group',
      name: 'ironlake-rolemanagement-usergroup',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - User Group`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group/Index.vue')
      }
    },
    {
      path: 'user-login',
      name: 'ironlake-rolemanagement-userlogin',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - User Login`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-login/Index.vue')
      },
    },
    {
      path: 'language',
      name: 'ironlake-rolemanagement-language',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - Language`,
      },
      component: () => {
        return import('@/views/administration/user-management/language/Index.vue')
      },
    },
    {
      path: 'user-group-member',
      name: 'ironlake-rolemanagement-usergroupmember',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - User Group Member`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group-member/Index.vue')
      },
    },
    {
      path: 'user-group-menu',
      name: 'ironlake-rolemanagement-usergroupmenu',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - User Group Menu`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group-menu/Index.vue')
      }
    },
    {
      path: 'menu',
      name: 'ironlake-rolemanagement-menu',
      meta: {
        title: `${staticTitle} - Ironlake - Role Management - Menu`,
      },
      component: () => {
        return import('@/views/administration/user-management/menu/Index.vue')
      },
    },
  ]
}
