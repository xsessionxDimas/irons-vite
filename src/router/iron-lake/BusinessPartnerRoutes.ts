export default function BusinessPartnerRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/business-partner/company',
      name: 'company',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Company`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/company/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/company-assignment',
      name: 'companyassignment',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Company Assignment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/company-assignment/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/site',
      name: 'site',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Site`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/site/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/site-v1',
      name: 'site-v1',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Site v1`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/site-v1/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/sub-site',
      name: 'subsite',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Sub Site`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/sub-site/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/maintenance-plant',
      name: 'maintenanceplant',
      meta: {
        title: `${staticTitle} - Iron Lake Business Partner - Maintenance Plant`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/maintenance-plant/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/planning-plant',
      name: 'planningplant',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Planning Plant`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/planning-plant/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/owner',
      name: 'owner',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Owner`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/owner/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/customer',
      name: 'customer',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Customer`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/customer/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/customer-assignment',
      name: 'customerassignment',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Customer Assignment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/customer-assignment/Index.vue')
      },
    },
    {
      path: '/ironlake/business-partner/brand',
      name: 'brand',
      meta: {
        title: `${staticTitle} - Iron Lake - Business Partner - Brand`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/business-partner/brand/Index.vue')
      },
    },
  ]
}
