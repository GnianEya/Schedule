import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES2: RouteInfo[] = [
  { path: "/departments", title: "Departments", icon: "home", class: "" },
  {
    path: "/employeeList",
    title: "Employee List",
    icon: "list",
    class: "",
  },

  {
    path: "/addEmployee",
    title: "ADD Employee",
    icon: "note",
    class: "",
  },
];

@Component({
  selector: "app-sidebar2",
  templateUrl: "./sidebar2.component.html",
  styleUrls: ["./sidebar2.component.scss"],
})
export class Sidebar2Component implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES2.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
