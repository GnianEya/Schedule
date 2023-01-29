import { Routes } from "@angular/router";

import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { DailyComponent } from "app/daily/daily.component";
import { ScheduleComponent } from "app/schedule/schedule.component";
import { HomeComponent } from "app/home/home.component";
import { WeeklyComponent } from "app/weekly/weekly.component";
import { ChangePasswordComponent } from "app/change-password/change-password.component";
import { AuthGuard } from "_auth/auth.guard";
import { ErrorComponent } from "app/error/error.component";
import { WeeklySearchProfileComponent} from "app/weekly-search-profile/weekly-search-profile.component";

export const AdminLayoutRoutes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
  {
    path: "user-profile", component: UserProfileComponent, canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
  {
    path: "daily", component: DailyComponent, canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
  {
    path: "schedule",
    component: ScheduleComponent,
    canActivate: [AuthGuard],
    data: { roles: ["organizer"] },
  },
  {
    path: "weekly", component: WeeklyComponent, canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
  {
    path: "changePassword", component: ChangePasswordComponent, canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
  {
    path: "weeklyprofile", component: WeeklySearchProfileComponent, canActivate: [AuthGuard],
    data: { roles: ["organizer","member"] },
  },
];
