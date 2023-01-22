import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { SearchFiltering } from '../../models/searchFiltering';
import { HttpServiceService } from '../../services/http-service.service';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Calendar } from '@fullcalendar/core';
import * as moment from 'moment';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss']
})
export class WeeklyComponent implements OnInit {
currentUserID:number;
searchText='';
isOpen=false;
dataFromPicker="";
profile:any;
searchProfile:any;
isSetDefaultImage:boolean;
isSetSearchDefaultImage:boolean;
optimizedSearchFiltering:SearchFiltering[] = [];
isSearch:boolean=false;
searchFiltering:any[]=[];
username='';
teamname='';
searchUserId:any;
searchUsername='';
searchTeamname='';
usernameTeam:any;
calendarOptions:any;
searchCalendarOptions:any;
calendarApi:Calendar;
@ViewChild("calendar", { static: true })
calendarComponent!: FullCalendarComponent;
@ViewChild("searchCalendar", { static: true })
searchCalendarComponent!: FullCalendarComponent;

  constructor(
    private HttpService:HttpServiceService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    this.currentUserID=JSON.parse(localStorage.getItem("id"));
    console.log("Current User ID : ",this.currentUserID);
    console.log("Date Picked : ",this.dataFromPicker);
    console.log("key up ",this.isOpen);
    console.log("Search text : ",this.searchText);
    //getting search array
    this.HttpService.getMethod("http://localhost:8081/user/serchUsesDetails").subscribe(
      async (response) => {
        this.searchFiltering = response as any[];
        this.optimizedSearchFiltering = this.searchFiltering.map((e, i) => {
          return {
            userId: e.userId,
            username: e.uname,
            departmentname: e.departmentName,
            userImage: e.imageData,
          };
        });
  
        for (let e of this.optimizedSearchFiltering) {
          e.userImage = await this.imageResolver(e.userImage);
        }
        console.log("Optimized  search array : ", this.optimizedSearchFiltering);
      },
      (error) => {
        console.log(error);
      }
    );

    //to get username and team name
    this.HttpService.getMethod("http://localhost:8081/user/serchUserProfile?userId="+this.currentUserID).subscribe(
     async (response) => {
      this.usernameTeam=response;
      console.log("Getting username and team: ",this.usernameTeam);
      this.usernameTeam.map(
        (data)=>{
          this.username=data.uname;
          this.teamname=data.team;
          console.log("Current username : ",this.username);
          console.log("Current team name : ",this.teamname);
        }
      );
     }
    );

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
        console.log("Profile image is not set yet.");
        this.isSetDefaultImage = true;
      } else {
        console.log("Profile image already exist.");
        this.isSetDefaultImage = false;
      }
    });

    //calendar
    this.calendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      allDaySlot: false, //remove allday header
      contentHeight: 300, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      // slotMinTime: '07:00:00',
      // slotMaxTime: '19:00:00',
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      initialView: "timeGridWeek",
      themeSystem: 'bootstrap',
      // dateClick: this.onDateClick.bind(this),
      // events:this.eventarray,
      eventClick: this.handleEventClick.bind(this),
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        meridiem: true
      },
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: true, //overlap event each other
      drop: '',
      headerToolbar: {
        left: '',
        center: '',
        right: 'prev,currentWeek,next'
      },
      dayHeaders: true, //remove header
      // hiddenDays: [],
      weekends: false,
      dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '00:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration: '24:00:00', //time interval
      customButtons:{
        currentWeek:{
          text:'This Week',
          click:function(){
            const currentdate=moment().format('YYYY.MM.DD');
            const newDate = moment(currentdate).add(1, 'days').format('YYYY.MM.DD');
            console.log("New Date : ",newDate);
            console.log("Current Date : ",currentdate);
            this.calendarApi.gotoDate(newDate);
          }
        }
      }
    };

    //searchCalendar
    this.searchCalendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      allDaySlot: false, //remove allday header
      contentHeight: 300, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      // eventStartEditable: false,
      initialView: "timeGridWeek",
      themeSystem: 'bootstrap',
      // slotMinTime: '07:00:00',
      // slotMaxTime: '19:00:00',
      // dateClick: this.onDateClick.bind(this),
      //events: this.eventarray,
      eventClick:this.searchHandleEventClick.bind(this),
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        meridiem: true
      },
      // eventTypes:[ { title: 'Type 1', id: 1, selected: true, color: 'red' },
      // { title: 'Type 2', id: 2, selected: true, color: 'blue' },
      // { title: 'Type 3', id: 3, selected: true, color: 'green' },],
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: true, //overlap event each other
      drop: '',
      headerToolbar: {
        left: '',
        center: '',
        right: 'prev,basicWeek,next'
      },
      dayHeaders: true, //remove header
      // hiddenDays: [0, 6],
      weekends: false,
      dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '00:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration: '24:00:00', //time interval
      // slotLaneClassNames:"pg"
    };

  }

  ngAfterViewChecked() {
    this.calendarApi = this.calendarComponent.getApi();
  }

  handleEventClick(arg:any){

  }
  
  searchHandleEventClick(arg:any){

  }

 isShow(){
 this.isSearch=true;

  //get image profile
  this.HttpService.getMethod(
    "http://localhost:8081/image/getImage?id=" + this.currentUserID
  ).subscribe(async (response) => {
    this.searchProfile = response;
    this.searchProfile = this.sanitizer.bypassSecurityTrustUrl(
      "data:image/png;base64," + this.searchProfile.userImageData
    );
    console.log("Search Profile image Data : ", this.searchProfile);
    console.log(typeof this.searchProfile);
    //setting default image
    if (this.searchProfile === undefined) {
      console.log("Search Profile image is not set yet.");
      this.isSetSearchDefaultImage = true;
    } else {
      console.log("Search Profile image already exist.");
      this.isSetSearchDefaultImage = false;
    }
  });
 }

getUsername(staff:any){
console.log("Clicked staff info in card : ",staff);

  if (this.isOpen == true) {
    this.searchUserId=staff.userId;
    console.log("Search UserId : ",this.searchUserId);
    this.searchUsername = staff.username;
    console.log("Search Username : "+this.searchUsername);
    this.searchTeamname = staff.departmentname;
    console.log("Search Team name : ",this.searchTeamname);
    this.searchText=this.searchUsername;
    this.isOpen = !this.isOpen;
  }
 }
 //searchbar
 imageResolver(byte: any[]) {
  return this.sanitizer.bypassSecurityTrustUrl(
    "data:image/png;base64," + byte
  );
}

previousProcess(){

}

nextProcess(){
  
}

currentweek(){
  
}



}

