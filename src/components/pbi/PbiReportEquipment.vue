<template>
  <div v-loading="isEquipmentLoading" element-loading-background="#2d2b39b3" style="height: 90vh">
    <div
      v-show="showPbi"
      id="equimentContainer"
      v-loading="loading"
      ref="reportContainer"
      style="height: 100%"
    ></div>
    <SummaryIntervention
      v-if="!showPbi"
      @onBack="onBackToDetailInfoPage"
      @onSubmitSummaryIntervention="onBackToEquipmentPage"
    />
    <OverwriteCbmModal
      :visibility="isModalOverwriteVisible"
      :taskKey="taskKey"
      :workOrder="workOrder"
      :asset-number="equipment"
      :component="componentDescription"
      :sample-date="sampleDate"
      :source="dataSource"
      @onClose="handleHideModalOverwrite"
    />
    <ComponentReplacementModal
      :visibility="isComponentReplacementVisible"
      :equipment="paramComponentReplacement.equipment"
      :component="paramComponentReplacement.component"
      @onClose="isComponentReplacementVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  ComputedRef,
  onMounted,
  ref,
  defineProps,
  defineEmits,
} from "vue";
import { Actions } from "../../store/enums/PbiEmbeddedEnums";
import * as pbi from "powerbi-client";
import { usePbiEmbeddedStore } from '../../store/templates/usePbiEmbeddedStore'
import { PbiConfig } from "../../core/types/entities/PbiConfig";
import {
  dateToUTC,
} from "../../core/helpers/date-format";
import {
  onBeforeRouteLeave
} from "vue-router";

import {
  useAuthenticationStore
} from '../../store/pinia/application/useAuthenticationStore'
import { getLocationCode } from "./utils"
import {
  useSummaryInterventionStore
} from "../../store/pinia/iron-portal/dashboard/pbi-equipment/summary-intervention/useSummaryInterventionStore"

import OverwriteCbmModal from "./modals/overwrite-cbm/Modal.vue"
import ComponentReplacementModal from "./modals/component-replacement/Modal.vue"
import SummaryIntervention from "./modals/summary-intervention/Index.vue"

import equipmentAutoSelect from "./composeables/equipmentAutoSelect"
import {
  swalAlertInfo,
  swalAlertWarning
} from "../../core/helpers/sweet-alert";
import { KeyValue } from "../../core/types/misc/KeyValue";
import {
  getBookmarks,
  getBookmark,
  getBookmarkByKey
} from './functions/bookmarks'
import {
  getAllOptionsFromPbiSlicer,
  getAllDataFromPbiTable
} from "./utils"

const { getDataSelection } = equipmentAutoSelect();

const props = defineProps([
  "reportName",
  "visibletab",
  "isPublic",
  "pbiReportId",
  "pbiWorkspaceId",
  "isHideVisualHeaders",
  "isTransparent",
  "filterEquipment",
])
const emits = defineEmits(["handle-click"])
const store = usePbiEmbeddedStore();
const authStore = useAuthenticationStore();
const sumInterventionStore = useSummaryInterventionStore();

// HTML REFS
const equipment = ref<string>("");
const componentDescription = ref<string>("");
const workOrder = ref<string>("");
const taskKey = ref<string>("");
const sampleDate = ref<string | Date>("");
const dataSource = ref<string>("serviceSheet"); // serviceSheet, interim, atau intervention
const reRender = ref<boolean>(false)
const images = ref<string[]>([])
const bookmarks = ref<KeyValue[]>([])
const reportContainer = ref<HTMLDivElement>();
const minutesBeforeExpiration = 5;
const intervalTime = 300000;
const intervalValue = ref<number>(0);
const defaultSite = ref("");
const showPbi = ref(true);
const isGraphJustClicked = ref(false);

const isEquipmentLoading = ref(false);

const isComponentReplacementVisible = ref(false);
const paramComponentReplacement = ref({
  site: "",
  component: "",
  model: "",
  equipment: "",
})

const isModalOverwriteVisible = ref(false);

let report;

