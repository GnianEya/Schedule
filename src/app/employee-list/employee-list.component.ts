import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Employee } from "models/employee";
import { Team } from "models/team";
import { EmployeeService } from "services/employee.service";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.scss"],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[];
  check = false;
  constructor(
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.employees = [];
  }
  ngOnInit(): void {
    this.saveTeam();
    this.saveEmployee();
  }

  saveEmployee() {
    this.employeeService.getEmployeeList().subscribe({
      next: (data) => {
        this.employees = data;
        if (this.employees.length != 0) {
          this.check = true;
        }
      },
      error: (e) => console.log(e),
    });
  }

  updateEmployee(employeeId: string) {
    this.router.navigate(["updateEmployee", employeeId]);
  }

  deleteEmployee(employeeId: number) {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (data) => {
        console.log(data);
        this.saveEmployee();
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
