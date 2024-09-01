export default function ParameterRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/parameter/smu-tolerance-setting',
      name: 'smutolerancesetting',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - Daily Schedule`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/smu-tolerance-setting/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/parameter',
      name: 'parameterehms',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Parameter`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/parameter-ehms/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/oil-tolerance-setting',
      name: 'oiltolerancesetting',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Oil Tolerance Setting`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/oil-tolerance-setting/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/cbm-group',
      name: 'cbmgroup',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - CBM Group`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/cbm-group/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/uom',
      name: 'uom',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - UOM`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/uom/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/cbm-parameter',
      name: 'cbmparameter',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - CBM Parameter`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/cbm-parameter/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/area-cbm',
      name: 'areacbm',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Area CBM`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/area-cbm/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/status-converter',
      name: 'statusconverter',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Status Converter`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/status-converter/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/smu-actual',
      name: 'smuactual',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - SMU Actual`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/smu-actual/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/component-lubricant',
      name: 'componentlubricant',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Component Lubricant`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/component-lubricant/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/type-parameter',
      name: 'typeparameter',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Type Parameter`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/type-parameter/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/assign-comp-lubri',
      name: 'assignmentcomponentlubricant',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Assignment Component Lubricant`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/assignment-component-lubricant/Index.vue')
      },
    },
    {
      path: '/ironlake/parameter/planned-duration',
      name: 'plannedduration',
      meta: {
        title: `${staticTitle} - Iron Lake - Parameter - Planned Duration`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/parameter/planned-duration/Index.vue')
      },
    }
  ]
}
