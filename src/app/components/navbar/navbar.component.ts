import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES01, ROUTES1 } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { HttpServiceService } from "services/http-service.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private title01: any[];
  isSetDefaultImage:boolean=true;
  profile:any;
  currentUserID:any;
  // private title02: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private HttpService: HttpServiceService,
    private sanitizer:DomSanitizer
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.currentUserID=JSON.parse(localStorage.getItem('id'));
    console.log('Navigation Current User ID : ',this.currentUserID);
    this.listTitles = ROUTES1.filter((listTitle) => listTitle);
    this.title01 = ROUTES01.filter((list) => list);
    // this.title02 = ROUTES02;
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
    this.HttpService.getMethod(
      "http://localhost:8081/image/getImage?id=" + this.currentUserID
    ).subscribe(async (response) => {
      this.profile = response;
      console.log(this.profile.userImageData);
      this.profile = this.sanitizer.bypassSecurityTrustUrl(
        "data:image/png;base64," + this.profile.userImageData
      );
      console.log("Profile image Data : ", this.profile);
      console.log(typeof this.profile);
      //setting default image
      if (this.profile === undefined) {
        console.log("Profile image in nav is not set yet.");
        this.isSetDefaultImage = true;
      } else {
        console.log("Profile image in nav already exist.");
        this.isSetDefaultImage = false;
      }
    });

  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }

    for (var i = 0; i < this.title01.length; i++) {
      if (this.title01[i].path === titlee) {
        return this.title01[i].title;
      }
    }

    return "";
  }
}
