<template>
  <div
    id="realtimeGraphContainer"
    v-loading="loading || isLoadingDataSelected"
    element-loading-background="#2d2b39b3"
    ref="reportContainer"
    class="my-2"
    style="height: 71.5vh"
  ></div>
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
import { dateToUTC } from "../../core/helpers/date-format";
import {
  useAuthenticationStore
} from '../../store/pinia/application/useAuthenticationStore'
import { getLocationCode } from "./utils"
import {
  onBeforeRouteLeave
} from "vue-router";
import {
  getAllOptionsFromPbiSlicer,
  getAllDataFromPbiTable
} from "./utils"

import dynamicGraphHierarchy from "./composeables/dynamicGraphHierarchy"

const {
  configTargetY1,
  getHierarchyDataY1,
  defaultY1,
  getFilterY
} = dynamicGraphHierarchy();

const authStore = useAuthenticationStore();

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

// List of filter for Realtime Graph
const columnAndTableList = [
  { // SITE
    column: "site_description",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "site_slicer",
    btnClearTitles: ["btn_clear_site"],
    sessionStorageName: "IronPortalDashboardFilter-Site",
  },
  { // EQUIPMENT CLASS A.K.A GROUP
    column: "equipment_hierarchy",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "group_slicer",
    btnClearTitles: ["btn_clear_group"],
    sessionStorageName: "IronPortalDashboardFilter-Group",
  },
  { // MODEL
    column: "model_unit",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "model_slicer",
    btnClearTitles: ["btn_clear_model"],
    sessionStorageName: "IronPortalDashboardFilter-Model",
  },
  { // EQUIPMENT
    column: "equipment",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "equipment_slicer",
    btnClearTitles: ["btn_clear_equipment"],
    sessionStorageName: "IronPortalDashboardFilter-Equipment",
  },
  { // COMPONENT TYPE
    column: "component_type",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "comptype_slicer",
    btnClearTitles: ["btn_clear_comptype"],
    sessionStorageName: "IronPortalDashboardFilter-ComponentType",
  },
  { // COMPONENT
    column: "component_desc",
    table: "vw_f_pm_ehms_oms_3dphornet_sensor_last_hour",
    slicerTitle: "component_slicer",
    btnClearTitles: ["btn_clear_component"],
    sessionStorageName: "IronPortalDashboardFilter-Component",
  },
];

// HTML REFS
const reportContainer = ref<HTMLDivElement>();
let report;
const minutesBeforeExpiration = 5;
const intervalTime = 300000;
const intervalValue = ref<number>(0);
const defaultSite = ref("");
const isLoadingDataSelected = ref(false)

const isExportDisabled = ref(true);

// start: COMPUTED ==============================================
const loading: ComputedRef<boolean> = computed(() => {
  return store.getIsDashboardConfigLoading;
});
const pbiConfig: ComputedRef<PbiConfig> = computed(() => {
  return store.getDashboardConfigPbi;
});
// end: COMPUTED ================================================

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
      // visualSettings: {
      //   visualHeaders: [
      //     {
      //       settings: {
      //         visible: props.isHideVisualHeaders ? false : true,
      //       }
      //     }
      //   ]
      // },
    },
  };

  if (props.isTransparent) {
    configObject.settings["background"] = pbi.models.BackgroundType.Transparent;
  }
  return configObject
}

