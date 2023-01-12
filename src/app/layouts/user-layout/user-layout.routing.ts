import { Routes } from "@angular/router";

import { AddEmployeeComponent } from "app/add-employee/add-employee.component";
import { EmployeeListComponent } from "app/employee-list/employee-list.component";
import { DepartmentsComponent } from "app/departments/departments.component";
import { TableListComponent } from "app/table-list/table-list.component";

export const UserLayoutRoutes: Routes = [
  { path: "addEmployee", component: AddEmployeeComponent },
  { path: "employeeList", component: EmployeeListComponent },
  { path: "table-list", component: TableListComponent },
  { path: "departments", component: DepartmentsComponent },
];
