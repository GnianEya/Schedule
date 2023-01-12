import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { Sidebar2Component } from "./sidebar2/sidebar2.component";
import { Navbar2Component } from "./navbar2/navbar2.component";

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    Sidebar2Component,
    Navbar2Component,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    Sidebar2Component,
    Navbar2Component,
  ],
})
export class ComponentsModule {}
