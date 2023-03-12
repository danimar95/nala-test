export interface Employee {
  id: string;
  parentId: string;
  area: string;
  children: Employee[];
  division: string;
  grossSalary: number;
  hierarchicalLevel: string;
  month: string;
  name: string;
  startDate: string;
  subarea: string;
}