const columnAndTableList = [
  { // SITE
    slicerTitle: "Parameter OMS site",
    column: "site_description",
    table: "vw_dim_site",
    btnClearTitles: ["clear_site"],
    sessionStorageName: "IronPortalDashboardFilter-Site"
  },
  { // MODEL
    slicerTitle: "Parameter OMS model unit",
    column: "model_unit",
    table: "vw_dim_equipment",
    btnClearTitles: ["clear_model"],
    sessionStorageName: "IronPortalDashboardFilter-Model"
  },
  { // EQUIPMENT
    slicerTitle: "Parameter OMS equipment",
    column: "equipment",
    table: "vw_dim_equipment",
    btnClearTitles: ["clear_equipment"],
    sessionStorageName: "IronPortalDashboardFilter-Equipment"
  },
  { // COMPONENT
    slicerTitle: "Parameter OMS component name",
    column: "component_name",
    table: "vw_dim_component",
    btnClearTitles: ["clear_component"],
    sessionStorageName: "IronPortalDashboardFilter-Component"
  },
  // Fullscreen Map =============
  { // Group Parameter
    slicerTitle: "Group_Parameter",
    column: "sample_group",
    table: "vw_b0_pm_ehms_oms_3dphornet_map",
    btnClearTitles: [],
    sessionStorageName: "IronPortalDashboardFilter_Map-Group_Parameter"
  },
  { // Parameter
    slicerTitle: "Parameter",
    column: "parameter_to",
    table: "vw_b0_pm_ehms_oms_3dphornet_map",
    btnClearTitles: [],
    sessionStorageName: "IronPortalDashboardFilter_Map-Parameter"
  },
  { // Time Slicer
    slicerTitle: "Time_Slicer",
    column: "Sranking",
    table: "vw_b0_pm_ehms_oms_3dphornet_map",
    btnClearTitles: [],
    sessionStorageName: "IronPortalDashboardFilter_Map-Time_Slicer"
  },
];

const buttonExportMapNames = [
  "S1_exportPDF",
  "S2_exportPDF",
  "S3_exportPDF",
  "S4_exportPDF",
  "S5_exportPDF",
  "S6_exportPDF",
  "S7_exportPDF",
  "S8_exportPDF"
]

const buttonBackMapFullscreenNames = [
  "btn_s1_back",
  "btn_s2_back",
  "btn_s3_back",
  "btn_s4_back",
  "btn_s5_back",
  "btn_s6_back",
  "btn_s7_back",
  "btn_s8_back"
]

// start: COMPUTED ==============================================
const loading: ComputedRef<boolean> = computed(() => {
  return store.getIsDashboardConfigLoading;
});
const pbiConfig: ComputedRef<PbiConfig> = computed(() => {
  return store.getDashboardConfigPbi;
});
// end: COMPUTED ==============================================

// start: METHODS ===============================================
const setConfigObject = () => {
  const configObject = {
    type: "report",
    tokenType: pbi.models.TokenType.Embed || "",
    accessToken: pbiConfig.value.embedToken.token || "",
    embedUrl: pbiConfig.value.embedReport[0].embedUrl || "",
    id: pbiConfig.value.embedReport[0].reportId || "", // Report Id
    permissions: pbi.models.Permissions.All,
    settings: {
      // background: props.isTransparent ? pbi.models.BackgroundType.Transparent : null,
      panes: {
        filters: {
          visible: false,
        },
        pageNavigation: {
          visible:
            typeof props.visibletab == "undefined"
              ? true
              : props.visibletab,
        },
      },
    },
  };

  if (props.isTransparent) {
    configObject.settings["background"] = pbi.models.BackgroundType.Transparent;
  }
  if (sessionStorage.getItem("PbiEquipment_DetailInfo") == "true") {
    const pageMapFullscreen = sessionStorage.getItem("PbiEquipment-Page_Map_Fullscreen")
    configObject["pageName"] = pageMapFullscreen || "ReportSectiond46a3f7350de24c93ad7" // Page name of Detail Information
  }
  return configObject
}

const isSetDataTrend = (visualTitle: string) => {
  switch (visualTitle) {
    case 'Parameter OMS component name':
      return true;
    case 'Parameter OMS equipment':
      return true;
    case 'Parameter OMS model unit':
      return true;
    case 'Parameter OMS site':
      return true;
    default:
      return false;
  }
}

const selectedSRanking = ref<string>('S1');

