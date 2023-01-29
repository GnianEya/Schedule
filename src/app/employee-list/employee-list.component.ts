import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Department } from "models/department";
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
  employees: Employee[] = [];
  check = false;
  dataSource!: MatTableDataSource<Employee>;
  displayedColumns: string[] = [
    "ID",
    "Name",
    "Department(Team)",
    "Position",
    "Action",
  ];

  constructor(
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.saveDepartment();
    this.saveTeam();
    this.saveEmployee();
  }

  saveEmployee() {
    this.employeeService.getEmployeeDataList().subscribe({
      next: (data) => {
        this.employees = data;
        if (this.employees.length != 0) {
          this.check = true;
        }
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.dataSource.paginator = this.paginator;
      },
      error: (e) => console.log(e),
    });
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  // @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
  //   this.dataSource.paginator = paginator;
  // }

  // updateEmployee(employeeId: string) {
  //   this.router.navigate(["updateEmployee", employeeId]);
  // }

  deleteEmployee(employeeId: number) {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (data) => {
        //    console.log(data);
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
        //       console.log(this.team);
      },
      error: (e) => console.log(e),
    });
  }

  department: Department[];
  saveDepartment() {
    this.scheduleService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
        // console.log(this.department);
      },
      error: (e) => console.log(e),
    });
  }

  searchFilter(e: any) {
    console.log("search", e.target.value);
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }
}
