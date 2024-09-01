/* eslint-disable @typescript-eslint/no-unused-vars */

export default function useDynamicGraphHierarchyConfig() {
/** @NOTE
    file to set config when component selected
 */
  const configTargetY1 = [
    {
      table: "Test x1",
      column: "sample_type"
    },
    {
      table: "Test x1",
      column: "sample_group"
    },
    {
      table: "Test x1",
      column: "component_name"
    },
    {
      table: "Test x1",
      column: "sample_parameter_fix"
    }
  ];
  const configTargetY2 = [
    {
      table: "Test x2",
      column: "sample_type"
    },
    {
      table: "Test x2",
      column: "sample_group"
    },
    {
      table: "Test x2",
      column: "component_name"
    },
    {
      table: "Test x2",
      column: "sample_parameter_fix"
    }
  ];

  const defaultY1 = [
    {
      operator: "Selected",
      value: "None",
    }
  ]
  const defaultY2 = [
    {
      operator: "Selected",
      value: "None",
    }
  ]

  const hierarchyDataEngineY1 = [
    {
      operator: "Inherited",
      value: "Oil Data",
      children: [
        {
          operator: "Selected",
          value: "ENGINE",
        },
        {
          operator: "Selected",
          value: "ADDITIVES BASELINE",
        },
        {
          operator: "Selected",
          value: "COOLANT",
        },
      ]
    },
    {
      operator: "Selected",
      value: "None",
    }
  ]
  const hierarchyDataEngineY2 = [
    {
      operator: "Selected",
      value: "Sensor Data",
    },
    {
      operator: "Selected",
      value: "None",
    }
  ];

  /**
   *  @note CASEGROUP 1
   * case group Oil Data -> Additives Baseline, Gears & Bearing, Particle Count
   *
   */
  const CASEGROUP1Y1 = [
    {
      operator: "Inherited",
      value: "Oil Data",
      children: [
        {
          operator: "Selected",
          value: "ADDITIVES BASELINE",
        },
        {
          operator: "Selected",
          value: "GEARS & BEARING",
        },
        {
          operator: "Selected",
          value: "PARTICLE COUNT",
        },
      ]
    },
    {
      operator: "Selected",
      value: "None",
    }
  ]

  /**
   * @NOTE Others data
   */
  // CASE 1 -y1 IronForms CBM y2 sensor data

  const ALLCBM = [
    {
      operator: "Selected",
      value: "IronForms CBM",
    },
    {
      operator: "Selected",
      value: "None",
    }
  ];
  const ALLSENSORDATA = [
    {
      operator: "Selected",
      value: "Sensor Data",
    },
    {
      operator: "Selected",
      value: "None",
    }
  ];
  const ALLOILDATA = [
    {
      operator: "Selected",
      value: "Oil Data",
    },
    {
      operator: "Selected",
      value: "None",
    }
  ];

  const ALLFILTERCUT = [
    {
      operator: "Selected",
      value: "Filter Cut",
    },
    {
      operator: "Selected",
      value: "None",
    }
  ]

  const noneSelected = [
    {
      operator: "Selected",
      value: "None",
    }
  ];

  const getFilterY = (allData: string[], yIndex: number) => {
    console.log(allData[yIndex - 1])
    if (allData[yIndex - 1]) {
      return [
        {
          operator: "Selected",
          value: allData[yIndex - 1],
          children: [
            {
              operator: "NotSelected",
              value: "OTHERS",
            },
          ]
        },
        ...noneSelected
      ]
    }
    return noneSelected;
  }

  const getHierarchyDataY1 = (component: string) => {
    switch (component.toLowerCase()) {
      case "differential":
        return CASEGROUP1Y1
      case "engine":
        return hierarchyDataEngineY1
      case "grid blower ass (hv) lh":
        return ALLCBM
      case "grid blower ass (hv) rh":
        return ALLCBM
      case "hoist cylinder lh":
        return ALLOILDATA
      case "hoist cylinder rh":
        return ALLOILDATA
      case "hoist pump":
        return ALLOILDATA
      case "hv alternator":
        return ALLCBM
      case "main pump":
        return ALLOILDATA
      case "park brake rear lh":
        return ALLCBM
      case "park brake rear rh":
        return ALLCBM
      case "pivot eye assembly":
        return ALLCBM
      case "pump transmission":
        return ALLOILDATA
      case "radiator":
        return ALLOILDATA
      case "steering cylinder lh":
        return ALLOILDATA
      case "steering cylinder rh":
        return ALLOILDATA
      case "steering pump":
        return ALLOILDATA
      case "suspension cyl front lh":
        return ALLCBM
      case "suspension cyl front rh":
        return ALLCBM
      case "suspension cyl rear lh":
        return ALLCBM
      case "suspension cyl rear rh":
        return ALLCBM
      case "tandem chain left":
        return ALLOILDATA
      case "tandem chain right":
        return ALLOILDATA
      case "torque converter":
        return ALLOILDATA
      case "transmission":
        return CASEGROUP1Y1
      case "turbo hp front left":
        return ALLCBM
      case "turbo hp front right":
        return ALLCBM
      case "turbo hp rear left":
        return ALLCBM
      case "turbo hp rear right":
        return ALLCBM
      case "turbo lp front left":
        return ALLCBM
      case "turbo lp front right":
        return ALLCBM
      case "turbo lp rear left":
        return ALLCBM
      case "turbo lp rear right":
        return ALLCBM
      case "wheel bearings front lh":
        return ALLOILDATA
      case "wheel bearings front rh":
        return ALLOILDATA
      case "wheel group front lh":
        return CASEGROUP1Y1
      case "wheel group front rh":
        return CASEGROUP1Y1
      case "wheel group rear lh":
        return CASEGROUP1Y1
      case "wheel group rear rh":
        return CASEGROUP1Y1
      case "wheel motor rear lh":
        return CASEGROUP1Y1
      case "wheel motor rear rh":
        return CASEGROUP1Y1
      default:
        return noneSelected
    }
  }
  const getHierarchyDataY2 = (component: string) => {
    switch (component.toLowerCase()) {
      case "differential":
        return noneSelected
      case "engine":
        return hierarchyDataEngineY2
      case "grid blower ass (hv) lh":
        return noneSelected
      case "grid blower ass (hv) rh":
        return noneSelected
      case "hoist cylinder lh":
        return ALLCBM
      case "hoist cylinder rh":
        return ALLCBM
      case "hoist pump":
        return ALLSENSORDATA
      case "hv alternator":
        return noneSelected
      case "main pump":
        return noneSelected
      case "park brake rear lh":
        return noneSelected
      case "park brake rear rh":
        return noneSelected
      case "pivot eye assembly":
        return noneSelected
      case "pump transmission":
        return noneSelected
      case "radiator":
        return ALLSENSORDATA
      case "steering cylinder lh":
        return ALLCBM
      case "steering cylinder rh":
        return ALLCBM
      case "steering pump":
        return ALLSENSORDATA
      case "suspension cyl front lh":
        return noneSelected
      case "suspension cyl front rh":
        return noneSelected
      case "suspension cyl rear lh":
        return noneSelected
      case "suspension cyl rear rh":
        return noneSelected
      case "tandem chain left":
        return noneSelected
      case "tandem chain right":
        return noneSelected
      case "torque converter":
        return noneSelected
      case "transmission":
        return noneSelected
      case "turbo hp front left":
        return noneSelected
      case "turbo hp front right":
        return noneSelected
      case "turbo hp rear left":
        return noneSelected
      case "turbo hp rear right":
        return noneSelected
      case "turbo lp front left":
        return noneSelected
      case "turbo lp front right":
        return noneSelected
      case "turbo lp rear left":
        return noneSelected
      case "turbo lp rear right":
        return noneSelected
      case "wheel bearings front lh":
        return noneSelected
      case "wheel bearings front rh":
        return noneSelected
      case "wheel group front lh":
        return ALLSENSORDATA
      case "wheel group front rh":
        return ALLSENSORDATA
      case "wheel group rear lh":
        return noneSelected
      case "wheel group rear rh":
        return noneSelected
      case "wheel motor rear lh":
        return ALLSENSORDATA
      case "wheel motor rear rh":
        return ALLSENSORDATA
      default:
        return noneSelected
    }
  }

  return {
    configTargetY1,
    configTargetY2,
    getHierarchyDataY1,
    getHierarchyDataY2,
    defaultY1,
    defaultY2,
    getFilterY,
  }
}
