export default function UserManagementRoutes(staticTitle: string) {
  return [
    {
      path: '/administration/user-management/user-group',
      name: 'usergroup',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Group`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group/Index.vue')
      }
    },
    {
      path: '/administration/user-management/user-login',
      name: 'userlogin',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Login`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-login/Index.vue')
      },
    },
    {
      path: '/administration/user-management/language',
      name: 'language',
      meta: {
        title: `${staticTitle} - Administration - User Management - Language`,
      },
      component: () => {
        return import('@/views/administration/user-management/language/Index.vue')
      },
    },
    {
      path: '/administration/user-management/user-group-member',
      name: 'usergroupmember',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Group Member`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group-member/Index.vue')
      },
    },
    {
      path: '/administration/user-management/user-group',
      name: 'usergroup',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Group`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group/Index.vue')
      },
    },
    {
      path: '/administration/user-management/user-group-menu',
      name: 'usergroupmenu',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Group Menu`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group-menu/Index.vue')
      }
    },
    {
      path: '/administration/user-management/menu',
      name: 'menu',
      meta: {
        title: `${staticTitle} - Administration - User Management - Menu`,
      },
      component: () => {
        return import('@/views/administration/user-management/menu/Index.vue')
      },
    },
    {
      path: '/administration/user-management/user-group',
      name: 'usergroup',
      meta: {
        title: `${staticTitle} - Administration - User Management - User Group`,
      },
      component: () => {
        return import('@/views/administration/user-management/user-group/Index.vue')
      }
    }
  ]
}
