import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,Inject, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';
// import * as e from 'express';
import { Member } from 'models/member';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { DataShareService } from 'services/data-share.service';
import { Download } from 'services/download';
import { DownloadService } from 'services/download.service';
import { HttpServiceService } from 'services/http-service.service';
import { ScheduleService } from 'services/schedule.service';
import Swal from "sweetalert2";

// import { RemoveUserPopUpComponent } from "../remove-user-pop-up/remove-user-pop-up.component";

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class PopupModalComponent implements OnInit,OnChanges {
currentLoginUserId:any;
userId:any;
scheduleId:any;
title='';
description='';
attendees:any;
start='';
start_time='';
approximated_end_time='';
scheduleIdHost:any;
scheduleIdUpdateDelete:any;
isLoginUser:boolean=false;
searchText:string;
isOpen:boolean=false;
optimizedSearchFiltering:any;
searchUserId:any;
responseStaff:any;
ownerId:any;
isAppoint:boolean=false;
changeOwner={};
reAssignUserId:any;
attendeeApoint:any;
memberArrayay :any;
membersList: any = [];
name:string='';
filedata:any;
download$!: Observable<Download>
fileDownloadHost:any;
fileDownload:any;
downloadURL:any;
downloadMaterial={name:'',url:''};
image:any;
fileURL:any;
fileId:any;
fileIdHost:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private dialogView:MatDialog,
  private httpService:HttpServiceService,
  private http:HttpClient,
  private sanitizer:DomSanitizer,
  private downloads: DownloadService,
  private scheduleService:ScheduleService,
  @Inject(DOCUMENT) private document: Document,
  private dataShare:DataShareService
  ) { console.log("Dialog Data : ",data);}
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit(): void {
    this.saveMember();
    console.log("datum dialog");
    //get Logined userId
    this.currentLoginUserId=JSON.parse(localStorage.getItem("id"));
    console.log("Current Logined User ID : ",this.currentLoginUserId);
    this.data.map(
      async (d:any) => {
       this.userId=d.userId;
       this.scheduleId=d.scheduleId;
       this.title=d.title;
       this.description=d.description;
       this.start=d.startDate;
       this.start_time=d.start;
       this.approximated_end_time=d.end;
       this.attendees=d.attendees;
      }
     );
     console.log("User Id : ",this.userId);

     this.httpService.getMethod('http://localhost:8081/file/getAllScheduleFiles?scheduleId='+this.scheduleId).subscribe(
      (response)=>{
        this.fileIdHost=response;
        console.log("FileID Host : ",this.fileIdHost);
        this.fileIdHost.map(
          (data)=>{
            this.fileId=data.fileId;
            console.log("File ID : ",this.fileId);
          }
        );
      }
     );

     this.httpService.getMethod('http://localhost:8081/file/all?fileId='+this.fileId).subscribe(
      (response)=>{
        this.fileDownloadHost=response;
        console.log("File Response : ",this.fileDownloadHost);

        this.fileDownloadHost.map(
          (datum)=>{
            this.name=datum.name;
            console.log("File Name : ",this.name);
            this.fileURL=datum.url;
            console.log('URL : ',this.fileURL);
          
            // this.downloadURL = window.URL.createObjectURL(new Blob(this.data));
            // console.log("Download URL : ",this.downloadURL);
            
            this.downloadMaterial.name=this.name;
            this.downloadMaterial.url=this.fileURL;

            console.log('Download Material : ',this.downloadMaterial);
          }
        );

      }
     );


     //get scheduleId for delete and update
     this.httpService.getMethod("http://localhost:8081/user/serchUserSchedule?userId="+this.userId).subscribe(
  async (response)=>{
   this.scheduleIdHost=response;
    console.log("Schedule Id Host : ",this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data)=>{
        this.scheduleIdUpdateDelete=data.scheduleId;
        console.log("Schedule Id : ",this.scheduleIdUpdateDelete);
      }
    );
  }
);

     if(this.userId==this.currentLoginUserId){
      console.log("Login ID : ",this.currentLoginUserId);
      console.log("Owner ID : ",this.userId);
      console.log("Current User Id is the same with attendee Id .");
      this.isLoginUser=true;
     }else{
      console.log("Login ID : ",this.currentLoginUserId);
      console.log("Owner ID : ",this.userId);
      console.log("Current User Id is not the same with attendee Id .");
      this.isLoginUser=false;
     }

     //
     this.httpService.getMethod('http://localhost:8081/user/serchUsesDetails').subscribe(
      async (response) => {
        this.responseStaff = response as any[];
        console.log("Search Response Staff : ",this.responseStaff);
        this.optimizedSearchFiltering = this.responseStaff.map((e) => {
          return {
            userId: e.userId,
            username: e.uname,
            departmentname: e.departmentName,
            userImage: e.imageData
          };
        });
        
        for (let e of this.optimizedSearchFiltering) {
          e.userImage =await this.imageResolver(e.userImage);//await this.imageResolver(e.userImage);
        
        }
        },
      (error) => { console.log(error); }
    );
  }

  deletion(){
  const obj={
    scheduleId:this.scheduleId,
    currentUserId:this.currentLoginUserId,
    ownerId:this.userId,
    isDelete:true
  }
   this.http.put<any>('http://localhost:8081/schedule/deleteSchedule',obj).subscribe(
    (result)=>{
      console.log("Delete Schedule Message : ",result);
    }
   );
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Removed.',
          'Member has been removed.',
          'success'
        )
      }
    });
  }

  reAssign(id:any){
    // this.reAssignUserId=id;
    this.changeOwner={
      scheduleId:this.scheduleId,
      currentUserId:this.currentLoginUserId,
      userId:this.searchUserId,
     };
  console.log("Optimized ChangeOwner : ",this.changeOwner);
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to appointment this.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Re-appoint'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.isAppoint=true;
        this.http.put<any>('http://localhost:8081/schedule/changeOwner',this.changeOwner).subscribe(
           (result)=>{
             console.log("Reassignment message : ",result);
           }
         );
        Swal.fire(
          'Appointment.',
          'Member has been appointed.',
          'success'
        );
        
      }
    });
  }
  
  remove(id:any){
  const obj={
    scheduleId:this.scheduleId,
    currentUserId:this.currentLoginUserId,
    userId:id,
    ownerId:this.userId,
  }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to remove the attendee.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Remove the Attendee map: ",obj);
   this.http.put<any>("http://localhost:8081/schedule/removeUser",obj).subscribe(
    (result)=>{
      console.log("Attendee deletion message: ",result);
     }
   );
        Swal.fire(
          'Removed!',
          'Member has been removed.',
          'success'
        )
      }
    });
  }

  finish(){
    //pending with boolean and scheduleId,userId
    console.log("Finish");
    this.dataShare.changeIsUpdateMessage(true);
    this.dataShare.changeScheduleIdChangerMessage(this.scheduleId);
    this.dataShare.changeCreatorIdChangerMessage(this.userId);
    
    const obj={
      scheduleId:this.scheduleId,
      currentUserId:this.currentLoginUserId
    };
    Swal.fire({
      title: 'Event',
      text: "Has an Event been finished ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Model for finish Schedule : ",obj);
    
        this.http.put<any>('http://localhost:8081/schedule/finishSchedule',obj).subscribe(
      (result)=>{
        console.log('Finished Schedule : ',result);
      }
    );
    // window.setInterval(
    //   ()=>{
        Swal.fire(
          'Event',
          'Event has been finished.',
          'success'
        );
    //   },5000
    // );
      }
    });
  }

  appoint() {
    console.log("Search Show .");
    console.log("Search User Name : ",this.searchText);
    console.log("Search User ID : ",this.searchUserId);
    console.log("All Attendee before added : ",this.attendees);
//     let add_Attendee =this.memberArrayay.filter((item)=>item.userId==this.searchUserId);
    
// console.log("A Member is added : ",add_Attendee);
// this.membersList.push(add_Attendee);
// console.log("Attendees to Appoint : ",this.membersList);

const obj={
  scheduleId:this.scheduleId,
  addUserId:this.searchUserId,
  ownerId:this.userId,
  currentUserId:this.currentLoginUserId,
  membersList:this.membersList
 }
 Swal.fire({
  title: 'Are you sure?',
  text: "You want to add the attendee.",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Add'
}).then((result) => {
  if (result.isConfirmed) {
    console.log("Add the Attendee Model: ",obj);

    this.http.put<any>('http://localhost:8081/schedule/addMembers',obj).subscribe(
      (result)=>{
        console.log('Add Member Message',result);
      }
    );

    console.log("is Appoint 1 : ",this.isAppoint);
        this.isAppoint=!this.isAppoint;
        console.log("is Appoint 1 : ",this.isAppoint);
        this.searchText='';
  }
});
  }
  getUsername(staff:any){
    if (this.isOpen == true) {
      this.searchText = staff.username;
      this.searchUserId = staff.userId;
      console.log("search User Id : ", this.searchUserId);
      console.log("Search User Name : ", this.searchText);
    this.isOpen=!this.isOpen;  
  }
}
imageResolver(byte: any[]) {
  return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + byte);
}

