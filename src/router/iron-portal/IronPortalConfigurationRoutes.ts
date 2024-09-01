/**
  @NOTE
  ** Type menjadi CBM Parameter Name
  ** Model Weight menjadi Model Price Weight
  ** Mapping SOS menjadi Source Oil Data to BUMA Component
  ** Intervention Status menjadi Intervention Status and Follow Up Priority
  ** Recommended Action menjadi Intervention Checks
  ** Risk Management Rating menjadi Component Risk Rating Description
  ** CBM Status menjadi Criticality Logic
  ** CBM Threshold menjadi CBM Parameter Threshold
  ** Component Category menjadi Component Life Threshold
 */

export default function IronPortalConfigurationRoutes(staticTitle: string, menuType) {
  return [
    {
      path: "/ironportal/iron-portal-configuration/type",
      name: "type",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Parameter Name`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'cbm parameter',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/type/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/operator",
      name: "operator",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Operator`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'operator',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/operator/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/rating",
      name: "rating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Rating`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'rating',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/rating/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/code-group",
      name: "code-group",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Code Group`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'code group',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/code-group/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/action",
      name: "action",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Action`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'action',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/action/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/param-object",
      name: "parameterobject",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Parameter Object`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'parameter object',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/parameter-object/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/model-weight",
      name: "modelweight",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Model Price Weight`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'model price weight',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/model-weight/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/comp-weight",
      name: "component-weight",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Weight`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component weight',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-weight/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/week",
      name: "week",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Week`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'week',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/week/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/element",
      name: "element",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Element`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'element',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/element/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/dmg-category",
      name: "damage-category",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Damage Category`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'damage category',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/damage-category/Index.vue")
      }
    },
    {
      path: "/ironportal/iron-portal-configuration/damage",
      name: "damage",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Damage`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'damage',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/damage/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/cbm-mapping",
      name: "cbmmapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Mapping`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'cbm mapping',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/cbm-mapping/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/comp-status",
      name: "componentstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Status`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component status',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-status/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/compstat-map",
      name: "componentstatusmapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Status Mapping`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component status mapping',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-status-mapping/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/riskrank-mat",
      name: "riskrankmaterial",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Risk Rank Material`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'risk rank material',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/risk-rank-material/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/oem-interval",
      name: "oeminterval",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - OEM Interval`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'oem interval',
          action: 'view'
        }
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/oem-interval/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/item",
      name: "item",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Item`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'item',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/item/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/condition",
      name: "condition",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Condition`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'condition',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/condition/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/inspection",
      name: "inspection",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Inspection`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'inspection',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/inspection/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/area",
      name: "area",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Area`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'area',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/area/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/com-strategy",
      name: "componentstrategy",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Strategy`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component strategy',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/component-strategy/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/cbm-area-map",
      name: "cbmareamapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Area Mapping`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'cbm area mapping',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/cbm-area-mapping/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/eqp-config",
      name: "equipmentconfiginironportal",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Equipment Config In IronPortal`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'equipment config',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/map-sos",
      name: "mappingsos",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Source Oil Data to BUMA Component`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'mappong sos',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/mapping-sos/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/revise-user",
      name: "reviseuser",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Revise User`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'revise user',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/revise-user/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/int-status",
      name: "interventionstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Intervention Status and Follow Up Priority`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'intervention status',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/intervention-status/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/rec-action",
      name: "recommendedaction",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Intervention Checks`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'intervention checks',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/recommended-action/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/risk-mgt-rat",
      name: "riskmanagementrating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Risk Rating Description`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component risk rating',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/risk-management-rating/Index.vue")
      }
    },
    {
      path: "/ironportal/iron-portal-configuration/cbm-gap",
      name: "cbmgapthreshold",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Compliance Gap Threshold`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'cbm compliance gap threshold',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/cbm-gap-threshold/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/task-type",
      name: "managementtasktype",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Task Type`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'task type',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/management-task-type/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/sos-map-bi",
      name: "sosmapbi",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - SOS Mapping for BI`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'sos mapping for bi',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/mapping-sos-bi/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/cbm-status",
      name: "cbmstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Criticality Logic`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'criticality logic',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/cbm-status/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/cbm-threshld",
      name: "cbmthreshold",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Parameter Threshold`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'cbm parameter threshold',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/cbm-threshold/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/comp-risk-rt",
      name: "componentriskrating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Risk Rating`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component risk rating',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/component-risk-rating/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-configuration/comp-categry",
      name: "componentcategory",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Life Threshold`,
        parentMenu: menuType,
        analytic: {
          module: 'irons',
          productCode: 'ironportal',
          menu: 'component category',
          action: 'view'
        }
      },
      component: () => {
        return import("@/views/iron-portal/iron-portal-configuration/component-category/Index.vue")
      },
    },
  ]
}
