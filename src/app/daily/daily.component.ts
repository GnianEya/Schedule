import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DataShareService } from '../../services/data-share.service';
import { BehaviorSubject, first } from 'rxjs';
//calendar
import { FullCalendarComponent } from "@fullcalendar/angular";
import { PopupModalComponent } from "../popup-modal/popup-modal.component";
import { Attendee } from "../../models/attendee";
import { bindCallback } from "rxjs";
import { HttpServiceService } from "../../services/http-service.service";
import { Event } from "../../models/event";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { firstValueFrom } from 'rxjs';
import { lastValueFrom } from 'rxjs';


//searchbar
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { SearchFiltering } from '../../models/searchFiltering';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

//sweetAlert2
import Swal from "sweetalert2";
import { generateKey } from 'crypto';
import { createElement } from '@fullcalendar/core/preact';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})

export class DailyComponent implements OnInit, OnChanges {
  currentTime = new Date();
  isDisplay: boolean = false;
  calendarOptions: any;
  // isEditable = true;
  // isSearchEditable=true;
  currentLoginUserId: number;
  currentLoginUsername = '';
  currentLoginUsernameHost: any;
  eventarray: any[] = [];
  optimizedeventarray: any[] = [];
  searchEventArray: any[] = [];
  optimizedSearchEventArray: any[] = [];
  searchCalendarOptions: any;
  isExpired = false;
  isOpen = false;
  searchText = '';
  staffname = '';
  staffnamefetch = '';
  searchUserId: any;
  searchUserIdArray: string[] = [];
  optimizedSearchUserIdArray: string[] = [];
  searchUsernameArray: any;
  staffdepartment = '';
  responseStaff: any[] = [];
  userIdinLS: any;
  indexCounter = 0;
  optimizedSearchFiltering: SearchFiltering[] = [];
  previousUser: any[] = [];
  optimizedPreviousUser: any[] = [];
  nextUser: any[] = [];
  optimizedNextUser: any[] = [];
  eventTitle: any;
  eventStartDate: any;
  eventStartTime: any;
  url = 'http://localhost:8081/user/serchUsesDetails';
  testImage: any;
  eventData: any;
  optimizedEventData: any;
  title: any;
  description: any;
  attendees: any;
  start: any;
  end: any;
  searchtitle: any;
  searchdescription: any;
  searchattendees: any;
  searchstart: any;
  searchend: any;
  searchEventData: any;
  optimizedSearchEventData: any;
  attendee: any;
  scheduleId: any;
  scheduleIdHost: any;
  attendeesHost: any;
  optimizedattendeesHost: any;
  search_no_data: boolean = false;
  isAttendee: boolean = false;
  constructor(private dialogView: MatDialog, private data: DataShareService, private httpService: HttpServiceService, private sanitizer: DomSanitizer,private toast:NgToastService) { }
  @ViewChild("calendar", { static: true })
  calendarComponent!: FullCalendarComponent;
  @ViewChild("searchCalendar", { static: true })
  searchCalendarComponent!: FullCalendarComponent;

  //  icon=document.getElementById('header-toggle') as HTMLSpanElement;
  //  icon.class="";

  ngOnChanges(changes: SimpleChanges): void {
    //     console.log("This is onChange.");
    //     this.data.currentMessage.subscribe(msg=>this.isDisplay=msg);
    // console.log("Show : "+this.isDisplay);
    //  if(this.isDisplay==true){
    //   console.log("isStyleDisplay :  true");
    //  }else{
    //   console.log("isStyleDisplay : false");
    //  }
  }

