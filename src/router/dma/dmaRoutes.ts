import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore"

export default function DmaRoutes(staticTitle: string) {
  return [
    {
      path: "/ironforms/e-form-v2",
      name: "eformoffline",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/e-form-offline/Index.vue")
      },
    },
    {
      path: "/ironforms/e-form/defect-list",
      name: "eformdefectlist",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/e-form/components/defect-detail-preview/Index.vue")
      },
    },
    {
      path: "/ironforms/approval/preview",
      name: "approvalpreview",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/approval/components/form-preview/Index.vue")
      },
    },
    {
      path: "/ironforms/monitoring-status/preview",
      name: "monitoringstatuspreview",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/monitoring-status/components/form-preview/Index.vue")
      },
    },
    {
      path: "/ironforms/monitoring-status/interim-preview",
      name: "monitoringstatusInterimpreview",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/monitoring-status/components/form-preview/interim-engine-service/Index.vue")
      },
    },
    {
      path: "/ironforms/monitoring-status/intervention-preview",
      name: "monitoringstatusintervention",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/monitoring-status/components/form-preview/component-intervention/Index.vue")
      },
    },
    {
      path: "/ironforms/component-intervention-forms",
      name: "componentinterventionforms",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/component-intervention-forms/Index.vue")
      },
    },
    {
      path: "/ironforms/interim-engine-service",
      name: "interimengineservice",
      meta: {
        title: `${staticTitle} - IronForms`
      },
      component: () => {
        return import(/* webpackChunkName: "ironforms" */ "@/views/dma/interim-engine-service/Index.vue")
      },
    }
  ]
}
