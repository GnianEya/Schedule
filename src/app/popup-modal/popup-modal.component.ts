import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { HttpServiceService } from 'services/http-service.service';
import Swal from "sweetalert2";

// import { RemoveUserPopUpComponent } from "../remove-user-pop-up/remove-user-pop-up.component";

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class PopupModalComponent implements OnInit {
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
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private dialogView:MatDialog,
  private httpService:HttpServiceService,
  private http:HttpClient,
  private sanitizer:DomSanitizer
  ) { console.log("Dialog Data : ",data);}

  ngOnInit(): void {
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
     //get scheduleId for delete and update
     this.httpService.getMethod("http://localhost:8081/user/eventDetails?userId="+this.userId+"&title="+this.title+"&start="+this.start+"&starttime="+this.start_time).subscribe(
  async (response)=>{
   this.scheduleIdHost=response;
    console.log("Schedule Id Host : ",this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data)=>{
        this.scheduleIdUpdateDelete=data.id;
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

     this.httpService.getMethod('http://localhost:8081/user/serchUsesDetails').subscribe(
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
      },
      (error) => { console.log(error); }
    );
  }

  deletion(){
    let map=new Map<any,any>();
   map.set("scheduleId",this.scheduleId);
   map.set("currentUserId",this.currentLoginUserId);
   map.set("userId",''); //no processing in userId
   map.set("ownerId",this.userId);
   map.set("isDelete",true);
   console.log("Delete Schedule map: ",map);
   this.http.delete<any>('').subscribe(
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
   this.changeOwner={
    scheduleId:this.scheduleId,
    currentUserId:this.currentLoginUserId,
    userId:id,
    ownerId:this.ownerId,
    isDelete:false
   };
   console.log("change Owner Object : ",this.changeOwner);
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
        this.isAppoint=true;
        
      }
    });
  }
  
  remove(id:any){
    let map=new Map<any,any>();
   map.set("scheduleId",this.scheduleId);
   map.set("currentUserId",this.currentLoginUserId);
   map.set("userId",id);
   map.set("ownerId",this.userId);
   map.set("isDelete",true);
   console.log("Remove the Attendee map: ",map);
   this.http.delete<any>("http://localhost:8081/schedule/removeUser").subscribe(
    (result)=>{
      console.log("Attendee deletion message: ",result);
    }
   );
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
        Swal.fire(
          'Removed!',
          'Member has been removed.',
          'success'
        )
      }
    });
  }

  Updatation(){
    //pending with boolean and scheduleId,userId
  }

  appoint() {
    console.log("Search Show .");
    for(let item of Object.keys(this.changeOwner)) {
      if(this.changeOwner[item] =='ownerId') {
          this.changeOwner[item] = this.searchUserId;
          console.log("Appointed ID : ",this.searchUserId);
          console.log("Owner ID changed to : ",this.changeOwner[item]);
      }
  }
  console.log("Optimized ChangeOner : ",this.changeOwner);
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
    this.isAppoint=!this.isAppoint;
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

}
