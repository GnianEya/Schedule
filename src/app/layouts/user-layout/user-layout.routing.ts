import { Routes } from "@angular/router";

import { AddEmployeeComponent } from "app/add-employee/add-employee.component";
import { EmployeeListComponent } from "app/employee-list/employee-list.component";
import { DepartmentsComponent } from "app/departments/departments.component";
import { AdminChangePasswordComponent } from "app/admin-change-password/admin-change-password.component";
import { AuthGuard } from "_auth/auth.guard";
import { AdminUserProfileComponent } from "app/admin-user-profile/admin-user-profile.component";
import { UserListComponent } from "app/user-list/user-list.component";

export const UserLayoutRoutes: Routes = [
  {
    path: "addEmployee",
    component: AddEmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "employeeList",
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "userList",
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "departments",
    component: DepartmentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] },
  },
  {
    path: "adminChangePassword",
    component: AdminChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin"] },
  },
  { path: "adminUserProfile", component: AdminUserProfileComponent },
];
