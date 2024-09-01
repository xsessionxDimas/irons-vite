<template>
  <div
    id="bumaLevelContainer"
    v-loading="loading || isLoadingDataSelected"
    element-loading-background="#2d2b39b3"
    ref="reportContainer"
    class="my-5"
    style="height: 90vh"
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
import { onBeforeRouteLeave } from "vue-router";
import {
  useAuthenticationStore
} from '../../store/pinia/application/useAuthenticationStore'
import {
  columnAndTableList1,
  getLocationCode
} from "./utils"
import { swalAlertInfo } from "../../core/helpers/sweet-alert";
import {
  getAllOptionsFromPbiSlicer
} from "./utils"

const authStore = useAuthenticationStore();

const props = defineProps([
  "reportName",
  "visibletab",
  "idPageName",
  "isPublic",
  "pbiReportId",
  "pbiWorkspaceId",
  "isHideVisualHeaders",
  "isTransparent",
])
const emits = defineEmits(["handle-click"])
const store = usePbiEmbeddedStore();

// List of filter for buma level
const columnAndTableList = columnAndTableList1;

// HTML REFS
const reportContainer = ref<HTMLDivElement>();
let report;
const minutesBeforeExpiration = 5;
const intervalTime = 300000;
const intervalValue = ref<number>(0);
const defaultSite = ref("");
const isLoadingDataSelected = ref(false)

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
      // visualSettings: { // @NOTE VISUAL HEADER DI NONAKTIFKAN LEWAT PBI
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
        const pages = await report.getPages();
        // Retrieve the active page.
        const page = pages.find((p) => {
          return p.displayName === "Buma Level" // get tab Buma Level
        });

        const visuals = await page.getVisuals();

        // report.off removes all event handlers for a specific event
        report.off("dataSelected");
        // report.on will add an event listener.
        report.on("dataSelected", async (event) => {
          // If it's slicer event, then set session storage
          // If it's not, then it's EVENT SELECT DATA TABLE PUSH ROUTE TO EQUIPMENT
          if (event.detail.visual.type == "slicer") {
            try {
              isLoadingDataSelected.value = true
              const activePage = await report.getActivePage()
              const activeVisuals = await activePage.getVisuals();
              let slicer = activeVisuals.filter((visual) => {
                return visual.type === "slicer" && visual.title === event.detail.visual.title;
              })[0];

              const slicerState = await slicer.getSlicerState()

              if (slicerState) {
                let allOptions = [] as string[];
                let operator = "";
                let newValueArray = [] as string[];
                if (slicerState.filters.length > 0) {
                  newValueArray = [
                    ...slicerState.filters[0].values
                  ];
                  operator = slicerState.filters[0].operator;
                }
                if (newValueArray.length == 0 || slicerState.filters[0].operator == "NotIn") {
                  let allOptionsTemp = await slicer.exportData();
                  allOptions = getAllOptionsFromPbiSlicer(allOptionsTemp ? allOptionsTemp.data : "");
                }
                setFilterToSessionStorage(event.detail.visual.title, operator, newValueArray, allOptions);
              }
            } catch (error) {
              console.log(error)
            } finally {
              isLoadingDataSelected.value = false
            }
          }

          if (event.detail.visual.title == "Table_Detail") {
            tableDataSelected(event.detail.dataPoints[0].identity);
          }
        });

        report.off("buttonClicked");
        report.on("buttonClicked", async (event) => {
          if (!event.detail.title.includes("clear") && !event.detail.title.includes("clr")) return
          const tempFilterDetailId = columnAndTableList.findIndex((e) => {
            return e.btnClearTitles.includes(event.detail.title);
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
        if (loggedInUserLocation && loggedInUserLocation != "AU02") {
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
          embedContainer = document.getElementById("bumaLevelContainer")!;

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

        // Set slicer site value: start ===========================================================================
        // If user location is AU02 (HO), then default slicer value will be set to ALL SITE
        // If user location is not AU02, then slicer value will be set to respected user's location
        // But if there's session storage, will use the session storage.
        const siteFromSession = getArrayItemInSessionStorage(columnAndTableList[0].sessionStorageName);
        defaultSite.value = loggedInUserLocation == "AU02" ? "" : authStore.user.Location;
        const siteFromUser = defaultSite.value ? [
          defaultSite.value
        ] : [];
        const finalSiteValue = (siteFromSession && siteFromSession.length > 0) ? siteFromSession : siteFromUser;

        // Retrieve the target visual. (Get slicer by type and title)
        let slicer = visuals.filter((visual) => {
          return visual.type === "slicer" && visual.title === columnAndTableList[0].slicerTitle
        })[0];

        if (slicer && finalSiteValue.length > 0) {
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
        }

        // ==============================================================
        // END :: FILTER DATA BASED ON LOGGED IN USER SITE             ==
        // ==============================================================

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
          const arrayValue = getArrayItemInSessionStorage(e.sessionStorageName);

          if (!slicer) return

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
          } else {
            // If session storage not exist yet, set default value from PBI if exist
            try {
              const tempSlicer = await slicer.getSlicerState();
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

const getAndSetPBIEmbedded = async (callback) => {
  await store[Actions.GET_PBI_CONFIG]({
    reportName: props.reportName,
    isPublic: props.isPublic,
    reportId: props.pbiReportId,
    workspaceId: props.pbiWorkspaceId
  });
  callback();
};

const getArrayItemInSessionStorage = (storageName: string): string[] => {
  const stringifiedArrayValue = sessionStorage.getItem(storageName)
  if (stringifiedArrayValue) {
    return JSON.parse(stringifiedArrayValue)
  }
  return []
}

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
  console.log(newSessionStorageValue)

  const slicerInfo = columnAndTableList.find((e) => {
    return e.slicerTitle == slicerTitle;
  });
  if (slicerInfo) {
    // Save the default slicer from PBI to session storage for later
    sessionStorage.setItem(slicerInfo.sessionStorageName, JSON.stringify(newSessionStorageValue));
  }
};

const tableDataSelected = (tableDataArray: Array<any>) => {
  let tempFilter = {
    siteDescription: "",
    componentName: "",
    modelUnit: "",
    equipment: ""
  };
  tableDataArray.forEach((e) => {
    if (e.target.column == "site_description") {
      tempFilter.siteDescription = e.equals;
    } else if (e.target.column == "component_name") {
      tempFilter.componentName = e.equals;
    } else if (e.target.column == "model_unit") {
      tempFilter.modelUnit = e.equals;
    } else if (e.target.column == "equipment") {
      tempFilter.equipment = e.equals;
    }
  });
  if (
    tempFilter.siteDescription != "" &&
    tempFilter.componentName != "" &&
    tempFilter.modelUnit != "" &&
    tempFilter.equipment != ""
  ) {
    sessionStorage.setItem(columnAndTableList[0].sessionStorageName, JSON.stringify([
      tempFilter.siteDescription
    ]));
    sessionStorage.setItem(columnAndTableList[4].sessionStorageName, JSON.stringify([
      tempFilter.componentName
    ]));
    sessionStorage.setItem(columnAndTableList[2].sessionStorageName, JSON.stringify([
      tempFilter.modelUnit
    ]));
    sessionStorage.setItem("IronPortalDashboardFilter-Equipment", JSON.stringify([
      tempFilter.equipment
    ]));
    openEquipmentInNewTab();
  }
}

const openEquipmentInNewTab = () => {
  const newWindow = window.open("#/ironportal-dashboard/equipment", "_blank")
  if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined") {
    swalAlertInfo("Please allow pop-up permission on your browser if equipment page is not opened in a new tab.", "OK")
  }
}
// end: METHODS ===============================================

onMounted(async () => {
  await getAndSetPBIEmbedded(() => {
    setPBI();
  });
  intervalValue.value = setInterval(() => {
    checkTokenAndUpdate();
  }, intervalTime) as any;
});

onBeforeRouteLeave(async () => {
  if (intervalValue.value) {
    clearInterval(intervalValue.value);
  }
});
</script>
