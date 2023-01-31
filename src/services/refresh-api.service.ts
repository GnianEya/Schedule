import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshApiService {

  constructor(
    private httpService:HttpServiceService
  ) { }

  private _currentlistener=new Subject();
  private _searchlistener=new Subject();
  private _titleAndDescriptionlistener=new Subject();
  private _attendeelistener=new Subject();
  eventarray:any;
  optimizedeventarray: any;
  searcheventarray:any;
  optimizedsearcheventarray: any;

  listenCurrentCalendar():Observable<any>{
    return this._currentlistener.asObservable();
  }
  listenSearchCalendar():Observable<any>{
    return this._searchlistener.asObservable();
  }
  listenTitleAndDescription():Observable<any>{
    return this._titleAndDescriptionlistener.asObservable();
  }
  listenAttendee():Observable<any>{
    return this._attendeelistener.asObservable();
  }

  async refreshDataCurrentCalendar(currentLoginUserId:any){
    let result=await firstValueFrom(this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId='+currentLoginUserId));
    console.log("The Event response in refresh service: ", result);

    this.optimizedeventarray = result.map(
      (e) => {
        var start = e.start + 'T' + e.startTime;
        var end = e.end + 'T' + e.endTime;
        if (e.privacy == true) {
          //calling api for updating title
          console.log("Schedule Privacy in refresh service : ", e.privacy);
          return {
            resourceId: "1",
            title: e.title,
            start: start,
            end: end,
            color: this.colorization(e.status),
          };
        } else {
          console.log("Schedule Privacy in refresh service :  ", e.privacy);
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
   //rebinding data back
    this._currentlistener.next(this.optimizedeventarray);

  }
  
  async refreshDataSearchCalendar(searchUserId:any){
    let result=await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId="+searchUserId));
    console.log("The Event response in refresh service: ",result);

    this.optimizedsearcheventarray = result.map(
      (e) => {
        var start = e.start + 'T' + e.startTime;
        var end = e.end + 'T' + e.endTime;
        if (e.privacy == true) {
          //calling api for updating title
          console.log("Schedule Privacy in refresh service : ", e.privacy);
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
    console.log("Optimized Search Event Array : ",this.optimizedsearcheventarray);
    
    //rebinding data back
    this._searchlistener.next(this.optimizedsearcheventarray);
  }

  refreshDataCurrentCalendarONLYREAD(currentLoginUserId:any){
    this.httpService.getMethod('http://localhost:8081/user/serchUserSchedule?userId='+currentLoginUserId).subscribe(
      (response)=>{
        this.eventarray=response as any[];
        console.log("The Event response in refresh service: ", this.eventarray);
        this.optimizedeventarray = this.eventarray.map(
          (e) => {
            var start = e.start + 'T' + e.startTime;
            var end = e.end + 'T' + e.endTime;
            if (e.privacy == true) {
              //calling api for updating title
              console.log("Schedule Privacy in refresh service : ", e.privacy);
              return {
                resourceId: "1",
                title: e.title,
                start: start,
                end: end,
                color: this.colorization(e.status),
              };
            } else {
              console.log("Schedule Privacy in refresh service :  ", e.privacy);
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
        console.log("Optimized Event Array : ",this.optimizedeventarray);
      }
    );
   //rebinding data back
    this._currentlistener.next(this.optimizedeventarray);

  }

  
  
  refreshDataSearchCalendarONLYREAD(searchUserId:any){
    this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId="+searchUserId).subscribe(
      (response)=>{
        this.searcheventarray=response as any[];
        console.log("The Event response in refresh service: ", this.searcheventarray);
        this.optimizedsearcheventarray = this.searcheventarray.map(
          (e) => {
            var start = e.start + 'T' + e.startTime;
            var end = e.end + 'T' + e.endTime;
            if (e.privacy == true) {
              //calling api for updating title
              console.log("Schedule Privacy in refresh service : ", e.privacy);
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
        console.log("Optimized Search Event Array : ",this.optimizedsearcheventarray);
      }
    );
    //rebinding data back
    this._searchlistener.next(this.optimizedsearcheventarray);
  }

  colorization(status: string) {
    return status == 'ongoing' ? '#1B98E080' : 'gray';
  }

  async refreshTitleAndDescription(scheduleId:any){
  let result=await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/eventDetails?scheduleId="+scheduleId));
  console.log("Event for Title and Description : ",result);
  let title:string,description:string;
  let obj=result.map(
    (data)=>{
      return{
        title:data.title,
      description:data.description
      }
    }
  );
  //rebinding data back
  this._titleAndDescriptionlistener.next(obj);
  }

  async refreshAttendee(scheduleId:any){
    let result: any = await firstValueFrom(this.httpService.getMethod("http://localhost:8081/user/serchMeetingSchedule?scheduleId=" + scheduleId));
    console.log("Attendee Host on refresh Api: ", result);
    return this._attendeelistener.next(result);
  }

}