//member-db
saveMember() {
  this.scheduleService.getMemberList().subscribe({
    next: (data) => {
      this.memberArrayay = data;
      console.log(this.memberArrayay);
    },
    error: (e) => console.log(e),
  });
}

addMember(){
 this.isAppoint=true;
 console.log("Search Filtering Array(Original) : ",this.optimizedSearchFiltering);
 console.log('All Member Lists : ',this.memberArrayay);
for(let e of this.attendees){
  let attendeeId=e.userId;
  console.log('Filtered Attendees ID : ',attendeeId);
  this.optimizedSearchFiltering=this.optimizedSearchFiltering.filter((item)=>item.userId!=attendeeId);
  for (let i = 0; i < this.memberArrayay.length; i++) {
    for (let j=0; j< this.attendees.length; j++) {
      if (this.memberArrayay[i].userId == this.attendees[j].userId) {
        this.membersList.push(this.memberArrayay[i]);
        this.memberArrayay[i].userId = 0;
      }
      
    }
  
   }
}
console.log("Optimized Search Filtering Array Without Attendees : ",this.optimizedSearchFiltering);

console.log("Filtered Member List : ",this.membersList);
}
 

download({name, url}: {name: string, url: string}) {
  this.download$ = this.downloads.download(url, name);
}

// downloadRoutering(){
//   let response:any=firstValueFrom(this.httpService.getMethod('http://localhost:8081/file/getAllScheduleFiles?scheduleId='+this.scheduleId));
//   console.log('Download Response : ',response);
//   response.map(
//     (data)=>{
//       this.slides.name=data.name;
//       this.slides.url=data.url;
//       console.log("Files for schedule : ",this.slides);
//     }
//   );
// }

upload({name, url}: {name: string, url: string}){
  
}


}
