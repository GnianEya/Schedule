import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "models/member";
import { Schedule } from "models/schedule";
import { ScheduleService } from "services/schedule.service";
import { UserCrudService } from "services/user-crud.service";
import { Department } from "models/department";
import { Team } from "models/team";
import { NgToastService } from "ng-angular-popup";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  result: string = "";

  currentDate: any = new Date();
  selectStartDate: any;

  selectEndDate: any;
  start: any;
  end: any;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.department = [];
    this.teamArr = [];
    this.team = [];
    this.memberArr = [];
    this.member = [];
    this.scheduleArr = [];
  }

  department: Department[];
  teamArr: Team[];
  team: Team[];

  memberArr: Member[];
  member: Member[];

  scheduleArr: Schedule[];

  ngOnInit() {
    // this.department = this.userCrudService.department();
    // this.pastDate();

    this.saveDepartment();
    this.saveTeam();
    this.saveMember();
    this.saveSchedule();

    this.scheduleForm = this.fb.group({
      start: new FormControl(null, [Validators.required]),
      end: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      privacy: new FormControl(null, [Validators.required]),
    });
  }

  saveDepartment() {
    this.scheduleService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
        // console.log(this.department);
      },
      error: (e) => console.log(e),
    });
  }

  saveTeam() {
    this.scheduleService.getTeamList().subscribe({
      next: (data) => {
        this.teamArr = data;
        // console.log(this.teamArr);
      },
      error: (e) => console.log(e),
    });
  }

  saveMember() {
    this.scheduleService.getUserList().subscribe({
      next: (data) => {
        this.memberArr = data;
        console.log(this.memberArr);
      },
      error: (e) => console.log(e),
    });
  }

  saveSchedule() {
    this.scheduleService.getScheduleList().subscribe({
      next: (data: any) => {
        this.scheduleArr = data;
        console.log(this.scheduleArr);
      },
      error: (e) => console.log(e),
    });
  }

  //date

  onChangeStart(e: any) {
    this.selectStartDate = new Date(e);

    // var weekend = this.selectStartDate.getDay();
    // if (weekend === 0 || weekend === 6) {
    //   this.weekend = true;
    // }

    var startDay = this.selectStartDate.getDate();
    if (startDay < 10) {
      startDay = "0" + startDay;
    }
    var startMonth = this.selectStartDate.getMonth() + 1;
    if (startMonth < 10) {
      startMonth = "0" + startMonth;
    }
    var startYear = this.selectStartDate.getFullYear();
    this.start = startYear + "-" + startMonth + "-" + startDay;
  }

  onChangeEnd(dateValue: any) {
    this.selectEndDate = new Date(dateValue);
    var endDay = this.selectEndDate.getDate();
    if (endDay < 10) {
      endDay = "0" + endDay;
    }
    var endMonth = this.selectEndDate.getMonth() + 1;
    if (endMonth < 10) {
      endMonth = "0" + endMonth;
    }
    var endYear = this.selectEndDate.getFullYear();
    this.end = endYear + "-" + endMonth + "-" + endDay;
  }

  startHour: any = [
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
  ];
  startTimeHour: number;
  onSelectStartHour(e: any) {
    this.startTimeHour = e.target.value;
  }
  endTimeHour: number;
  onSelectEndHour(e: any) {
    this.endTimeHour = e.target.value;
  }

  startMin: any = ["00", "15", "30", "45"];
  startTimeMin: number;
  onSelectStartMin(e: any) {
    this.startTimeMin = e.target.value;
  }
  endTimeMin: number;
  onSelectEndMin(e: any) {
    this.endTimeMin = e.target.value;
  }

  //time-varify
  // time disable -start
  current: any;
  shouldDisableHour(startHours: number): boolean {
    var currentDay: any = new Date().getDate();
    if (currentDay < 10) {
      currentDay = "0" + currentDay;
    }
    var currentMonth: any = new Date().getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = "0" + currentMonth;
    }
    var currentYear: any = new Date().getFullYear();
    this.current = currentYear + "-" + currentMonth + "-" + currentDay;

    const currentHour = new Date().getHours();
    return this.current === this.start && startHours < currentHour;
  }

  shouldDisableMinute(startMins: number): boolean {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    return currentHour == this.startTimeHour && startMins < currentMinute;
  }

  //time disable - end
  shouldDisableHourEnd(startHours: number): boolean {
    return startHours < this.startTimeHour;
  }

  shouldDisableMinEnd(startMins: number): boolean {
    if (this.startTimeHour == this.endTimeHour) {
      return startMins <= this.startTimeMin;
    }
  }

  //attendes
  //team
  onSelect(department) {
    this.team = this.teamArr.filter(
      (e) => e.departmentId == department.target.value
    );
  }

  //member
  onSelect1(team) {
    this.member = this.memberArr.filter((e) => e.team == team.target.value);
  }

  // first-select
  multiselected: any = [];
  preselectedMember: Member = new Member();
  onSelect2(member) {
    this.multiselected = this.memberArr.filter(
      (e) => e.userId == member.target.value
    );

    this.preselectedMember = this.multiselected[0];
  }

  //add member list
  preselected: any[] = [];
  shifting() {
    this.preselected.push(this.preselectedMember); // duplicated members
    this.preselected = Array.from(new Set(this.preselected)); //clear duplicate key
  }

  //select-to-remove
  removedmember: any;
  removed: any;
  onSelect3(member) {
    this.removedmember = this.memberArr.filter(
      (e) => e.userId == member.target.value
    );
    this.removed = this.removedmember[0];
    // console.log(this.removed);
  }

  filterDate: any = [];

  //remove
  un_shifting() {
    const index = this.preselected.indexOf(this.removed);

    const idx = this.uniqueArr.indexOf(this.removed);
    console.log(index + " space " + idx);
    this.preselected.splice(index, 1);
    this.uniqueArr.splice(idx, 1);

    console.log("after un-shifted");
    console.log(this.preselected);
  }

  //check-available
  checkArr: any = [];
  uniqueArr: any = [];

  checkAvailable() {
    var multiselectedUser: any = [];
    this.checkArr = this.preselected;

    console.log(this.preselected);

    for (let i = 0; i < this.checkArr.length; i++) {
      for (let j = 0; j < this.scheduleArr.length; j++) {
        if (this.checkArr[i].userId == this.scheduleArr[j].userId) {
          multiselectedUser.push(this.scheduleArr[j]);
        }
      }
    }
    console.log("down, selected user's schedule");
    console.log(multiselectedUser);

    var newStart = new Date(this.start).toUTCString();
    var newEnd = new Date(this.end).toUTCString();
    var NewStartTimeHour = this.startTimeMin / 60 + +this.startTimeHour;
    var NewEndTimeHour = this.endTimeMin / 60 + +this.endTimeHour;
    var unavailableArr: Schedule[] = [];
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
        oldStartTimeHour < NewEndTimeHour && NewEndTimeHour < oldEndTimeHour,
        NewStartTimeHour < oldStartTimeHour &&
          oldStartTimeHour < NewEndTimeHour,
        NewStartTimeHour < oldEndTimeHour && oldEndTimeHour < NewStartTimeHour
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
          unavailableArr.push(multiselectedUser[i]);

          let userIds = new Set();
          this.uniqueArr = unavailableArr.filter((obj) => {
            if (!userIds.has(obj.userId)) {
              userIds.add(obj.userId);
              return true;
            } else {
              return false;
            }
          });
        }
      }
    }
  }
  // removeSelectedUser(index) {
  //   this.unavailableArr.splice(index, 1);
  //   console.log(this.preselected);
  //   this.preselected.splice(index, 1);
  // }

  //unavailable
  removedUser: any;
  removedU: any;
  //select-to-remove
  onSelect4(event: any) {
    this.removedUser = this.uniqueArr.filter(
      (e) => e.userId == event.target.value
    );

    this.removedU = this.removedUser[0];
    console.log(this.removedU);
  }

  checkInvalid() {
    if (this.uniqueArr.length) {
      return true;
    } else {
      return false;
    }
  }
  //file

  errorMessage = "";

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
    this.scheduleService.addFile(this.files, this.schedule.title).subscribe(
      (data: any) => {
        console.log(data);
        console.log("save files method works");
      },
      (error) => {
        console.log(error);
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

  // privacy

  //place
  place!: any;
  onSelectPlace(e: any) {
    this.place = e.target.value;
  }
  //form-submit

  schedule: Schedule = new Schedule();
  onSubmit() {
    this.schedule.start = this.start;
    this.schedule.end = this.end;
    this.schedule.start_time = this.startTimeHour + ":" + this.startTimeMin;
    this.schedule.end_time = this.endTimeHour + ":" + this.endTimeMin;
    this.schedule.membersList = this.preselected;
    this.schedule.schduleFile = this.files;
    this.schedule.place = this.place;
    this.schedule.createUser = JSON.parse(localStorage.getItem("id"));
    this.addSchedule();
    this.saveFiles();
    console.log(this.files);
    console.log(this.schedule);
  }

  scheduleForm!: FormGroup;
  submitted: boolean = false;
  schTitle: any;
  addSchedule() {
    this.scheduleService.addSchedule(this.schedule).subscribe(
      (data: any) => {
        this.toast.success({
          detail: "Success Message",
          summary: "Successfully registered.",
          duration: 5000,
        });
        console.log(data);
      },
      (error) => {
        this.toast.error({
          detail: "Error Message",
          summary: "Appointment Failed : Invalid data",
          duration: 5000,
        });
        console.log(error);
      }
    );
  }
}
