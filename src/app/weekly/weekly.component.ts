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
import { firstValueFrom, reduce } from 'rxjs';
import { PopupModalComponent } from 'app/popup-modal/popup-modal.component';
import { DataShareService } from 'services/data-share.service';
import { PopupWeeklyComponent } from 'app/popup-weekly/popup-weekly.component';
import { MatDialog } from '@angular/material/dialog';

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
eventarray:any;
optimizedeventarray:any;
currentLoginUserId:any;
eventTitle:any;
eventStartDate:any;
eventStartTime:any;
scheduleId:any;
scheduleIdHost:any;
eventData:any;
optimizedEventData:any;
attendeesHost:any;
searchEventData:any;
optimizedSearchEventData:any;
search_no_data:boolean=false;
searchEventArray:any;
optimizedSearchEventArray:any;
isDisplay:boolean=false;
@ViewChild("calendar", { static: true })
calendarComponent!: FullCalendarComponent;
@ViewChild("searchCalendar", { static: true })
searchCalendarComponent!: FullCalendarComponent;

  constructor(
    private HttpService:HttpServiceService,
    private sanitizer: DomSanitizer,
    private httpService: HttpServiceService,
    private data:DataShareService,
    private dialogView: MatDialog
    ) { }

  ngOnInit() {
    this.currentUserID=JSON.parse(localStorage.getItem("id"));
    console.log("Current User ID : ",this.currentUserID);
    console.log("Date Picked : ",this.dataFromPicker);
    console.log("key up ",this.isOpen);
    console.log("Search text : ",this.searchText);
    this.currentLoginUserId = JSON.parse(localStorage.getItem("id"));
    console.log("Current Logined User ID : ", this.currentLoginUserId);
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
          this.teamname=data.teamName;
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
      contentHeight: 250, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      // slotMinTime: '07:00:00',
      // slotMaxTime: '19:00:00',
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      initialView: "dayGridWeek",
      themeSystem: 'bootstrap',
      // dateClick: this.onDateClick.bind(this),
      // events:this.eventarray,
      eventClick: this.handleEventClick.bind(this),
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        // second: '0-digit',
        meridiem: true
      },
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: false, //overlap event each other
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
      // slotDuration: '24:00:00', //time interval
      customButtons:{
        currentWeek:{
          text:'This Week',
          click:function(){
             const currentdate=moment().format('YYYY.MM.DD');
             const newDate = moment(currentdate).add(1, 'days').format('YYYY.MM.DD');
            // console.log("New Date : ",newDate);
            // console.log("Current Date : ",currentdate);
             this.calendarComponent.getApi().gotoDate(newDate);
          }
        }
      }
    };

    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.currentLoginUserId)
      .subscribe(
        async (response) => {
          this.eventarray = response as any[];

          console.log("The Scheduleresponse : ", response);
          this.optimizedeventarray = this.eventarray.map(
            (e) => {
              var start = e.start + 'T' + e.startTime;
              var end = e.end + 'T' + e.endTime;
              //In order not to display deleted schedule
              if(e.isDelete==1){
                return {
                  resourceId: "1",
                  title: "Cancelled",
                  start: start,
                  end: end,
                  color: this.colorization(e.status,e.isDelete),
                };
              }else{
                if(e.privacy){
                  console.log("Schedule Privacy : ",e.privacy);
                  return {
                    resourceId: "1",
                    title: e.title,
                    start: start,
                    end: end,
                    color: this.colorization(e.status,e.isDelete),
                  };
                }else{
                  console.log("Schedule Privacy : ",e.privacy);
                  return {
                    resourceId: "1",
                    title: "Personal Appointment",
                    start: start,
                    end: end,
                    color: this.colorization(e.status,e.isDelete),
                  };
                }
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

      

    //searchCalendar
    this.searchCalendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      allDaySlot: false, //remove allday header
      contentHeight: 250, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      // slotMinTime: '07:00:00',
      // slotMaxTime: '19:00:00',
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize: true, //to be responsive to window size
      initialView: "dayGridWeek",
      themeSystem: 'bootstrap',
      // dateClick: this.onDateClick.bind(this),
      // events:this.eventarray,
      eventClick: this.searchHandleEventClick.bind(this),
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        // second: '0-digit',
        meridiem: true
      },
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: false, //overlap event each other
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
      // slotDuration: '24:00:00', //time interval
      customButtons:{
        currentWeek:{
          text:'This Week',
          click:function(){
             //const currentdate=moment().format('YYYY.MM.DD');
            // const newDate = moment(currentdate).add(1, 'days').format('YYYY.MM.DD');
            // console.log("New Date : ",newDate);
            // console.log("Current Date : ",currentdate);
            // this.calendarComponent.getApi().gotoDate(newDate);
          }
        }
      }
    };

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
    let editableResponse:any=await firstValueFrom(this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId='+this.currentLoginUserId));
    console.log("Editable Response Array : ",editableResponse);
    let isEvent:any=editableResponse.filter(
      (item)=>{
        console.log("Filter properties : ",item.title,",",item.start,",",item.startTime);
        if(item.title==this.eventTitle && item.start==this.eventStartDate && item.startTime){
          console.log(item);
         return item;  
        }
      }
    );
    console.log("Filtered A Event : ",isEvent);
    let isEditable:boolean=false;
    let isPrivacy:boolean=false;
    isEvent.map(
      (data)=>{
        isPrivacy=data.privacy;
        console.log("isPrivacy : ",isPrivacy);
        console.log(data.status,' : ',data.isDelete);
        if(data.status!='ongoing' || data.isDelete==1){
          isEditable=false;
        }
        else{
          isEditable=true;
        }
      }
    );
    console.log("isEditable becomes : ",isEditable);

    //Pending Data to Pop up
    await this.getScheduleId(this.eventTitle);
    console.log("Schedule Id catching : ",this.scheduleId);
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
    this.httpService.getMethod("http://localhost:8081/user/eventDetails?scheduleId=" +this.scheduleId).subscribe(
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

      }
    );

    console.log("Attendee : ", this.attendeesHost);

    //who can have access in case of isPrivacy
    let isPrivacyAccess:boolean=false;
    for(let e of this.attendeesHost){
      if (this.currentLoginUserId!=e.userId){
        isPrivacyAccess=false;
      }else{
        isPrivacyAccess=true;
      }
    }
    console.log("isPrivacyAccess : ",isPrivacyAccess);
     if (!isPrivacy || isEditable) {
      console.log('This isEditable : ',isEditable);
      this.dialogView.open(PopupWeeklyComponent, {
        data: this.optimizedEventData,//{title:this.title,description:this.description,attendees:this.attendees,start:this.start,end:this.end}
        width: '40vw', //sets width of dialog
        height: '50vh', //sets width of dialog
        maxWidth: '100vw', //overrides default width of dialog
        maxHeight: '100vh', //overrides default height of dialog
        disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
      });
      isPrivacy=!isPrivacy;
      isEditable=!isEditable;
   } else {
     console.log("Meeting passed through.");
    }
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
    let editableResponse:any=await firstValueFrom(this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId='+this.searchUserId));
    console.log("Editable Response Array : ",editableResponse);
    let isEvent:any=editableResponse.filter(
      (item)=>{
        console.log("Filter properties : ",item.title,",",item.start,",",item.startTime);
        if(item.title==this.eventTitle && item.start==this.eventStartDate && item.startTime){
          console.log(item);
         return item;  
        }
      }
    );
    console.log("Filtered A Event : ",isEvent);
    let isEditable:boolean=false;
    let isPrivacy:boolean=false;
    isEvent.map(
      (data)=>{
        isPrivacy=data.privacy;
        console.log("isPrivacy : ",isPrivacy);
        if(data.status!='ongoing' || data.isDelete==1){
          isEditable=false;
        }
        else{
          isEditable=true;
        }
      }
    );
    console.log("isEditable becomes : ",isEditable);

    await this.getSearchScheduleId(this.eventTitle);
    console.log('ScheduleId catching : ',this.scheduleId);
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

    console.log("isEditable : ",isEditable);

    //who can have access in case of isPrivacy
    let isPrivacyAccess:boolean=false;
    for(let e of this.attendeesHost){
      if (this.currentLoginUserId!=e.userId){
        isPrivacyAccess=false;
      }else{
        isPrivacyAccess=true;
      }
    }
    console.log("isPrivacyAccess : ",isPrivacyAccess);
    if (!isPrivacy || isEditable) {
      console.log('This isEditable : ',isEditable);
      this.dialogView.open(PopupWeeklyComponent, {
        data: this.optimizedSearchEventData,
        width: '40vw', //sets width of dialog
        height: '50vh', //sets height of dialog
        maxWidth: '100vw', //overrides default width of dialog
        maxHeight: '100vh', //overrides default height of dialog
        disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close

      });
      isPrivacy=!isPrivacy;
      isEditable=!isEditable;
    } else {
      console.log("Meeting passed through.");
    }
  }

 isShow(){
 if (this.search_no_data) {
  //get image profile
  this.isDisplay=true;
  this.HttpService.getMethod(
    "http://localhost:8081/image/getImage?id=" + this.searchUserId
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

    this.data.changeMessage(true);
    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.searchUserId).subscribe(
      async (response) => {
        this.searchEventArray = response as any[];
        console.log("The response : ", this.searchEventArray);
        this.optimizedSearchEventArray = this.searchEventArray.map(
          (e) => {
            var start = e.start + 'T' + e.startTime;
            var end = e.end + 'T' + e.endTime;
            //In order not to display deleted schedule
            if(e.isDelete==1){
              return {
                resourceId: "1",
                title: "Cancelled",
                start: start,
                end: end,
                color: this.colorization(e.status,e.isDelete),
              };
            }else{
              if(e.privacy){
                console.log("Schedule Privacy : ",e.privacy);
                return {
                  resourceId: "1",
                  title: e.title,
                  start: start,
                  end: end,
                  color: this.colorization(e.status,e.isDelete),
                };
              }else{
                console.log("Schedule Privacy : ",e.privacy);
                return {
                  resourceId: "1",
                  title: "Personal Appointment",
                  start: start,
                  end: end,
                  color: this.colorization(e.status,e.isDelete),
                };
              }
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
    this.search_no_data = !this.search_no_data;

  }
 }

getUsername(staff:any){
console.log("Clicked staff info in card : ",staff);

  if (this.isOpen == true) {
    this.searchUserId=staff.userId;
    console.log("Search UserId : ",this.searchUserId);
    this.searchUsername = staff.username;
    //transfer data to weekly profile
  this.data.changeSearchUserIdMessage(this.searchUserId);
    console.log("Search Username : "+this.searchUsername);
    this.searchTeamname = staff.departmentname;
    console.log("Search Team name : ",this.searchTeamname);
    this.searchText=this.searchUsername;
    this.isOpen = !this.isOpen;
    this.search_no_data = !this.search_no_data;
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


colorization(status: string,isDelete:any) {
  // return status == 'ongoing' ? '#1B98E080' : 'gray';
  if(status!='ongoing'){
    return 'gray';
  }else if(isDelete==1){
    return 'blue';
  }else{
    return 'blue';
  }
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
async getScheduleId(title:any) {
  console.log("Debug First");
  console.log("Title : ",title);
  //get scheduleId /serchUserSchedule
  let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.currentLoginUserId));
  this.scheduleIdHost = result;
  console.log("Schedule Id Host : ", this.scheduleIdHost);
  this.scheduleIdHost.map(
    (data) => {
      console.log(data.title ,':title :',title);
      if(data.title==title){
      this.scheduleId = data.scheduleId; 
      }
    }
  );
  console.log("Schedule Id for calendar : ", this.scheduleId);
}
async getSearchScheduleId(title:any) {
  console.log("Debug First")
  //get scheduleId /serchUserSchedule
  let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId=" + this.searchUserId));
  this.scheduleIdHost = result;
  console.log("Schedule Id Host : ", this.scheduleIdHost);
  this.scheduleIdHost.map(
    (data) => {
      console.log(data.title ,':tile :',title);
      if(data.title==title){
      this.scheduleId = data.scheduleId;
      }
    }
  );
  console.log("Schedule Id for search calendar : ", this.scheduleId);
}

report(){
  
}

}

