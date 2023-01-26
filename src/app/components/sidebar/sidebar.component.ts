import { Component, OnInit } from "@angular/core";
import { NgToastService } from "ng-angular-popup";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES1: RouteInfo[] = [
  { path: "/home", title: "Home", icon: "home", class: "" },

  { path: "/daily", title: "Daily", icon: "newspaper", class: "" },
  { path: "/weekly", title: "Weekly", icon: "bookmarks", class: "" },
  { path: "/schedule", title: "Schedule", icon: "book", class: "" },
  // {
  //   path: "/changePassword",
  //   title: "Change Password",
  //   icon: "lock",
  //   class: "",
  // },
  // {
  //   path: "/user-profile",
  //   title: "User Profile",
  //   icon: "person",
  //   class: "",
  // },
];

export const ROUTES01: RouteInfo[] = [
  {
    path: "/changePassword",
    title: "Change Password",
    icon: "lock",
    class: "",
  },
  {
    path: "/user-profile",
    title: "User Profile",
    icon: "person",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private toast: NgToastService) {}

  ngOnInit() {
    this.menuItems = ROUTES1.filter((menuItem) => menuItem);
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
