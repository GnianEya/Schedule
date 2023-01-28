import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
// import * as e from 'express';
import { Member } from "models/member";
import { Schedule } from "models/schedule";
import { NgToastService } from "ng-angular-popup";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { DataShareService } from "services/data-share.service";
import { Download } from "services/download";
import { DownloadService } from "services/download.service";
import { HttpServiceService } from "services/http-service.service";
import { ScheduleService } from "services/schedule.service";
import Swal from "sweetalert2";

// import { RemoveUserPopUpComponent } from "../remove-user-pop-up/remove-user-pop-up.component";

@Component({
  selector: "app-popup-modal",
  templateUrl: "./popup-modal.component.html",
  styleUrls: ["./popup-modal.component.css"],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class PopupModalComponent implements OnInit, OnChanges {
  currentLoginUserId: any;
  userId: any;
  scheduleId: any;
  title = "";
  description = "";
  attendees: any;
  start = "";
  end = "";
  start_time = "";
  approximated_end_time = "";
  scheduleIdHost: any;
  scheduleIdUpdateDelete: any;
  isLoginUser: boolean = false;
  searchText: string;
  isOpen: boolean = false;
  optimizedSearchFiltering: any;
  searchUserId: any;
  responseStaff: any;
  ownerId: any;
  isAppoint: boolean = false;
  changeOwner = {};
  reAssignUserId: any;
  attendeeApoint: any;
  memberArrayay: any;
  membersList: any = [];
  name: string = "";
  filedata: any;
  download$!: Observable<Download>;
  fileDownloadHost: any;
  fileDownload: any;
  downloadURL: any;
  image: any;
  fileURL: any;
  fileId: any;
  fileIdHost: any;
  fileID: any;
  docname: any;
  doctype: any;
  fileData: any;
  fileRemoveHost: any;
  isAttachmentExist: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogView: MatDialog,
    private httpService: HttpServiceService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private downloads: DownloadService,
    private scheduleService: ScheduleService,
    @Inject(DOCUMENT) private document: Document,
    private dataShare: DataShareService,
    private toast: NgToastService
  ) {
    console.log("Dialog Data : ", data);
  }
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.saveMember();
    this.saveSchedule();
    console.log("datum dialog");
    //get Logined userId
    this.currentLoginUserId = JSON.parse(localStorage.getItem("id"));
    console.log("Current Logined User ID : ", this.currentLoginUserId);
    this.data.map(async (d: any) => {
      this.userId = d.userId;
      this.scheduleId = d.scheduleId;
      this.title = d.title;
      this.description = d.description;
      this.start = d.startDate;
      this.end = d.endDate;
      this.start_time = d.start;
      this.approximated_end_time = d.end;
      this.attendees = d.attendees;
    });
    console.log("User Id : ", this.userId);

    this.httpService
      .getMethod(
        "http://localhost:8081/file/getAllScheduleFiles?scheduleId=" +
          this.scheduleId
      )
      .subscribe((response) => {
        this.fileIdHost = response;
        console.log("FileID Host : ", this.fileIdHost);
        this.fileIdHost.map((datum) => {
          this.fileId = datum.fileId;
          console.log("File ID : ", this.fileId);
          if (this.fileId != undefined || this.fileId != null) {
            this.isAttachmentExist = true;
            console.log("File Attachment exists at " + this.scheduleId);
          } else {
            this.isAttachmentExist = false;
            console.log("File Attachment don't exist at " + this.scheduleId);
          }
          this.name = datum.docName;
          this.fileData = datum.data;
          let docType = datum.docType;
          console.log(
            "Files for schedule : ",
            this.name,
            this.fileData,
            docType
          );
          this.fileURL = window.URL.createObjectURL(
            new Blob([this.fileData], { type: docType })
          );
          console.log("File URL : ", this.fileURL);
        });
      });
    // console.log("this is file ID : ",this.fileId);
    //      this.httpService.getMethod('http://localhost:8081/file/all?fileId='+this.fileId).subscribe(
    //       (response)=>{
    //         this.fileRemoveHost=response;
    //         console.log("File Remove Host : ",this.fileRemoveHost);
    //         this.fileRemoveHost.map(
    //           (datum)=>{
    //             this.fileID=datum.fileId;
    //             this.docname=datum.docName;
    //             this.doctype=datum.docType;
    //             this.fileData=datum.data;
    //             this.fileURL=datum.url;
    //           }
    //         );
    //         console.log("File Remove Data : ",this.fileID,' : ',this.docname,' : ',this.doctype,' : ',this.fileData);
    //         this.downloadMaterial.name=this.docname;
    //         this.downloadMaterial.url=this.fileURL;
    //         console.log("Download Material : ",this.downloadMaterial);
    //       }
    //      );
    // let response:any=firstValueFrom(this.httpService.getMethod('http://localhost:8081/file/getAllScheduleFiles?scheduleId='+this.scheduleId));
    //   console.log('Download Response : ',response);
    //   response.map(
    //     (data)=>{
    //       this.slides.name=data.name;
    //       this.slides.url=data.url;
    //       console.log("Files for schedule : ",this.slides);
    //     }
    //   );

    //  this.httpService.getMethod('http://localhost:8081/file/all?fileId='+this.fileId).subscribe(
    //   (response)=>{
    //     this.fileDownloadHost=response;
    //     console.log("File Response : ",this.fileDownloadHost);

    //     this.fileDownloadHost.map(
    //       (datum)=>{
    //         this.name=datum.name;
    //         console.log("File Name : ",this.name);
    //         this.fileURL=datum.url;
    //         console.log('URL : ',this.fileURL);

    //         // this.downloadURL = window.URL.createObjectURL(new Blob(this.data));
    //         // console.log("Download URL : ",this.downloadURL);

    //         this.downloadMaterial.name=this.name;
    //         this.downloadMaterial.url=this.fileURL;

    //         console.log('Download Material : ',this.downloadMaterial);
    //       }
    //     );

    //   }
    //  );

    //get scheduleId for delete and update
    this.httpService
      .getMethod(
        "http://localhost:8081/user/serchUserSchedule?userId=" + this.userId
      )
      .subscribe(async (response) => {
        this.scheduleIdHost = response;
        console.log("Schedule Id Host : ", this.scheduleIdHost);
        this.scheduleIdHost.map((data) => {
          this.scheduleIdUpdateDelete = data.scheduleId;
          console.log("Schedule Id : ", this.scheduleIdUpdateDelete);
        });
      });

    if (this.userId == this.currentLoginUserId) {
      console.log("Login ID : ", this.currentLoginUserId);
      console.log("Owner ID : ", this.userId);
      console.log("Current User Id is the same with attendee Id .");
      this.isLoginUser = true;
    } else {
      console.log("Login ID : ", this.currentLoginUserId);
      console.log("Owner ID : ", this.userId);
      console.log("Current User Id is not the same with attendee Id .");
      this.isLoginUser = false;
    }

    //
    this.httpService
      .getMethod("http://localhost:8081/user/serchUsesDetails")
      .subscribe(
        async (response) => {
          this.responseStaff = response as any[];
          console.log("Search Response Staff : ", this.responseStaff);
          this.optimizedSearchFiltering = this.responseStaff.map((e) => {
            return {
              userId: e.userId,
              username: e.uname,
              departmentname: e.departmentName,
              userImage: e.imageData,
            };
          });

          for (let e of this.optimizedSearchFiltering) {
            e.userImage = await this.imageResolver(e.userImage); //await this.imageResolver(e.userImage);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deletion() {
    const obj = {
      scheduleId: this.scheduleId,
      currentUserId: this.currentLoginUserId,
      ownerId: this.userId,
      isDelete: true,
    };
    this.http
      .put<any>("http://localhost:8081/schedule/deleteSchedule", obj)
      .subscribe((result) => {
        console.log("Delete Schedule Message : ", result);
      });
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Removed.", "Member has been removed.", "success");
      }
    });
  }

  reAssign(id: any) {
    // this.reAssignUserId=id;
    this.changeOwner = {
      scheduleId: this.scheduleId,
      currentUserId: this.currentLoginUserId,
      userId: this.userId,
    };
    console.log("Optimized ChangeOwner : ", this.changeOwner);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to appointment this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Re-appoint",
    }).then((result) => {
      if (result.isConfirmed) {
        // this.isAppoint=true;
        this.http
          .put<any>(
            "http://localhost:8081/schedule/changeOwner",
            this.changeOwner
          )
          .subscribe((result) => {
            console.log("Reassignment message : ", result);
          });
        Swal.fire("Appointment.", "Member has been appointed.", "success");
      }
    });
  }

  remove(id: any) {
    const obj = {
      scheduleId: this.scheduleId,
      currentUserId: this.currentLoginUserId,
      userId: id,
      ownerId: this.userId,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove the attendee.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Remove the Attendee map: ", obj);
        this.http
          .put<any>("http://localhost:8081/schedule/removeUser", obj)
          .subscribe((result) => {
            console.log("Attendee deletion message: ", result);
          });
        Swal.fire("Removed!", "Member has been removed.", "success");
      }
    });
  }

  finish() {
    //pending with boolean and scheduleId,userId
    console.log("Finish");
    this.dataShare.changeIsUpdateMessage(true);
    this.dataShare.changeScheduleIdChangerMessage(this.scheduleId);
    this.dataShare.changeCreatorIdChangerMessage(this.userId);

    const obj = {
      scheduleId: this.scheduleId,
      currentUserId: this.currentLoginUserId,
    };
    Swal.fire({
      title: "Event",
      text: "Has an Event been finished ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Model for finish Schedule : ", obj);

        this.http
          .put<any>("http://localhost:8081/schedule/finishSchedule", obj)
          .subscribe((result) => {
            console.log("Finished Schedule : ", result);
          });
        // window.setInterval(
        //   ()=>{
        Swal.fire("Event", "Event has been finished.", "success");
        //   },5000
        // );
      }
    });
  }

  //available
  //all-schedule-data (scheduleArr)
  scheduleArr: Schedule[];
  saveSchedule() {
    this.scheduleService.getScheduleList().subscribe({
      next: (data: any) => {
        this.scheduleArr = data;
        console.log(this.scheduleArr);
      },
      error: (e) => console.log(e),
    });
  }

  // fetch-added-member (addedMember)

  // memberArr: Member[] = [];
  preselectedMember: Member = new Member();

  //check-available
  uniqueArr: Schedule[] = [];

  // checkAvailable() {
  //   var multiselectedUser: any = [];

  //   console.log("new member added", this.addedMember);

  //   for (let j = 0; j < this.scheduleArr.length; j++) {
  //     if (this.addedMember.userId == this.scheduleArr[j].userId) {
  //       multiselectedUser.push(this.scheduleArr[j]);
  //     }
  //   }

  //   console.log("down, added member's schedule");
  //   console.log(multiselectedUser);

  //   var newStart = new Date(this.start).toUTCString();
  //   var newEnd = new Date(this.end).toUTCString();
  //   var newStartTime = this.start_time;
  //   var newStartHour: any = newStartTime.slice(0, 2);
  //   var newStartMinute: any = newStartTime.slice(3, 5);
  //   var NewStartTimeHour = newStartMinute / 60 + +newStartHour;

  //   var newEndTime = this.approximated_end_time;
  //   var newEndHour: any = newStartTime.slice(0, 2);
  //   var newEndMinute: any = newStartTime.slice(3, 5);
  //   var NewEndTimeHour = newEndMinute / 60 + +newEndHour;

  //   var unavailableMember: Schedule[] = [];
  //   for (let i = 0; i < multiselectedUser.length; i++) {
  //     var oldStart = new Date(multiselectedUser[i].start).toUTCString();
  //     var oldEnd = new Date(multiselectedUser[i].end).toUTCString();
  //     var oldStartTime = multiselectedUser[i].start_time;
  //     var oldStartHour: number = oldStartTime.slice(0, 2);
  //     var oldStartMinute: number = oldStartTime.slice(3, 5);
  //     var oldStartTimeHour = oldStartMinute / 60 + +oldStartHour;

  //     var oldEndTime = multiselectedUser[i].end_time;
  //     var oldEndHour: number = oldEndTime.slice(0, 2);
  //     var oldEndMinute: number = oldEndTime.slice(3, 5);
  //     var oldEndTimeHour = oldEndMinute / 60 + +oldEndHour;

  //     console.log("old", oldStartTimeHour, oldEndTimeHour);
  //     console.log("new", NewStartTimeHour, NewEndTimeHour);
  //     console.log(
  //       "condition",
  //       newStart == oldStart,
  //       newEnd == oldStart,
  //       newStart > oldStart && newStart < oldEnd
  //     );
  //     console.log(
  //       "condition day",
  //       newStart == oldStart ||
  //         newEnd == oldStart ||
  //         (newStart > oldStart && newStart < oldEnd)
  //     );
  //     console.log(
  //       "condition time",
  //       (oldStartTimeHour < NewStartTimeHour &&
  //         NewStartTimeHour < oldEndTimeHour) ||
  //         (oldStartTimeHour < NewEndTimeHour &&
  //           NewEndTimeHour < oldEndTimeHour) ||
  //         (NewStartTimeHour < oldStartTimeHour &&
  //           oldStartTimeHour < NewEndTimeHour) ||
  //         (NewStartTimeHour < oldEndTimeHour &&
  //           oldEndTimeHour < NewStartTimeHour)
  //     );

  //     console.log(
  //       "time",
  //       oldStartTimeHour < NewStartTimeHour &&
  //         NewStartTimeHour < oldEndTimeHour,
  //       oldStartTimeHour < NewEndTimeHour && NewEndTimeHour < oldEndTimeHour,
  //       NewStartTimeHour < oldStartTimeHour &&
  //         oldStartTimeHour < NewEndTimeHour,
  //       NewStartTimeHour < oldEndTimeHour && oldEndTimeHour < NewStartTimeHour
  //     );
  //     if (
  //       newStart == oldStart ||
  //       newEnd == oldStart ||
  //       (newStart > oldStart && newStart < oldEnd)
  //     ) {
  //       if (
  //         (oldStartTimeHour < NewStartTimeHour &&
  //           NewStartTimeHour < oldEndTimeHour) ||
  //         (oldStartTimeHour < NewEndTimeHour &&
  //           NewEndTimeHour < oldEndTimeHour) ||
  //         (NewStartTimeHour < oldStartTimeHour &&
  //           oldStartTimeHour < NewEndTimeHour) ||
  //         (NewStartTimeHour < oldEndTimeHour &&
  //           oldEndTimeHour < NewStartTimeHour)
  //       ) {
  //         unavailableMember.push(multiselectedUser[i]);
  //         console.log("unavailable-member-added", unavailableMember);
  //         alert("unavailable member");
  //       }
  //     } else {
  //       alert("added success!");
  //     }
  //   }
  // }
  appoint() {
    var addedMember = this.memberArrayay.filter(
      (e) => e.userId == this.searchUserId
    );
    var newMember = addedMember[0];
    console.log("new member", newMember, "added member", addedMember);
    console.log("Search Show .");
    console.log("Search User Name : ", this.searchText);
    console.log("Search User ID : ", this.searchUserId);
    console.log("All Attendee before added : ", this.attendees);
    //     let add_Attendee =this.memberArrayay.filter((item)=>item.userId==this.searchUserId);

    // console.log("A Member is added : ",add_Attendee);
    // this.membersList.push(add_Attendee);
    // console.log("Attendees to Appoint : ",this.membersList);

    // const obj = {
    //   scheduleId: this.scheduleId,
    //   addUserId: this.searchUserId,
    //   ownerId: this.userId,
    //   currentUserId: this.currentLoginUserId,
    //   membersList: this.membersList,
    // };
    var stringID = newMember.userId;
    var newID = stringID.toString();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to add the attendee.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add",
    }).then((result) => {
      if (result.isConfirmed) {
        var multiselectedUser: any = [];

        console.log("new member added", newMember);
        console.log("new member's Id", newMember.userId, this.searchUserId);
        for (let j = 0; j < this.scheduleArr.length; j++) {
          if (newID == this.scheduleArr[j].userId) {
            multiselectedUser.push(this.scheduleArr[j]);
          }
        }

        console.log("down, new member's schedule");
        console.log(multiselectedUser);

        var newStart = new Date(this.start).toUTCString();
        var newEnd = new Date(this.end).toUTCString();
        var newStartTime = this.start_time;
        var newStartHour: any = newStartTime.slice(0, 2);
        var newStartMinute: any = newStartTime.slice(3, 5);
        var NewStartTimeHour = newStartMinute / 60 + +newStartHour;

        var newEndTime = this.approximated_end_time;
        var newEndHour: any = newEndTime.slice(0, 2);
        var newEndMinute: any = newEndTime.slice(3, 5);
        var NewEndTimeHour = newEndMinute / 60 + +newEndHour;

        var unavailableMember: Schedule[] = [];
        var availableMember: Schedule[] = [];
        for (let i = 0; i < multiselectedUser.length; i++) {
          var oldStart = new Date(multiselectedUser[i].start).toUTCString();
          var oldEnd = new Date(multiselectedUser[i].end).toUTCString();
          var oldStartTime = multiselectedUser[i].start_time;
          var oldStartHour: number = oldStartTime.slice(0, 2);
          var oldStartMinute: number = oldStartTime.slice(3, 5);
          var oldStartTimeHour = oldStartMinute / 60 + +oldStartHour;

          var oldEndTime = multiselectedUser[i].end_time;
          var oldEndHour: number = oldEndTime.slice(0, 2);
          var oldEndMinute: number = oldEndTime.slice(3, 5);
          var oldEndTimeHour = oldEndMinute / 60 + +oldEndHour;

          console.log("old", oldStartTimeHour, oldEndTimeHour);
          console.log("new", NewStartTimeHour, NewEndTimeHour);
          console.log(
            "condition",
            newStart == oldStart,
            newEnd == oldStart,
            newStart > oldStart && newStart < oldEnd
          );
          console.log(
            "condition day",
            newStart == oldStart ||
              newEnd == oldStart ||
              (newStart > oldStart && newStart < oldEnd)
          );
          console.log(
            "condition time",
            (oldStartTimeHour < NewStartTimeHour &&
              NewStartTimeHour < oldEndTimeHour) ||
              (oldStartTimeHour < NewEndTimeHour &&
                NewEndTimeHour < oldEndTimeHour) ||
              (NewStartTimeHour < oldStartTimeHour &&
                oldStartTimeHour < NewEndTimeHour) ||
              (NewStartTimeHour < oldEndTimeHour &&
                oldEndTimeHour < NewStartTimeHour)
          );

          console.log(
            "time",
            oldStartTimeHour < NewStartTimeHour &&
              NewStartTimeHour < oldEndTimeHour,
            oldStartTimeHour < NewEndTimeHour &&
              NewEndTimeHour < oldEndTimeHour,
            NewStartTimeHour < oldStartTimeHour &&
              oldStartTimeHour < NewEndTimeHour,
            NewStartTimeHour < oldEndTimeHour &&
              oldEndTimeHour < NewStartTimeHour
          );
          if (
            newStart == oldStart ||
            newEnd == oldStart ||
            (newStart > oldStart && newStart < oldEnd)
          ) {
            if (
              (oldStartTimeHour < NewStartTimeHour &&
                NewStartTimeHour < oldEndTimeHour) ||
              (oldStartTimeHour < NewEndTimeHour &&
                NewEndTimeHour < oldEndTimeHour) ||
              (NewStartTimeHour < oldStartTimeHour &&
                oldStartTimeHour < NewEndTimeHour) ||
              (NewStartTimeHour < oldEndTimeHour &&
                oldEndTimeHour < NewStartTimeHour)
            ) {
              unavailableMember.push(multiselectedUser[i]);
            }
          } else {
            availableMember.push(multiselectedUser[i]);
          }
        }

        console.log(unavailableMember.length, "length", availableMember.length);
        if (unavailableMember.length) {
          console.log("ma arr pr");
          //alert msg
          this.toast.error({
            detail: "Error Message",
            summary: "This user is not available in this timeslot",
            duration: 5000,
          });
        } else {
          console.log("arr tl heyyyy");
          //available sch ko 1 khu htl set  ->  uniqueArr
          let userIds = new Set();
          this.uniqueArr = availableMember.filter((obj) => {
            if (!userIds.has(obj.userId)) {
              userIds.add(obj.userId);
              return true;
            } else {
              return false;
            }
          });

          console.log(this.uniqueArr, "this is available uniqueArr");
          if (this.uniqueArr.length != 0) {
            console.log("this is availabeMember ", availableMember);
            var uniArr = this.uniqueArr[0];
            console.log(
              "added member user ID is ",
              this.uniqueArr,
              uniArr.userId
            );
            console.log(uniArr.userId, this.searchUserId);
            var obj = {
              scheduleId: this.scheduleId,
              addUserId: this.searchUserId,
              ownerId: this.userId,
              currentUserId: this.currentLoginUserId,
              membersList: this.membersList,
            };
            console.log("Add the Attendee Model: ", obj);

            this.http
              .put<any>("http://localhost:8081/schedule/addMembers", obj)
              .subscribe((result) => {
                console.log("Add Member Message", result);
              });
            //alert msg
            this.toast.success({
              detail: "Success Message",
              summary: "Member has been added to your meeting",
              duration: 5000,
            });
          }

          //  alert("added success!"); //true stage
        }
        console.log("is Appoint 1 : ", this.isAppoint);
        this.isAppoint = !this.isAppoint;
        console.log("is Appoint 1 : ", this.isAppoint);
        this.searchText = "";
      }
    });
  }

  getUsername(staff: any) {
    if (this.isOpen == true) {
      this.searchText = staff.username;
      this.searchUserId = staff.userId;
      console.log("search User Id : ", this.searchUserId);
      console.log("Search User Name : ", this.searchText);
      this.isOpen = !this.isOpen;
    }
  }
  imageResolver(byte: any[]) {
    return this.sanitizer.bypassSecurityTrustUrl(
      "data:image/png;base64," + byte
    );
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

  addMember() {
    this.isAppoint = true;
    console.log(
      "Search Filtering Array(Original) : ",
      this.optimizedSearchFiltering
    );
    console.log("All Member Lists : ", this.memberArrayay);
    for (let e of this.attendees) {
      let attendeeId = e.userId;
      console.log("Filtered Attendees ID : ", attendeeId);
      this.optimizedSearchFiltering = this.optimizedSearchFiltering.filter(
        (item) => item.userId != attendeeId
      );
      for (let i = 0; i < this.memberArrayay.length; i++) {
        for (let j = 0; j < this.attendees.length; j++) {
          if (this.memberArrayay[i].userId == this.attendees[j].userId) {
            this.membersList.push(this.memberArrayay[i]);
            //this.memberArrayay[i].userId = 0;
            this.membersList = Array.from(new Set(this.membersList));
          }
        }
      }
    }
    console.log(
      "Optimized Search Filtering Array Without Attendees : ",
      this.optimizedSearchFiltering
    );

    console.log("Filtered Member List : ", this.membersList);
  }

  download(url: string, name: string) {
    //setTimeout(function(){ window.URL.revokeObjectURL(url); }, 3000);
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

  async fileRemove() {
    //to get fileid docname doctype data
    this.fileRemoveHost = await firstValueFrom(
      this.httpService.getMethod(
        "http://localhost:8081/file/getAllScheduleFiles?scheduleId=" +
          this.scheduleId
      )
    );
    console.log("File Remove Host : ", this.fileRemoveHost);
    this.fileRemoveHost.map((datum) => {
      this.fileID = datum.fileId;
      this.docname = datum.docName;
      this.doctype = datum.docType;
      this.fileData = datum.data;
    });
    console.log(
      "File Remove Data : ",
      this.fileID,
      " : ",
      this.docname,
      " : ",
      this.doctype,
      " : ",
      this.fileData
    );
    await this.removeValidated();
  }

  async removeValidated() {
    const obj = {
      fileId: this.fileID,
      docName: this.docname,
      docType: this.doctype,
      data: this.fileData,
      cuurrentUserId: this.currentLoginUserId,
      scheduleId: this.scheduleId,
    };
    console.log("Body : ", obj);
    const options = {
      body: obj,
    };
    //console.log("Options : ",options.body);
    let result = await firstValueFrom(
      this.http.delete<any>(
        "http://localhost:8081/file/deleteFile?fileId=" +
          this.fileId +
          "&scheduleId=" +
          this.scheduleId +
          "&cuurentUserId=" +
          this.currentLoginUserId
      )
    );
    console.log("File Deletion : ", result);
    if (result != null) {
      Swal.fire("Removed", "Attachment has been removed.", "success");
    } else {
      Swal.fire({
        icon: "error",
        title: "Check Your User Information!!",
        text: "Something went wrong!",
      });
    }
  }
  selectFile: File[];
  urls: any = [];
  files: any = [];

  saveFile(e: any) {
    if (e.target.files) {
      this.selectFile = e.target.files;
      // this.fileText = e.target.files[0].name;

      for (var i = 0; i < this.selectFile.length; i++) {
        if (this.selectFile[i].size < 5000000) {
          this.urls.push(this.selectFile[i].name);
          this.files.push(this.selectFile[i]);
          //   console.log(this.files + "\n" + this.urls);
        } else {
          this.toast.error({
            detail: "Error Message",
            summary: "Your attached file is larger than 5MB.",
            duration: 5000,
          });
        }
      }
    }
  }

  saveFiles() {
    this.scheduleService.addFile(this.files, this.title).subscribe(
      (data: any) => {
        console.log(data);
        console.log("save files method works");
      },
      (result) => {
        if (result != null) {
          Swal.fire("File Upload", "Attachment has been uploaded.", "success");
        } else {
          Swal.fire({
            icon: "error",
            title: "Check Your User Information!!",
            text: "Something went wrong!",
          });
        }
      }
    );
  }

  removeSelectedFile(index) {
    this.urls.splice(index, 1);
    this.files.splice(index, 1);
    // console.log("check it out");
    // console.log(this.urls);
    // console.log(this.files);
  }
}
