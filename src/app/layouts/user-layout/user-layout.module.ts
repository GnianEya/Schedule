import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserLayoutRoutes } from "./user-layout.routing";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { AddEmployeeComponent } from "app/add-employee/add-employee.component";
import { EmployeeListComponent } from "app/employee-list/employee-list.component";
import { DepartmentsComponent } from "app/departments/departments.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AdminChangePasswordComponent } from "app/admin-change-password/admin-change-password.component";
import { AdminUserProfileComponent } from "app/admin-user-profile/admin-user-profile.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    AddEmployeeComponent,
    AdminChangePasswordComponent,
    AdminUserProfileComponent,
  ],
})
export class UserLayoutModule {}
