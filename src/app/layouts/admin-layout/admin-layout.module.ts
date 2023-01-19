import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { OverlayModule } from "@angular/cdk/overlay";
import { DailyComponent } from "app/daily/daily.component";
import { ScheduleComponent } from "app/schedule/schedule.component";
import { HomeComponent } from "app/home/home.component";
import { WeeklyComponent } from "app/weekly/weekly.component";
import { ChangePasswordComponent } from "app/change-password/change-password.component";
import { ErrorComponent } from "app/error/error.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
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
    UserProfileComponent,
    ScheduleComponent,
    ChangePasswordComponent,
  ],
})
export class AdminLayoutModule {}
