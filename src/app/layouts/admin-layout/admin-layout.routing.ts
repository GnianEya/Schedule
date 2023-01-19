import { Routes } from "@angular/router";

import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { DailyComponent } from "app/daily/daily.component";
import { ScheduleComponent } from "app/schedule/schedule.component";
import { HomeComponent } from "app/home/home.component";
import { WeeklyComponent } from "app/weekly/weekly.component";
import { ChangePasswordComponent } from "app/change-password/change-password.component";
import { AuthGuard } from "_auth/auth.guard";
import { ErrorComponent } from "app/error/error.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    // canActivate: [AuthGuard],
    // data: { roles: ["organizer", "member"] },
  },
  { path: "user-profile", component: UserProfileComponent },
  { path: "daily", component: DailyComponent },
  {
    path: "schedule",
    component: ScheduleComponent,
    canActivate: [AuthGuard],
    data: { roles: ["organizer"] },
  },
  { path: "weekly", component: WeeklyComponent },
  { path: "changePassword", component: ChangePasswordComponent },
];
