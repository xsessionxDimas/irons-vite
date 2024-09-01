import {
  ListDraftItem
} from "../entities/administration/organization-unit/employee/ListDraftItem";

export type EmployeeContent<T> = {
  employeeList: T[];
  employeeDraftList: ListDraftItem[];
  totalData: number;
};