  ngOnInit(): void {
    console.log("init : " + this.isDisplay);

    this.currentLoginUserId = JSON.parse(localStorage.getItem("id"));
    console.log("Current Logined User ID : ", this.currentLoginUserId);

    this.currentLoginUsername = JSON.parse(localStorage.getItem("name"));
    console.log("Current Logined User Name : ", this.currentLoginUsername);

    console.log("Is Attendee  : ", this.isAttendee);



    //get logined username

    this.httpService.getMethod("http://localhost:8081/user/serchUserProfile?userId=" + this.currentLoginUserId).subscribe(
      async (response) => {
        this.currentLoginUsernameHost = response;
        console.log("Current Logined User name Host : ", this.currentLoginUsernameHost);
        this.currentLoginUsernameHost.map(
          (data) => {
            this.currentLoginUsername = data.uname;
            console.log("Current Login User name : ", this.currentLoginUsername);
          }
        );
      }
    );

    //calendar

    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.currentLoginUserId)
      .subscribe(
        async (response) => {
          this.eventarray = response as any[];

          console.log("The Scheduleresponse : ", response);
          this.optimizedeventarray = this.eventarray.map(
            (e) => {
              var start = e.start + 'T' + e.startTime;
              var end = e.end + 'T' + e.endTime;
              if (e.privacy == true) {
                //calling api for updating title
                console.log("Schedule Privacy : ", e.privacy);
                return {
                  resourceId: "1",
                  title: e.title,
                  start: start,
                  end: end,
                  color: this.colorization(e.status),
                };
              } else {
                console.log("Schedule Privacy : ", e.privacy);
                return {
                  resourceId: "1",
                  title: "Personal Appointment",
                  start: start,
                  end: end,
                  color: this.colorization(e.status),
                };
              }

            }
          );
          this.calendarOptions.events = this.optimizedeventarray;
          for (let e of this.optimizedeventarray) {
            console.log("title : " + e.title);
            console.log("start : " + e.start);
            console.log("end : " + e.end);
            //  console.log("color : "+e.color);
          }
          console.log("Optimized event : ", this.optimizedeventarray);
          // this.calendarComponent.addEvent();
        },
        (error) => { console.log(error); }
      );

    //searchbar
    this.httpService.getMethod(this.url).subscribe(
      async (response) => {
        this.responseStaff = response as any[];
        this.optimizedSearchFiltering = this.responseStaff.map((e, i) => {
          return {
            userId: e.userId,
            username: e.uname,
            departmentname: e.departmentName,
            userImage: e.imageData
          };
        });

        for (let e of this.optimizedSearchFiltering) {
          e.userImage = await this.imageResolver(e.userImage);

        }
        console.log("Optimized array ", this.optimizedSearchFiltering);

        //search filter without current user ID
        this.optimizedSearchFiltering=this.optimizedSearchFiltering.filter((item)=>item.userId!=this.currentLoginUserId.toString());
        console.log("Filtered without current user Id : ",this.optimizedSearchFiltering);
      },
      (error) => { console.log(error); }
    );