const setPBI = async () => {
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
        let pages: any[] = []
        let visuals: any[] = []

        await report.getPages().then((response) => {
          pages = response
        }).catch((error) => {
          console.log("error get pages", error)
        });
        const page = pages.find((p) => {
          return p.displayName === "Realtime"
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
          embedContainer = document.getElementById("realtimeGraphContainer")!;

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

        // report.off removes all event handlers for a specific event
        report.off("dataSelected");

        // report.on will add an event listener.
        report.on("dataSelected", async (event) => {
          console.log(event.detail)
          let data = event.detail;

          if (data?.visual?.title === "component_slicer") {
            setTimeout(async () => {
              const dataValue = data?.dataPoints
              // Set the Y1 state which contains the slicer filters.
              let slicerY1 = visuals.filter((visual) => {
                return visual.type === "slicer" && visual.title === `Y1`
              })[0];
              let sampleTypeTable = visuals.filter((visual) => {
                return visual.title === "table_sample"
              })[0];

              const exportedTableData = await sampleTypeTable.exportData()
              const tableData = getAllDataFromPbiTable(exportedTableData ? exportedTableData.data : "");
              let slicerY1Obj;

              slicerY1Obj = {
                filters: [
                  {
                    $schema: "http://powerbi.com/product/schema#hierarchy",
                    target: configTargetY1,
                    filterType: 9,
                    hierarchyData: defaultY1
                  }
                ],
              }
              try {
                isLoadingDataSelected.value = true
                await slicerY1.setSlicerState(slicerY1Obj);
                console.log("slicer Y1 successfully set")
              } catch (error) {
                console.error("slicer Y1 error", error)
              } finally {
                isLoadingDataSelected.value = false
              }

              if (dataValue?.length > 0) {
                let arrFilterY1 = [] as any
                dataValue.forEach((item) => {
                  arrFilterY1 = [
                    ...arrFilterY1,
                    ...getFilterY(tableData, 1)
                  ]
                })
                slicerY1Obj = {
                  filters: [
                    {
                      $schema: "http://powerbi.com/product/schema#hierarchy",
                      target: configTargetY1,
                      filterType: 9,
                      hierarchyData: arrFilterY1
                    }
                  ],
                }
              } else {
                slicerY1Obj = {
                  filters: [
                    {
                      $schema: "http://powerbi.com/product/schema#hierarchy",
                      target: configTargetY1,
                      filterType: 9,
                      hierarchyData: defaultY1
                    }
                  ],
                }
              }
              try {
                isLoadingDataSelected.value = true
                await slicerY1.setSlicerState(slicerY1Obj);
                console.log("slicer Y1 successfully set")
              } catch (error) {
                console.error("slicer Y1 error", error)
              } finally {
                isLoadingDataSelected.value = false
              }
            }, 1500)
          }

          // If it's slicer event, then set session storage
          if (event.detail.visual.type == "slicer" && event.detail.visual.title != "Y1") {
            let slicer = visuals.filter((visual) => {
              return visual.type === "slicer" && visual.title === event.detail.visual.title;
            })[0];

            try {
              isLoadingDataSelected.value = true
              const slicerState = await slicer.getSlicerState()
              if (slicerState) {
                let allOptions = [] as string[];
                let operator = "";
                let newValueArray = [] as string[];
                if (slicerState.filters.length > 0) {
                  newValueArray = [
                    ...slicerState.filters[0]?.values
                  ];
                  operator = slicerState.filters[0].operator;
                }
                if (newValueArray.length == 0 || slicerState.filters[0].operator == "NotIn") {
                  const exportedData = await slicer.exportData();
                  allOptions = getAllOptionsFromPbiSlicer(exportedData ? exportedData.data : "");
                }
                setFilterToSessionStorage(event.detail.visual.title, operator, newValueArray, allOptions);
              }
            } catch (error) {
              console.log(error)
            } finally {
              isLoadingDataSelected.value = false
            }
          }
        });

        report.off("buttonClicked");
        report.on("buttonClicked", async (event) => {
          console.log(event.detail)
          // CLICK ON EXPORT
          if (event.detail.title == "Export_PDF") {
            savePbi();
            return
          }
          // CLICK ON CLEAR DATA
          if (!event.detail.title.includes("clear") && !event.detail.title.includes("clr")) return
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

          const isClearSite = columnAndTableList[0].btnClearTitles.findIndex((clearTitle) => {
            return event.detail.title.includes(clearTitle)
          });
          if (isClearSite != -1) {
            const slicerObj = defaultSite.value == ""
              ? []
              : {
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
              const activePage = pages.find((p) => {
                return p.isActive // get tab of the active page
              });
              const activeVisuals = await activePage.getVisuals();

              // Retrieve the target visual. (Get slicer by type and title)
              let slicer = activeVisuals.filter((visual) => {
                return visual.type === "slicer" && visual.title === columnAndTableList[0].slicerTitle
              })[0];

              // Set the slicer state which contains the slicer filters.
              await slicer.setSlicerState(slicerObj);
              console.log("success set site again")
              setFilterToSessionStorage(columnAndTableList[0].slicerTitle, "In", defaultSite.value == "" ? [] : [], []);
            } catch (error) {
              console.log(error)
            }
          }

          if (event.detail.title && event.detail.title === 'btn_clear_component') {
            // Set the Y1 state which contains the slicer filters.
            let slicerY1 = visuals.filter((visual) => {
              return visual.type === "slicer" && visual.title === `Y1`
            })[0];
            const slicerY1Obj = {
              filters: [
                {
                  $schema: "http://powerbi.com/product/schema#hierarchy",
                  target: configTargetY1,
                  filterType: 9,
                  hierarchyData: defaultY1
                }
              ],
            }
            try {
              await slicerY1.setSlicerState(slicerY1Obj);
              console.log("slicer Y1 successfully set")
            } catch (error) {
              console.error("slicer Y1 error", error)
            }
          }
        });

        // Set slicer site value ===========================================================================
        // If user location is AU02 (HO), then default slicer value will be set to ALL SITE
        // If user location is not AU02, then slicer value will be set to respected user's location
        // But if there's session storage, will use the session storage.
        const siteFromSession = getArrayItemInSessionStorage(columnAndTableList[0].sessionStorageName);
        defaultSite.value = loggedInUserLocation == "AU02" ? "" : authStore.user.Location;
        const siteFromUser = defaultSite.value ? [
          defaultSite.value
        ] : [];
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
          return visual.type === "slicer" && visual.title === columnAndTableList[0].slicerTitle
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

        // ==============================================================
        // START :: SET SLICER BASED ON SESSION STORAGE                ==
        // ==============================================================

        // Set slicer based on SESSION storage filter won't change even when
        // the page is refreshed

        // Retrieve the page collection and get the visuals for the active page.
        try {
          // Get session storage if any
          columnAndTableList.forEach(async (e) => {
            // Retrieve the target visual. (Get slicer by type and title)
            let slicer = visuals.filter((visual) => {
              return visual.type === "slicer" && visual.title === e.slicerTitle;
            })[0];
            const arrayValue = getArrayItemInSessionStorage(e.sessionStorageName);

            if (arrayValue && arrayValue.length > 0) {
              // Create the filter object. For more information see https://go.microsoft.com/fwlink/?linkid=2153364
              const slicerObj = {
                filters: [
                  {
                    $schema: "http://powerbi.com/product/schema#basic",
                    operator: "In",
                    values: arrayValue,
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

              // IF FOR SET HEIRARCY ON LOAD IF HAVE COMPONENT ON SESSION STORAGe
              if ((arrayValue && arrayValue.length > 0) && e.slicerTitle === 'component_slicer') {
                // Set the Y1 state which contains the slicer filters.
                let slicerY1 = visuals.filter((visual) => {
                  return visual.type === "slicer" && visual.title === `Y1`
                })[0];
                let arrFilterY1 = [] as any
                arrayValue.forEach((item) => {
                  arrFilterY1 = [
                    ...arrFilterY1,
                    ...getHierarchyDataY1(item)
                  ]
                })
                const slicerY1Obj = {
                  filters: [
                    {
                      $schema: "http://powerbi.com/product/schema#hierarchy",
                      target: configTargetY1,
                      filterType: 9,
                      hierarchyData: arrFilterY1
                    }
                  ],
                }
                try {
                  await slicerY1.setSlicerState(slicerY1Obj);
                  console.log("slicer Y1 successfully set")
                } catch (error) {
                  console.error("slicer Y1 error", error)
                }
              }
            } else {
              // If session storage not exist yet, set default value from PBI if exist
              try {
                const tempSlicer = await slicer.getSlicerState();
                if (tempSlicer.filters[0]) {
                  const slicerDefaultValue: string[] = tempSlicer.filters[0].values
                  if (slicerDefaultValue && slicerDefaultValue.length > 0) {
                    setFilterToSessionStorage(e.slicerTitle, "In", slicerDefaultValue, []);
                  }
                }
              } catch (error) {
                console.log(error)
              }
            }
          });
        } catch (errors) {
          console.log(errors);
        }
        // ==============================================================
        // END :: SET SLICER BASED ON SESSION STORAGE                  ==
        // ==============================================================
      });

      report.on("error", async function (error) {
        if (error.detail == "TokenExpired") {
          await getAndSetPBIEmbedded(async () => {
            await updateToken();
          });
        }
        report.off("error");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const savePbi = () => {
  if (report) {
    report.print();
  }
};

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

const getVisuals = async (reportPBI) => {
  try {
    const pages = await reportPBI.getPages();

    // Retrieve active page.
    const activePage = pages.filter(function (page) {
      return page.isActive;
    })[0];

    const visuals = await activePage.getVisuals();
    const models = pbi.models;

    type data = {
      data: string | null;
      name: string;
    };

    let finalData = [] as data[];
    const slicer = visuals.filter(function (visual) {
      if (visual.type == "tableEx") {
        finalData.push({
          data: null,
          name: visual.title,
        });
        return true;
      }
    });

    for (let index = 0; index < slicer.length; index++) {
      const result = await slicer[index].exportData(
        models.ExportDataType.Summarized,
      );
      finalData[index].data = result.data;
    }
    emits("handle-click", {
      data: finalData,
      workbookName: activePage.displayName,
    });
  } catch (errors) {
    console.log(errors);
  }
};

const getArrayItemInSessionStorage = (storageName: string): string[] => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue) {
    return JSON.parse(stringifiedArrayValue)
  }
  return []
}

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
    getAndSetPBIEmbedded(async () => {
      await updateToken();
    });
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
// end: METHODS ===============================================

onMounted(async () => {
  await getAndSetPBIEmbedded(() => {
    setPBI();
    isExportDisabled.value = false;
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

<style lang="scss" scoped>
.btn-pbi-export {
  background-color: #2d2b39;
  border: none
}
.btn-pbi-export:hover {
  background-color: #1c1a24;
}
</style>