const setPBI = () => {
  // CONFIG PBI
  try {
    if (typeof pbiConfig.value !== "undefined") {
      const reportLoadConfig = setConfigObject();

      let powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory,
      );
      if (reportContainer.value) {
        report = powerbi.embed(reportContainer.value, reportLoadConfig);
      }

      report.off("loaded");
      report.on("loaded", async () => {
        bookmarks.value = await getBookmarks(report)

        // Retrieve the active page.
        let pages: any[] = []
        let visuals: any[] = []

        await report.getPages().then((response) => {
          pages = response
        }).catch((error) => {
          console.log("error get pages", error)
        });
        const page = pages.find((p) => {
          return p.isActive
        });
        await page.getVisuals().then((response) => {
          visuals = response
        }).catch((error) => {
          console.log("error get visuals", error)
        });

        // ==============================================================
        // START :: FILTER DATA BASED ON LOGGED IN USER SITE           ==
        // ==============================================================

        // Filter out other site and only show site of logged in user.
        // If user position is Head Office, data will NOT be filtered,
        // abling them to see all site
        // And then default slicer value will be set according to whether the user
        // is located in Head Office or not.

        // report.off removes all event handlers for a specific event
        const loggedInUserLocation = await getLocationCode(authStore.user.EmployeeId);
        if (loggedInUserLocation && loggedInUserLocation !== "AU02") {
          const filterObj = {
            $schema: "http://powerbi.com/product/schema#basic",
            target: {
              table: columnAndTableList[0].table,
              column: columnAndTableList[0].column
            },
            operator: "In",
            values: [authStore.user.Location]
          };

          // Get a reference to the embedded report HTML element
          let embedContainer: HTMLElement;
          embedContainer = document.getElementById("equimentContainer")!;

          // Get a reference to the embedded report.
          report = powerbi.get(embedContainer);

          try {
            // Set the filter for the report.
            // Pay attention that setFilters receives an array.
            await report.setFilters([filterObj]);
          } catch (errors) {
            console.log(errors);
          }
        }

        // Set slicer site value ===========================================================================
        // If user location is AU02 (HO), then default slicer value will be set to Blackwater
        // If user location is not AU02, then slicer value will be set to respected user's location
        // But if there's session storage, will use the session storage.
        const siteFromSession = getArrayItemInSessionStorage(columnAndTableList[0].sessionStorageName);
        defaultSite.value = loggedInUserLocation == "AU02" ? "Blackwater" : authStore.user.Location;
        const siteFromUser = [
          defaultSite.value
        ]
        const finalSiteValue = (siteFromSession && siteFromSession.length > 0) ? siteFromSession : siteFromUser;
        const slicerObj = {
          filters: [
            {
              $schema: "http://powerbi.com/product/schema#basic",
              operator: "In",
              values: [
                ...finalSiteValue
              ],
              target: {
                table: columnAndTableList[0].table,
                column: columnAndTableList[0].column
              },
              filterType: 1,
              requireSingleSelection: true,
            }
          ],
        }

        // Retrieve the target visual. (Get slicer by type and title)
        let slicer = visuals.filter((visual) => {
          return visual.type === "slicer" && visual.title === `Parameter OMS site`
        })[0];

        // Set the slicer state which contains the slicer filters.
        try {
          if (loggedInUserLocation !== "AU02") { // EXCLUDE HEAD OFFICE
            await slicer.setSlicerState(slicerObj);
            console.log("success set slicer site")
          }
        } catch (error) {
          console.log(error)
        }
        setFilterToSessionStorage(columnAndTableList[0].slicerTitle, "In", [
          ...finalSiteValue
        ], []);

        // ==============================================================
        // END :: FILTER DATA BASED ON LOGGED IN USER SITE             ==
        // ==============================================================

        const setDataTrendSlicer = async (componentName: string) => {
          let slicerDataTrend = visuals.filter((visual) => {
            return visual.title === 'slicer data trend';
          })[0];

          try {
            let allOptionsSlicerDataTrend = await slicerDataTrend.exportData();
            allOptionsSlicerDataTrend = getAllOptionsFromPbiSlicer(allOptionsSlicerDataTrend ? allOptionsSlicerDataTrend.data : "")
            const filterDataTrend = {
              filters: [
                {
                  $schema: "http://powerbi.com/product/schema#basic",
                  operator: "In",
                  values: [
                    ...getDataSelection(componentName, allOptionsSlicerDataTrend)
                  ],
                  target: {
                    table: "vw_b0_pm_ehms_omsstatus",
                    column: "parameter_to"
                  },
                  filterType: 1,
                  requireSingleSelection: true,
                }
              ],
            }
            await slicerDataTrend.setSlicerState(filterDataTrend)
            console.log('success set slicer data trend')
          } catch (error) {
            console.error("error set slicer data trend", error)
          }
        }

        report.off("bookmarkApplied");
        report.on("bookmarkApplied", async (event) => {
          console.log("Event - bookmarkApplied:\n", event.detail);

          if (event.detail.bookmarkName == "Bookmarka04d85905eb7cbd75ae4") {
            const componentName = getFirstArrayItemInSessionStorage(columnAndTableList[3].sessionStorageName);
            await setDataTrendSlicer(componentName)
          }
        });

        // report.off removes all event handlers for a specific event
        report.off("dataSelected");
        // report.on will add an event listener.
        report.on("dataSelected", async function (event) {
          console.log('event.detail', event.detail);
          let detailData = event.detail;
          const dataPoints = detailData.dataPoints
          const whiteMatrixs = ['matrix_condition_summary', 'Matrix_3dp&vims']
          try {
            isEquipmentLoading.value = true
            const bookmark = getBookmark(bookmarks.value, detailData.visual.title, whiteMatrixs, dataPoints)
            if (bookmark) {
              if (dataPoints[0].values.length != 0) {
                selectedSRanking.value = dataPoints[0].values[2].value;
              }
              await report.bookmarksManager.apply(bookmark)
              return
            }
          } catch (error) {
            console.log(error)
          } finally {
            isEquipmentLoading.value = false
          }

          // Show 3DP Graph
          if (event.detail.visual.title == "Matrix_3dp&vims") {
            const pageName = "ReportSectione5ba9be2aabce8d119d9"
            try {
              const pageDetailInfo = pages.find((p) => {
                return p.displayName === "Detail Information" // get page DETAIL INFORMATION
              });
              const visualsDetailInfo = await pageDetailInfo.getVisuals(); // get visuals of DETAIL INFORMATION
              let TableHideRanking = visualsDetailInfo.find((visual) => {
                return visual.title === "hide_ranking";
              });
              let exportedTableHideRankingData = await TableHideRanking.exportData();
              const tableHideRankingData = getAllDataFromPbiTable(exportedTableHideRankingData.data);
              await report.setPage(pageName)
              const pagePopUpChart = pages.find((p) => {
                return p.displayName === "Pop-up Chart" // get page POP UP CHART
              });
              const visualsPopUpChart = await pagePopUpChart.getVisuals(); // get visuals of POP UP CHART
              if (visualsPopUpChart) {
                let slicerParameter = visualsPopUpChart.find((visual) => {
                  return visual.title === "parameter_slicer";
                });
                let slicerRanking = visualsPopUpChart.find((visual) => {
                  return visual.title === "ranking_slicer";
                });

                const filterSlicerParameter = {
                  filters: [
                    {
                      $schema: "http://powerbi.com/product/schema#basic",
                      target: {
                        table: "vw_b0_pm_ehms_oms_3dphornet_map",
                        column: "parameter_to"
                      },
                      filterType: 1,
                      operator: "In",
                      values: [
                        tableHideRankingData[1]
                      ],
                      requireSingleSelection: false
                    }
                  ]
                }
                await slicerParameter.setSlicerState(filterSlicerParameter)
                console.log("Succes set slicer param")

                const filterSlicerRanking = {
                  filters: [
                    {
                      $schema: "http://powerbi.com/product/schema#basic",
                      target: {
                        table: "vw_b0_pm_ehms_oms_3dphornet_map",
                        column: "sample_ranking"
                      },
                      filterType: 1,
                      operator: "In",
                      values: [
                        tableHideRankingData[0]
                      ],
                      requireSingleSelection: false
                    }
                  ]
                }
                await slicerRanking.setSlicerState(filterSlicerRanking)
                console.log("Succes set slicer ranking")
              }
            } catch (errors) {
              console.log(errors);
            }
          }

          // Open Overwrite from IronForms CBM
          if (detailData.visual.title === 'ironforms_matrix') {
            if (dataPoints.length > 0) {
              reRender.value = false
              try {
                taskKey.value = dataPoints[0].values?.find((item) => {
                  return item.target.column === 'task_key'
                }).formattedValue

                workOrder.value = dataPoints[0].values?.find((item) => {
                  return item.target.column === 'work_order'
                }).formattedValue

                sampleDate.value = dataPoints[0].values?.find((item) => {
                  return item.target.column === 'sample_date'
                }).value

                let source = dataPoints[0].values?.find((item) => {
                  return item.target.column === 'sample_type_from'
                }).value;
                if (source == 'INTERVENTION') {
                  dataSource.value = 'intervention';
                } else {
                  dataSource.value = 'serviceSheet';
                }

                equipment.value = getFirstArrayItemInSessionStorage(columnAndTableList[2].sessionStorageName);
                componentDescription.value = getFirstArrayItemInSessionStorage(columnAndTableList[3].sessionStorageName);

                handleShowModalOverwrite()
              } catch (error) {
                images.value = []
                console.error("error get image", error)
              }
            }
          }

          // Open Overwrite from FC MP
          if (detailData.visual.title == "matrix_condition_summary" && dataPoints.length > 0) {
            reRender.value = false
            try {
              const activePage = await report.getActivePage()
              const activeVisuals = await activePage.getVisuals();
              let tableHidden = activeVisuals.filter((visual) => {
                return visual.title === "wo_taskkey_matrix"
              })[0];

              const exportedTableData = await tableHidden.exportData()
              const tableData = getAllDataFromPbiTable(exportedTableData.data);

              if (tableData.length < 6) return

              taskKey.value = tableData[1]
              workOrder.value = tableData[2]
              sampleDate.value = new Date(tableData[4])
              if (tableData[3] == 'INTERIM') {
                dataSource.value = 'interim'
              } else if (tableData[3] == 'INTERVENTION') {
                dataSource.value = 'intervention'
              } else {
                dataSource.value = 'serviceSheet'
              }

              equipment.value = getFirstArrayItemInSessionStorage(columnAndTableList[2].sessionStorageName);
              componentDescription.value = getFirstArrayItemInSessionStorage(columnAndTableList[3].sessionStorageName);

              handleShowModalOverwrite()
            } catch (error) {
              images.value = []
              console.error("error get image", error)
            }
          }

          // Slicer changes
          const singleSlicers = [
            "Parameter OMS site",
            "Parameter OMS model unit",
            "Parameter OMS equipment",
            "Parameter OMS component name",
            "Group_Parameter",
            "Time_Slicer",
          ]
          const isSlicerSingle = singleSlicers.includes(detailData.visual.title)
          if (detailData.visual.type == "slicer") {
            try {
              isEquipmentLoading.value = true

              if (isGraphJustClicked.value) {
                isGraphJustClicked.value = false
                const bookmark = getBookmarkByKey(`IronFormsCBM_${selectedSRanking.value}`, bookmarks.value)
                if (bookmark) {
                  try {
                    await report.bookmarksManager.apply(bookmark)
                  } catch (error) {
                    console.log(error)
                  }
                }
              }

              const activePage = await report.getActivePage()
              const activeVisuals = await activePage.getVisuals();
              let slicer = activeVisuals.filter((visual) => {
                return visual.type === "slicer" && visual.title === detailData.visual.title;
              })[0];

              const slicerState = await slicer.getSlicerState();

              if (slicerState) {
                let allOptions = [] as string[];
                let operator = "";
                let newValueArray = [] as string[];
                if (slicerState.filters.length > 0) {
                  // since the slicer is multiple slicer, system has to get the last value and
                  // put it manually to the slicer so the value won't be multiple anymore
                  // depending on singleSlicers value
                  newValueArray = isSlicerSingle ? [
                    slicerState.filters[0].values[slicerState.filters[0].values.length - 1]
                  ] : slicerState.filters[0].values;
                  operator = slicerState.filters[0].operator;

                  const slicerObj = {
                    filters: [
                      {
                        $schema: "http://powerbi.com/product/schema#basic",
                        operator: "In",
                        values: newValueArray,
                        target: {
                          table: slicerState.filters[0].target.table,
                          column: slicerState.filters[0].target.column
                        },
                        filterType: 1,
                        requireSingleSelection: !isSlicerSingle,
                      }
                    ],
                  }
                  await slicer.setSlicerState(slicerObj)
                }
                if (newValueArray.length == 0 || slicerState.filters[0].operator == "NotIn") {
                  let allOptionsTemp = await slicer.exportData();
                  allOptions = getAllOptionsFromPbiSlicer(allOptionsTemp.data);
                }
                setFilterToSessionStorage(detailData.visual.title, operator, newValueArray, allOptions);
              }
            } catch (error) {
              console.log(error)
            } finally {
              isEquipmentLoading.value = false
            }
          }

          /** @NOTE SET SLICER DATA TREND */
          if (isSetDataTrend(detailData.visual.title) && !sessionStorage.getItem("PbiEquipment_DetailInfo")) {
            const componentName = getFirstArrayItemInSessionStorage(columnAndTableList[3].sessionStorageName);
            await setDataTrendSlicer(componentName)
          }
          /** @NOTE END SET SLICER DATA TREND */

          // ==============================================================
          // START :: EVENT SELECT DATA TABLE PUSH ROUTE TO INTERVENTION ==
          // ==============================================================
          if (detailData.visual.title == "table_intervention") {
            if (event.detail.dataPoints.length == 0) {
              return
            }
            // Push selected Equipment's data table to Intervention page
            const tempFilter = { // These are the data that is being sent
              keyPbi: event.detail.dataPoints[0].identity[0].equals,
            };

            // Get the slicer state
            try {
              sessionStorage.setItem("formFilter", JSON.stringify(tempFilter));
              openLinkInNewTab("#/ironportal-dashboard/intervention", "intervention")
            } catch (error) {
              console.log(error)
            }
          }
          // ==============================================================
          // END :: EVENT SELECT DATA TABLE PUSH ROUTE TO INTERVENTION   ==
          // ==============================================================
        });

        report.off("buttonClicked");
        report.on("buttonClicked", async (event) => {
          console.log(event.detail)

          // Click button Graph: start ========================================================
          if (event.detail.title == "IF_graph_s1") {
            isGraphJustClicked.value = true
          } else if (event.detail.title == "IF_table_s1") {
            isGraphJustClicked.value = false
            const bookmark = getBookmarkByKey(`IronFormsCBM_${selectedSRanking.value}`, bookmarks.value)
            if (bookmark) {
              try {
                await report.bookmarksManager.apply(bookmark)
              } catch (error) {
                console.log(error)
              }
            }
          }
          // Click button Graph: end ==========================================================

          // Click Export Map Button: start ===================================================
          if (buttonExportMapNames.includes(event.detail.title)) {
            savePbi();
            return
          }
          // Click Export Map Button: end =====================================================

          // Click Component Replacement Button: start
          // Click Back to Equipment from Detail Info: start ==================================
          if (event.detail.title == "btn_back_equipment") {
            sessionStorage.removeItem("PbiEquipment_DetailInfo")
            return
          }
          // Click Back to Equipment from Detail Info: end =====================================

          // Click Map Fullscreen Button: start ================================================
          if (event.detail.title.includes("fullscreen")) {
            const pageMap = pages.filter((page) => {
              return page.displayName == `S${event.detail.title[1]}_Map`
            })[0];
            sessionStorage.setItem("PbiEquipment-Page_Map_Fullscreen", pageMap.name)
            try {
              await pageMap.setActive()
              console.log(`succes set S${event.detail.title[1]}_Map`)
            } catch (error) {
              console.log(error)
            }
            return
          }
          // Click Map Fullscreen Button: end ==================================================

          // Click Back to Detail Info From Map: start =========================================
          if (buttonBackMapFullscreenNames.includes(event.detail.title)) {
            sessionStorage.removeItem("PbiEquipment-Page_Map_Fullscreen")
            return
          }
          // Click Back to Detail Info From Map: end ===========================================

          // Click Component Replacement Button: start =========================================
          if (event.detail.title == "component_replacement") {
            // equipment
            paramComponentReplacement.value.equipment = getFirstArrayItemInSessionStorage(columnAndTableList[2].sessionStorageName);
            // component
            paramComponentReplacement.value.component = getFirstArrayItemInSessionStorage(columnAndTableList[3].sessionStorageName);
            if (paramComponentReplacement.value.equipment && paramComponentReplacement.value.component) {
              isComponentReplacementVisible.value = true
            } else {
              swalAlertWarning("Please select Equipment and Component first", "Ok")
            }
            return
          }
          // Click Component Replacement Button: end ===========================================

          // Summary & Intervention: start =====================================================
          if (event.detail.title == "summary_intervention") {
            localStorage.setItem("PbiEquipment_ShowPbi", "false")
            openLinkInNewTab("#/ironportal-dashboard/equipment", "summary intervention")
            return
          }
          // Summary & Intervention: end =======================================================

          // button detail info clicked: start =================================================
          if (event.detail.title == "detail information") {
            localStorage.setItem("PbiEquipment_DetailInfo", "true")
            openLinkInNewTab("#/ironportal-dashboard/equipment", "detail information")
            return
          }
          // button detail info clicked: end ===================================================

          // Clear Slicer (SHOULD BE ON THE MOST BOTTOM OF buttonClicked event)
          if (!event.detail.title?.includes("clear") && !event.detail.title?.includes("clr")) return

          const tempFilterDetailId = columnAndTableList.findIndex((e) => {
            return e.btnClearTitles?.includes(event.detail.title);
          });
          if (tempFilterDetailId == -1) return

          // This loop will reset the session storage according to the hierarchy
          // So, it will only remove the desired filter top to bottom.
          // Session storage auto set to []
          for (let i = tempFilterDetailId; i < columnAndTableList.length; i++) {
            const filterDetail = columnAndTableList[i];
            setFilterToSessionStorage(filterDetail.slicerTitle, "", [], []);
          }

          // CLEAR SITE: start ==================================================================
          const isClearSite = columnAndTableList[0].btnClearTitles.findIndex((clearTitle) => {
            return event.detail.title.includes(clearTitle)
          });
          if (isClearSite != -1) {
            const slicerObj = {
              filters: [
                {
                  $schema: "http://powerbi.com/product/schema#basic",
                  operator: "In",
                  values: [
                    defaultSite.value
                  ],
                  target: {
                    table: columnAndTableList[0].table,
                    column: columnAndTableList[0].column
                  },
                  filterType: 1,
                  requireSingleSelection: true,
                }
              ],
            }

            try {
              const activePage = await report.getActivePage();
              const activeVisuals = await activePage.getVisuals();

              // Retrieve the target visual. (Get slicer by type and title)
              let slicer = activeVisuals.filter((visual) => {
                return visual.type === "slicer" && visual.title === columnAndTableList[0].slicerTitle
              })[0];

              // Set the slicer state which contains the slicer filters.
              await slicer.setSlicerState(slicerObj);
              console.log("success set site again")
            } catch (error) {
              console.log(error)
            }
            setFilterToSessionStorage(columnAndTableList[0].slicerTitle, "In", [], []);
          }
          // CLEAR SITE: end ===================================================================
        });

        // ==============================================================
        // START :: SET SLICER BASED ON SESSION STORAGE                ==
        // ==============================================================

        // Set slicer based on SESSION storage slicer won't change even when
        // the page is refreshed

        // Retrieve the page collection and get the visuals for the active page.
        columnAndTableList.forEach(async (e) => {
          // Retrieve the target visual. (Get slicer by type and title)
          const activePage = await report.getActivePage()
          const activeVisuals = await activePage.getVisuals();
          let slicer = activeVisuals.filter((visual) => {
            return visual.type === "slicer" && visual.title === e.slicerTitle;
          })[0];
          const firstItem = getFirstArrayItemInSessionStorage(e.sessionStorageName);
          let valueToBeDisplayed: string[] = [
            firstItem
          ]
          if (
            (sessionStorage.getItem("PbiEquipment_DetailInfo") && e.slicerTitle == "Parameter OMS component name") ||
            e.slicerTitle == "Parameter"
          ) {
            valueToBeDisplayed = getArrayItemInSessionStorage(e.sessionStorageName)
          }

          if (!slicer) return

          if (firstItem) {
            // Create the filter object. For more information see https://go.microsoft.com/fwlink/?linkid=2153364
            const slicerObj = {
              filters: [
                {
                  $schema: "http://powerbi.com/product/schema#basic",
                  operator: "In",
                  values: valueToBeDisplayed,
                  target: {
                    column: e.column,
                    table: e.table,
                  },
                  filterType: 1,
                  requireSingleSelection: false,
                }
              ],
            }
            // Set the slicer state which contains the slicer filters.
            try {
              await slicer.setSlicerState(slicerObj);
            } catch (error) {
              console.log(error)
            }

            // set slicer data trend
            if (e.slicerTitle === 'Parameter OMS component name') {
              await setDataTrendSlicer(firstItem)
            }
          } else {
            // If session storage not exist yet, set default value from PBI if exist
            try {
              const tempSlicer = await slicer?.getSlicerState();
              const slicerDefaultValue: string[] = tempSlicer.filters[0].values
              if (slicerDefaultValue && slicerDefaultValue.length > 0) {
                setFilterToSessionStorage(e.slicerTitle, "In", slicerDefaultValue, []);
              }
            } catch (error) {
              console.log(error)
            }
          }
        });
        // ==============================================================
        // END :: SET SLICER BASED ON SESSION STORAGE                  ==
        // ==============================================================
      });
      report.off("rendered");

      report.on("error", async function (error) {
        if (error.detail == "TokenExpired") {
          await getAndSetPBIEmbedded(() => {
            updateToken();
          });
        }
        report.off("error");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getArrayItemInSessionStorage = (storageName: string): string[] => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue) {
    return JSON.parse(stringifiedArrayValue)
  }
  return []
}

const getFirstArrayItemInSessionStorage = (storageName: string): string => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  console.log(stringifiedArrayValue)
  if (stringifiedArrayValue && stringifiedArrayValue.length > 0) {
    return JSON.parse(stringifiedArrayValue)[0]
  }
  return ""
}

const getAndSetPBIEmbedded = async (callback) => {
  await store[Actions.GET_PBI_CONFIG]({
    reportName: props.reportName,
    isPublic: props.isPublic,
    reportId: props.pbiReportId,
    workspaceId: props.pbiWorkspaceId
  });
  callback();
};

const getActivePageName = async (reportPBI) => {
  const pages = await reportPBI.getPages();
  const activePage = pages.filter(function (page) {
    return page.isActive;
  })[0];
  return activePage.displayName;
};

const updateToken = async () => {
  await report.setAccessToken(pbiConfig.value.embedToken.token);
  await report.refresh();
};

const checkTokenAndUpdate = () => {
  // Get the current time
  const currentDate = new Date();
  const currentUTC = dateToUTC(currentDate);
  const expiration = Date.parse(pbiConfig.value.embedToken.expiration);

  // Time until token expiration in milliseconds
  const timeUntilExpiration = expiration - currentUTC;
  const timeToUpdate = minutesBeforeExpiration * 60 * 1000;

  // Update the token if it is about to expired
  if (timeUntilExpiration <= timeToUpdate) {
    getAndSetPBIEmbedded(function () {
      updateToken();
    });
  }
};

const savePbi = () => {
  if (report) {
    report.print();
  }
};

const setFilterToSessionStorage = async (slicerTitle: string, operator: string, arrayOfNewValues: string[], allOptions: string[]) => {
  let newSessionStorageValue = [] as string[];

  if (arrayOfNewValues.length > 0 && operator == "In") {
    newSessionStorageValue = [
      ...arrayOfNewValues
    ];
  } else if (arrayOfNewValues.length > 0 && operator == "NotIn") {
    newSessionStorageValue = allOptions.filter((e) => {
      return (e != "") && (arrayOfNewValues.indexOf(e) == -1);
    });
  }

  const slicerInfo = columnAndTableList.find((e) => {
    return e.slicerTitle == slicerTitle;
  });
  if (slicerInfo) {
    // Save the default slicer from PBI to session storage for later
    sessionStorage.setItem(slicerInfo.sessionStorageName, JSON.stringify(newSessionStorageValue));
  }
};

const openLinkInNewTab = (link: string, pageName: string) => {
  const newWindow = window.open(link, "_blank")
  if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
    swalAlertInfo(`Please allow pop-up permission on your browser if ${pageName} page is not opened in a new tab.`, "OK")
  }
}

