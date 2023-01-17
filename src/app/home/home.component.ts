import { Component, OnInit } from "@angular/core";
import { CalendarOptions } from "@fullcalendar/core"; // useful for typechecking
import dayGridPlugin from "@fullcalendar/daygrid";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: "dayGridMonth",
    weekends: false,
    events: [{ start: new Date() }],
  };

  constructor(private scheduleService: ScheduleService) {}
  ngOnInit() {
    this.saveDepartment();
  }

  onSubmit() {
    this.saveDepartment();
  }

  department!: any;
  saveDepartment() {
    this.scheduleService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
        // console.log(this.department);
      },
      error: (e) => console.log(e),
    });
  }

  testForm() {}
}
