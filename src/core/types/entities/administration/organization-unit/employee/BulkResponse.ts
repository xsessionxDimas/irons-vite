export type BulkResponse = {
  totalData: number;
  employeeList: EmployeeItem[];
};

export type EmployeeItem = {
  employeeId: string;
  company: string;
  profileUrl: string;
  name: string;
  email: string;
  role: string;
  siteName: string;
  vendor: string;
  supervisorName: string;
  isActive: boolean;
  isValid: boolean;
  validationReason: string;
};
