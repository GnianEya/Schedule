import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { GetstartedComponent } from "./getstarted/getstarted.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { PasswordComponent } from "./password/password.component";
import { ForgetPassComponent } from "./forget-pass/forget-pass.component";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";
import { ErrorComponent } from "./error/error.component";

const routes: Routes = [
  { path: "getstarted", component: GetstartedComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "password",
    component: PasswordComponent,
  },
  { path: "forgetpass", component: ForgetPassComponent },
  { path: "error", component: ErrorComponent },
  {
    path: "",
    redirectTo: "getstarted",
    pathMatch: "full",
  },

  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },

  {
    path: "",
    component: UserLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/user-layout/user-layout.module").then(
            (m) => m.UserLayoutModule
          ),
      },
    ],
  },
  //error page
  // {
  //   path: "**",
  //   redirectTo: "getstarted",
  //   pathMatch: "full",
  // },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
