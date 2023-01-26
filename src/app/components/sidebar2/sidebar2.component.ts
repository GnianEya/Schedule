import { Component, OnInit } from "@angular/core";
import { NgToastService } from "ng-angular-popup";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES2: RouteInfo[] = [
  { path: "/departments", title: "Departments", icon: "bookmarks", class: "" },
  {
    path: "/employeeList",
    title: "Employee List",
    icon: "list",
    class: "",
  },

  {
    path: "/userList",
    title: "User List",
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

export const ROUTES02: RouteInfo[] = [
  {
    path: "/adminChangePassword",
    title: "Change Password",
    icon: "lock",
    class: "",
  },
  {
    path: "/adminUserProfile",
    title: "User Profile",
    icon: "person",
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

  constructor(private toast: NgToastService) {}

  ngOnInit() {
    this.menuItems = ROUTES2.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  clear() {
    localStorage.clear();
    this.toast.success({
      detail: "Success Message",
      summary: "Successfully Logout",
      duration: 5000,
    });
  }
}
