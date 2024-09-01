import { clone } from "lodash";
import { Option } from "../types/misc/Option";

export default class SearchClass {
  private selected = ''
  private query = ''
  private allOption = [] as Option[]
  private displayOption = [] as Option[]


  private setDisplayOption(options: Option[]) {
    this.displayOption = options
  }

  private setAllOption(options: Option[]) {
    this.allOption = options
  }

  private setSelected(selected: string) {
    this.selected = selected
  }

  public setQuery(query: string) {
    this.query = query
    this.displayOption = clone(this.allOption)
    if (query) {
      this.displayOption = this.displayOption.filter((element) => {
        if (element.label.toLowerCase().includes(query.toLowerCase())) {
          return true
        }
      });
    }
  }

  public setInitDataOption(options: Option[]) {
    this.setAllOption(options)
    this.setDisplayOption(options)
    this.setQuery('')
    this.setSelected('')
  }

  public setSelectedAndGetSelectedDataIndex(data: string) {
    this.setSelected(data)
    let selectedIndex;
    const optionData = this.allOption.find((val, idx) => {
      if (val.value == data) {
        selectedIndex = idx
        return true
      }
    })
    if (optionData) {
      this.setQuery(optionData.label)
      this.setDisplayOption([optionData])
      return selectedIndex
    }
    return -1
  }

  public setInitSearch(options: Option[]) {
    this.setInitDataOption(options)
    this.setQuery("")
  }

  public getDisplayOption() {
    return this.displayOption
  }

  public getQuery() {
    return this.query
  }

  public getSelected() {
    return this.selected
  }
}

