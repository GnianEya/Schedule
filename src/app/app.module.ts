import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPassComponent } from "./forget-pass/forget-pass.component";
import { PasswordComponent } from "./password/password.component";
import { GetstartedComponent } from "./getstarted/getstarted.component";
import { UserLayoutComponent } from "./layouts/user-layout/user-layout.component";

import { AuthGuard } from "_auth/auth.guard";
import { AuthInterceptor } from "_auth/auth.interceptor";
import { UserService } from "services/user.service";
import { PasswordService } from "services/password.service";

import { BrowserModule } from "@angular/platform-browser";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatDialogModule } from "@angular/material/dialog";
import { FullCalendarModule } from "@fullcalendar/angular";
import { FilterPipe } from "services/filter.pipe";
import { PopupModalComponent } from "./popup-modal/popup-modal.component";
import { DailyComponent } from "./daily/daily.component";
import { PasswordConfirmationPopupComponent } from "./password-confirmation-popup/password-confirmation-popup.component";
import { WeeklyComponent } from "./weekly/weekly.component";
import { HomeComponent } from "./home/home.component";
import { NgToastModule } from "ng-angular-popup";
import { ErrorComponent } from "./error/error.component";

//wmk
//import { FullCalendarModule } from "@fullcalendar/angular";
// import interactionPlugin from '@fullcalendar/interaction';
// import dayGridPlugin from '@fullcalendar/daygrid'

// FullCalendarModule.registerPlugins([
//   interactionPlugin,
//   dayGridPlugin
// ]);

// FullCalendarModule.regis([
//   interactionPlugin,
//   dayGridPlugin
// ]);

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    OverlayModule,
    FullCalendarModule,
    MatDialogModule,
    NgToastModule,
  ],
  declarations: [
    HomeComponent,
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    SignupComponent,
    ForgetPassComponent,
    PasswordComponent,
    GetstartedComponent,
    UserLayoutComponent,
    FilterPipe,
    PopupModalComponent,
    DailyComponent,
    WeeklyComponent,
    PasswordConfirmationPopupComponent,
    ErrorComponent,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    UserService,
    PasswordService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
