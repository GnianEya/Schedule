import { Component, OnInit } from "@angular/core";
import { Department } from "models/department";
import { Team } from "models/team";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.scss"],
})
export class DepartmentsComponent implements OnInit {
  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.saveDepartment();
    this.saveTeam();
  }

  //department array
  department: Department[];
  saveDepartment() {
    this.scheduleService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
        console.log(this.department);
      },
      error: (e) => console.log(e),
    });
  }

  // team array
  team: Team[];
  saveTeam() {
    this.scheduleService.getTeamList().subscribe({
      next: (data) => {
        this.team = data;
        console.log(this.team);
      },
      error: (e) => console.log(e),
    });
  }
}
