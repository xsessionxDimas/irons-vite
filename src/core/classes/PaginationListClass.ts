import PaginationType from "@/core/types/misc/Pagination";
import { dynamicSort } from "@/core/helpers/table-sort";
import { SortParam } from "@/core/types/misc/SortParam";

export default class PaginationListClass {
  private pagination = new PaginationType()
  private displayData = [] as any[]
  private data = [] as any[]
  private isSort = false
  private sortBy = null as string | null
  private sortOrder = null as string | null

  constructor(data = []) {
    this.setData(data);
  }

  public setTotalPage(totalPage: number) {
    this.pagination.totalPage = totalPage;
  }

  public setDisplayData() {
    let duplicate = [...this.data];
    if (this.isSort) duplicate = duplicate.sort(dynamicSort(this.sortBy, this.sortOrder));
    this.displayData = duplicate.slice(
      this.pagination.startPaginationIndex, this.pagination.endPaginationIndex);
  }

  public setPage(newPage: number) {
    this.pagination.handleCurrentPageChange(newPage);
    this.setDisplayData();
  }

  public setSort(param: SortParam) {
    this.isSort = param.prop !== null;
    this.sortBy = param.prop;
    this.sortOrder = param.order;
    this.setPage(1);
  }

  public setData(data) {
    this.data = data;
    this.setTotalPage(data.length);
    this.setPage(1);
  }

  public getDisplayData() {
    return this.displayData;
  }

  public getPagination() {
    return this.pagination
  }
}