const onBackToDetailInfoPage = () => {
  showPbi.value = true
  sessionStorage.removeItem("PbiEquipment_ShowPbi")
}

const onBackToEquipmentPage = async () => {
  sessionStorage.removeItem("PbiEquipment_ShowPbi")
  sessionStorage.removeItem("PbiEquipment_DetailInfo")
  showPbi.value = true
  if (report) {
    report.on("loaded", async () => {
      try {
        const pages = await report.getPages();
        // Retrieve the EQUIPMENT page.
        const page = pages.find((p) => {
          return p.displayName == "Equipment" // get tab Equipment or Detail info, one that is active
        });
        console.log(page)
      } catch (error) {
        console.log(error)
      }
    })
  }
}

const handleShowModalOverwrite = () => {
  isModalOverwriteVisible.value = true
}
const handleHideModalOverwrite = () => {
  dataSource.value = 'serviceSheet'
  isModalOverwriteVisible.value = false
}
// end: METHODS ===============================================

onMounted(async () => {
  if (localStorage.getItem("PbiEquipment_DetailInfo") == "true") {
    sessionStorage.setItem("PbiEquipment_DetailInfo", "true")
    localStorage.removeItem("PbiEquipment_DetailInfo")
  }
  if (localStorage.getItem("PbiEquipment_ShowPbi") == "false" || sessionStorage.getItem("PbiEquipment_ShowPbi") == "false") {
    sessionStorage.setItem("PbiEquipment_ShowPbi", "false")
    localStorage.removeItem("PbiEquipment_ShowPbi")
    showPbi.value = false
    await sumInterventionStore.getSiteLookup();
  }
  await getAndSetPBIEmbedded(() => {
    setPBI();
  });
  intervalValue.value = setInterval(() => {
    checkTokenAndUpdate();
  }, intervalTime) as any;
});

onBeforeRouteLeave(() => {
  if (intervalValue.value) {
    clearInterval(intervalValue.value);
  }
});
</script>
