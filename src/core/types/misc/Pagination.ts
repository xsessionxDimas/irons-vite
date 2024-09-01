export default class Pagination {
  currentPage: number;
  totalPageSize: number;
  totalPage: number;
  startPaginationIndex: number;
  endPaginationIndex: number;

  constructor() {
    this.currentPage = 1;
    this.totalPageSize = 10;
    this.totalPage = 0;
    this.startPaginationIndex = -1;
    this.endPaginationIndex = 0;
  }

  getPaginationStartIndex = (): void => {
    this.startPaginationIndex = (this.currentPage - 1) * this.totalPageSize;
  };

  getPaginationLastIndex = (): void => {
    const end: number | undefined =
      this.startPaginationIndex + this.totalPageSize >= this.totalPage
        ? undefined
        : this.startPaginationIndex + this.totalPageSize;
    this.endPaginationIndex = end ? end : this.totalPage;
  };

  handleCurrentPageChange = (newPage: number): void => {
    this.currentPage = newPage;
    this.getPaginationStartIndex();
    this.getPaginationLastIndex();
  };

  getPaginationStartIndexFromBE = (): void => {
    if (this.currentPage > 1) {
      this.startPaginationIndex = this.totalPageSize * (this.currentPage - 1)
    } else if ((this.currentPage == 1)) {
      this.startPaginationIndex = 0
    }
  };

  getPaginationLastIndexFromBE = (): void => {
    if (this.currentPage == 1 && this.currentPage * this.totalPageSize <= this.totalPage) {
      this.endPaginationIndex = this.totalPageSize
    } else if (this.currentPage * this.totalPageSize > this.totalPage) {
      this.endPaginationIndex = this.totalPage
    } else if (this.currentPage > 1) {
      this.endPaginationIndex = this.currentPage * this.totalPageSize
    }
  };

  handleCurrentPageChangeFromBE = (newPage: number): void => {
    this.currentPage = newPage;
    this.getPaginationStartIndexFromBE();
    this.getPaginationLastIndexFromBE();
  };
}