    //calendar
    this.calendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      allDaySlot: false, //remove allday header
      contentHeight: 500, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      initialView: "timeGridDay",
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
        right: 'prev,today,next'
      },
      dayHeaders: true, //remove header
      hiddenDays: [0, 6],
      weekends: false,
      dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '07:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration: '00:15:00', //time interval

    };

    //searchCalendar
    this.searchCalendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      allDaySlot: false, //remove allday header
      contentHeight: 500, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      // eventStartEditable: false,
      initialView: "timeGridDay",
      themeSystem: 'bootstrap',
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',
      // dateClick: this.onDateClick.bind(this),
      //events: this.eventarray,
      eventClick: this.searchHandleEventClick.bind(this),
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
        right: 'prev,today,next'
      },
      dayHeaders: true, //remove header
      hiddenDays: [0, 6],
      weekends: false,
      dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '07:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration: '00:15:00', //time interval
      // slotLaneClassNames:"pg"
    };



  }

  removeAction() {
    // this.dialogView.open(RemoveUserPopUpComponent);
    if (this.isShow) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Remove'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Removed!',
            'Member has been removed.',
            'success'
          )
        }
      });
      if (this.isDisplay) {
        this.isDisplay = !this.isDisplay;
      }
      console.log("U removed search User Id : ", this.searchUserId);
      this.searchUserIdArray = this.searchUserIdArray.filter(item => item != this.searchUserId);
      console.log("Search User array after removing : ", this.searchUserIdArray);
      //localStorage.clear();
      localStorage.setItem("Search_EVENT_KEY@userId", JSON.stringify(this.searchUserIdArray));
      console.log("New re-allocation array in local storage : ", localStorage.getItem("Search_EVENT_KEY@userId"));
    }
  }

  loadElement() {
    console.log("This is onChange.");
    this.data.currentMessage.subscribe(msg => this.isDisplay = msg);
    console.log("Show : " + this.isDisplay);
    if (this.isDisplay == true) {
      console.log("isStyleDisplay :  true");
    } else {
      console.log("isStyleDisplay : false");
    }
  }

  async handleEventClick(arg: any) {
    console.log("start : ", arg.event.startStr);//2023-01-09T08:00:00+06:30
    this.eventTitle = arg.event._def.title;
    console.log("Event Title : ", this.eventTitle);
    this.eventStartDate = arg.event.startStr.substring(0, 10);
    console.log("Event Start Date : ", this.eventStartDate);
    this.eventStartTime = arg.event.startStr.substring(11, 19);
    console.log("Event Start Time : ", this.eventStartTime);

    //isEditable Processing
    let editableResponse: any = await firstValueFrom(this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId=' + this.currentLoginUserId));
    console.log("Editable Response Array : ", editableResponse);
    let isEvent: any = editableResponse.filter(
      (item) => {
        console.log("Filter properties : ", item.title, ",", item.start, ",", item.startTime);
        if (item.start == this.eventStartDate && item.startTime == this.eventStartTime) {
          console.log("Filtered item-event : ", item);
          return item;
        }
      }
    );
    console.log("Filtered A Event : ", isEvent);
    let isEditable: boolean = false;
    let isPrivacy: boolean = false;
    isEvent.map(
      (data) => {
        isPrivacy = data.privacy;
        console.log("isPrivacy : ", isPrivacy);
        console.log(data.status);
        if (data.status != 'ongoing') {
          isEditable = false;
        }
        else {
          isEditable = true;
        }
      }
    );
    console.log("isEditable becomes : ", isEditable);

    //Pending Data to Pop up
    await this.getScheduleId(this.eventTitle);
    console.log("Schedule Id catching : ", this.scheduleId);
    await this.grapAttandee();
    console.log("Debug Thrid");
    //rxj firstValueFrom converts Observable to Promise
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/eventDetails?scheduleId=" + this.scheduleId));
    this.eventData = result;
    console.log("Event Data : ", this.eventData);
    this.optimizedEventData = this.eventData.map(
      (data) => {
        return {
          userId: data.userId,
          scheduleId: data.id,
          title: data.title,
          description: data.description,
          attendees: this.attendeesHost,
          start: data.start_time,
          end: data.end_time,
          startDate: data.start
        };
      }
    );
    console.log("Optimized Event Data : ", this.optimizedEventData);
    this.httpService.getMethod("http://localhost:8081/user/eventDetails?scheduleId=" + this.scheduleId).subscribe(
      async (response) => {
        this.eventData = response;
        console.log("Event Data : ", this.eventData);
        console.log("attandes :", this.attendeesHost)
        this.optimizedEventData = this.eventData.map(
          (data) => {
            return {
              userId: data.userId,
              scheduleId: data.id,
              title: data.title,
              description: data.description,
              attendees: this.attendeesHost,
              start: data.start_time,
              end: data.end_time,
              startDate: data.start
            };
          }
        );
        console.log("Optimized Event Data : ", this.optimizedEventData);

        this.optimizedEventData.map(
          (data) => {
            this.title = data.title;
            this.description = data.description;
            this.attendees = data.attendees;
            this.start = data.start;
            this.end = data.end;
          }
        );
        console.log("Title: ", this.title, this.description, this.attendees, this.start, this.end);

      }
    );

    console.log("Attendee : ", this.attendeesHost);

    //who can have access in case of isPrivacy
    let isPrivacyAccess: boolean = false;
    let isPrivacyAccessArray:any[];
    isPrivacyAccessArray=this.attendeesHost.filter((item)=>item.userId==this.currentLoginUserId);
    console.log("Privacy Array : ",isPrivacyAccessArray);
    if(isPrivacyAccessArray.length){
      isPrivacyAccess = true;
    }else{
      isPrivacyAccess = false;
    }
    // for (let e of this.attendeesHost) {
    //   console.log("Check ID : ",e.userId,this.currentLoginUserId);
    //   if (this.currentLoginUserId == e.userId) {
    //     isPrivacyAccess = true;
    //   } else {
    //     isPrivacyAccess = false;
    //   }
    // }
    console.log("isPrivacyAccess : ", isPrivacyAccess);
    if(!isEditable){
      this.toast.error({
        detail: "Error Message",
        summary: "Event have been finished.",
        duration: 3000,
      });
     }else
      if(!isPrivacy && !isPrivacyAccess){
        this.toast.error({
          detail: "Error Message",
          summary: "Do not have access to see the event.",
          duration: 3000,
        });
      }
    if(isPrivacy){

      if(isEditable){
        this.dialogView.open(PopupModalComponent, {
          data: this.optimizedEventData,//{title:this.title,description:this.description,attendees:this.attendees,start:this.start,end:this.end}
          width: '40vw', //sets width of dialog
          height: '80vh', //sets width of dialog
          maxWidth: '100vw', //overrides default width of dialog
          maxHeight: '100vh', //overrides default height of dialog
          disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
        });
      }
 }



    else{ 
       if(isEditable){
           if(isPrivacyAccess){
            this.dialogView.open(PopupModalComponent, {
              data: this.optimizedEventData,//{title:this.title,description:this.description,attendees:this.attendees,start:this.start,end:this.end}
              width: '40vw', //sets width of dialog
              height: '80vh', //sets width of dialog
              maxWidth: '100vw', //overrides default width of dialog
              maxHeight: '100vh', //overrides default height of dialog
              disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
            });
       }
       }

    }
    // if (isPrivacy || isEditable || (isPrivacy && isPrivacyAccess)) {
    //   console.log('This isEditable : ', isEditable);
    //   this.dialogView.open(PopupModalComponent, {
    //     data: this.optimizedEventData,//{title:this.title,description:this.description,attendees:this.attendees,start:this.start,end:this.end}
    //     width: '40vw', //sets width of dialog
    //     height: '80vh', //sets width of dialog
    //     maxWidth: '100vw', //overrides default width of dialog
    //     maxHeight: '100vh', //overrides default height of dialog
    //     disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
    //   });
    //   isPrivacy = !isPrivacy;
    //   isEditable = !isEditable;
    // } else {
    //   console.log("Meeting passed through.");
    // }
  }

  async searchHandleEventClick(arg: any) {
    console.log("start : ", arg.event.startStr);//2023-01-09T08:00:00+06:30
    this.eventTitle = arg.event._def.title;
    console.log("Event Title : ", this.eventTitle);
    this.eventStartDate = arg.event.startStr.substring(0, 10);
    console.log("Event Start Date : ", this.eventStartDate);
    this.eventStartTime = arg.event.startStr.substring(11, 19);
    console.log("Event Start Time : ", this.eventStartTime);

    //isEditable Processing
    let editableResponse: any = await firstValueFrom(this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId=' + this.searchUserId));
    console.log("Editable Response Array : ", editableResponse);
    let isEvent: any = editableResponse.filter(
      (item) => {
        console.log("Filter properties : ", item.title, ",", item.start, ",", item.startTime);
        if (item.start == this.eventStartDate && item.startTime) {
          console.log(item);
          return item;
        }
      }
    );
    console.log("Filtered A Event : ", isEvent);
    let isEditable: boolean = false;
    let isPrivacy: boolean = false;
    isEvent.map(
      (data) => {
        isPrivacy = data.privacy;
        console.log("isPrivacy : ", isPrivacy);
        if (data.status != 'ongoing') {
          isEditable = false;
        }
        else {
          isEditable = true;
        }
      }
    );
    console.log("isEditable becomes : ", isEditable);

    await this.getSearchScheduleId(this.eventTitle);
    console.log('ScheduleId catching : ', this.scheduleId);
    await this.grapAttandee();
    console.log("Debug Third")
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/eventDetails?scheduleId=" + this.scheduleId));
    this.searchEventData = result;
    console.log("Search Event Data : ", this.searchEventData);
    console.log("Search Attendee : ", this.attendeesHost);
    this.optimizedSearchEventData = this.searchEventData.map(
      (data) => {
        return {
          userId: data.userId,
          scheduleId: data.id,
          title: data.title,
          description: data.description,
          attendees: this.attendeesHost,
          start: data.start_time,
          end: data.end_time,
          startDate: data.start
        };
      }
    );
    console.log("Optimized Search Event Data : ", this.optimizedSearchEventData);

    this.optimizedSearchEventData.map(
      (data) => {
        this.searchtitle = data.title;
        this.searchdescription = data.description;
        this.searchattendees = data.attendees;
        this.searchstart = data.start;
        this.searchend = data.end;
      }
    );
    console.log("Title: ", this.searchtitle, this.searchdescription, this.searchattendees, this.searchstart, this.searchend);
    console.log("isEditable : ", isEditable);

    //who can have access in case of isPrivacy
    let isPrivacyAccess: boolean = false;
    let isPrivacyAccessArray:any[];
    isPrivacyAccessArray=this.attendeesHost.filter((item)=>item.userId==this.currentLoginUserId);
    console.log("Privacy Array : ",isPrivacyAccessArray);
    if(isPrivacyAccessArray.length){
      isPrivacyAccess = true;
    }else{
      isPrivacyAccess = false;
    }
    // for (let e of this.attendeesHost) {
    //   if (this.currentLoginUserId != e.userId) {
    //     isPrivacyAccess = false;
    //   } else {
    //     isPrivacyAccess = true;
    //   }
    // }
    console.log("isPrivacyAccess : ", isPrivacyAccess);
    if(!isEditable){
      this.toast.error({
        detail: "Error Message",
        summary: "Event have been finished.",
        duration: 3000,
      });
     }else
      if(!isPrivacy && !isPrivacyAccess){
        this.toast.error({
          detail: "Error Message",
          summary: "Do not have access to see the event.",
          duration: 3000,
        });
      }
    if(isPrivacy){

      if(isEditable){
        console.log('This isEditable : ', isEditable);
        this.dialogView.open(PopupModalComponent, {
          data: this.optimizedSearchEventData,
          width: '40vw', //sets width of dialog
          height: '80vh', //sets height of dialog
          maxWidth: '100vw', //overrides default width of dialog
          maxHeight: '100vh', //overrides default height of dialog
          disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
  
        });
      }
 }else{ 
       if(isEditable){
           if(isPrivacyAccess){
            console.log('This isEditable : ', isEditable);
            this.dialogView.open(PopupModalComponent, {
              data: this.optimizedSearchEventData,
              width: '40vw', //sets width of dialog
              height: '80vh', //sets height of dialog
              maxWidth: '100vw', //overrides default width of dialog
              maxHeight: '100vh', //overrides default height of dialog
              disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
      
            });
       }
       }

    }
    // if ((isPrivacy && isPrivacyAccess && isEditable)||(isPrivacy && isPrivacyAccess && isEditable)) {

    //   isPrivacy = !isPrivacy;
    //   isEditable = !isEditable;
    // } else {
    //   console.log("Meeting passed through.");
    // }
  }

  colorization(status: string) {
    return status == 'ongoing' ? '#1B98E080' : 'gray';
  }
  //searchbar
  imageResolver(byte: any[]) {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + byte);
  }

  getUsername(staff: any) {
    console.log("Debug => ", this.responseStaff);
    console.log("Debug => ", staff);
    console.log(this.staffname);
    if (this.isOpen == true) {
      this.searchText = staff.username;
      this.staffnamefetch = staff.username
      this.searchUserId = staff.userId
      console.log("search User Id : ", this.searchUserId);
      console.log("Search User Name : ", this.searchText);
      console.log(this.searchText + " : " + this.searchUserId);
      //add to local Storage
      this.searchUserIdArray.push(this.searchUserId);
      this.isOpen = !this.isOpen;
      this.search_no_data = !this.search_no_data;
      // this.isEditable=true;

    }

  }

  isShow() {
    console.log("Search Show .");
    if (this.search_no_data) {
      this.data.changeMessage(true);
      this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.searchUserId).subscribe(
        async (response) => {
          this.searchEventArray = response as any[];
          console.log("The response : ", this.searchEventArray);
          this.optimizedSearchEventArray = this.searchEventArray.map(
            (e) => {
              var start = e.start + 'T' + e.startTime;
              var end = e.end + 'T' + e.endTime;
              if (e.privacy == true) {
                console.log("Schedule Privacy : ", e.privacy);
                return {
                  resourceId: "1",
                  title: e.title,
                  start: start,
                  end: end,
                  color: this.colorization(e.status),
                };
              } else {
                console.log("Schedule Privacy : ", e.privacy);
                return {
                  resourceId: "1",
                  title: "Personal Appointment",
                  start: start,
                  end: end,
                  color: this.colorization(e.status),
                };
              }

            });
          this.searchCalendarOptions.events = this.optimizedSearchEventArray;
        }
      );
      this.data.currentMessage.subscribe(msg => this.isDisplay = msg);
      console.log("Show : " + this.isDisplay);
      if (this.isDisplay == true) {
        console.log("isStyleDisplay :  true");
      } else {
        console.log("isStyleDisplay : false");
      }

      //filter no inclusive same item
      localStorage.setItem("Search_EVENT_KEY@userId", JSON.stringify(this.searchUserIdArray));
      this.userIdinLS = JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
      console.log("search user ID in local Storage : ", this.userIdinLS);
      console.log(typeof this.userIdinLS);
      console.log("search user ID in local Storage with index : ", this.userIdinLS[0], this.userIdinLS[1], this.userIdinLS[2]);
      this.staffname = this.staffnamefetch;

      this.search_no_data = !this.search_no_data;

    }
  }

  previousfetch() {
    console.log("current index moved forword to index : ", this.indexCounter);
    // this.refilterSearchArray()
    const userIdinLS = JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
    if (userIdinLS.length == 1) {
      this.indexCounter = 0;
    } else {
      this.indexCounter = (this.indexCounter + 1) % userIdinLS.length;
    }
    const previousSearchUserId = userIdinLS[this.indexCounter];
    console.log("search user ID change as : ", previousSearchUserId);

    //prevent click in initial state
    if (this.searchUserIdArray == undefined) {
      this.isDisplay = false;
    } else {
      this.isDisplay = true;
    }
    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + previousSearchUserId).subscribe(
      async (response) => {
        this.previousUser = response as any[];
        console.log("The response : ",);
        this.optimizedPreviousUser = this.previousUser.map(
          (e) => {
            var start = e.start + 'T' + e.startTime;
            var end = e.end + 'T' + e.endTime;
            if (e.privacy == true) {
              console.log("Schedule Privacy : ", e.privacy);
              return {
                resourceId: "1",
                title: e.title,
                start: start,
                end: end,
                color: this.colorization(e.status),
              };
            } else {
              console.log("Schedule Privacy : ", e.privacy);
              return {
                resourceId: "1",
                title: "Personal Appointment",
                start: start,
                end: end,
                color: this.colorization(e.status),
              };
            }

          });
        console.log("Previous search Data Event : ", this.optimizedPreviousUser);
        //get user name while searching
        this.previousUser.map(
          (data) => {
            this.staffname = data.currentUserName;
            console.log("Staff name change in searching ", this.staffname, data.currentUserName);
          }
        );
        this.searchCalendarOptions.events = this.optimizedPreviousUser;
      }
    );
    this.searchUserId = previousSearchUserId;
    console.log("current search user Id : (previous)", this.searchUserId);

  }

  nextfetch() {
    const userIdinLS = JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
    this.indexCounter--;
    if (this.indexCounter == -1) {
      this.indexCounter = userIdinLS.length - 1;
    }

    // this.refilterSearchArray();
    console.log("current index move forword to index : ", this.indexCounter);
    const nextSearchUserId = userIdinLS[this.indexCounter];
    console.log("search user ID change as : ", nextSearchUserId);
    // this.searchEventArray.map((data) => {
    //   this.staffname=data.uname;
    //   console.log("Staff name change in searching ",this.staffname);
    //  });

    //prevent click in initial state
    if (this.searchUserIdArray == undefined) {
      this.isDisplay = false;
    } else {
      this.isDisplay = true;

    }

    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + nextSearchUserId).subscribe(
      async (response) => {
        this.nextUser = response as any[];
        console.log("The response : ", this.nextUser);
        this.optimizedNextUser = this.nextUser.map(
          (e) => {
            var start = e.start + 'T' + e.startTime;
            var end = e.end + 'T' + e.endTime;
            if (e.privacy == true) {
              console.log("Schedule Privacy : ", e.privacy);
              return {
                resourceId: "1",
                title: e.title,
                start: start,
                end: end,
                color: this.colorization(e.status),
              };
            } else {
              console.log("Schedule Privacy : ", e.privacy);
              return {
                resourceId: "1",
                title: "Personal Appointment",
                start: start,
                end: end,
                color: this.colorization(e.status),
              };
            }

          });

        //get search user name
        this.nextUser.map(
          (data) => {
            this.staffname = data.currentUserName;
            console.log("Staff name change in searching ", this.staffname, data.currentUserName);
          }
        );
        this.searchCalendarOptions.events = this.optimizedNextUser;
      }
    );
    this.searchUserId = nextSearchUserId;
    console.log("current search user Id : (next)", this.searchUserId);

  }

  refilterSearchArray() {
    localStorage.clear();
    this.searchUserIdArray = this.searchUserIdArray.filter(item => item != item);
    console.log("Refilter in local storage search array : ", this.searchUserIdArray);
    localStorage.setItem("Search_EVENT_KEY@userId", JSON.stringify(this.searchUserIdArray));
  }

  async grapAttandee() {
    console.log("Debug Second")
    //get attendee
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchMeetingSchedule?scheduleId=" + this.scheduleId));
    this.attendeesHost = result;
    console.log("Attendee Host : ", this.attendeesHost);
    //  .subscribe(
    //   async (response) => {

    //   }
    // );
  }
  async getScheduleId(title: any) {
    console.log("Debug First")
    //get scheduleId /serchUserSchedule
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.currentLoginUserId));
    this.scheduleIdHost = result;
    console.log("Schedule Id Host : ", this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data) => {
        if ((data.title == title) || ( "Personal Appointment" == title)){
          this.scheduleId = data.scheduleId;
        }
      }
    );
    console.log("Schedule Id for calendar : ", this.scheduleId);
  }
  async getSearchScheduleId(title: any) {
    console.log("Debug First")
    //get scheduleId /serchUserSchedule
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.searchUserId));
    this.scheduleIdHost = result;
    console.log("Schedule Id Host : ", this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data) => {
        if ((data.title == title) || ( "Personal Appointment" == title)) {
          this.scheduleId = data.scheduleId;
        }
      }
    );
    console.log("Schedule Id for search calendar : ", this.scheduleId);
  }
  report() {
  }
}





