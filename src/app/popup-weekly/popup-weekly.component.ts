import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { DataShareService } from 'services/data-share.service';
import { DownloadService } from 'services/download.service';
import { HttpServiceService } from 'services/http-service.service';
import { ScheduleService } from 'services/schedule.service';

@Component({
  selector: 'app-popup-weekly',
  templateUrl: './popup-weekly.component.html',
  styleUrls: ['./popup-weekly.component.scss']
})
export class PopupWeeklyComponent implements OnInit {
  currentLoginUserId:any;
  userId:any;
  scheduleId:any;
  title:any;
  description:any;
  start:any;
  start_time:any;
  approximated_end_time:any;
  attendees:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  private dialogView:MatDialog,
  private httpService:HttpServiceService,
  private http:HttpClient,
  private sanitizer:DomSanitizer,
  private downloads: DownloadService,
  private scheduleService:ScheduleService,
  private dataShare:DataShareService,
  ) { console.log("Dialog Data : ",data);}
  ngOnInit(): void {
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
  }

}
