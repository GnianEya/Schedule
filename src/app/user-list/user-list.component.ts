import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Department } from "models/department";
import { Employee } from "models/employee";
import { Member } from "models/member";
import { Team } from "models/team";
import { EmployeeService } from "services/employee.service";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  member: Member[] = [];
  check = false;
  dataSource!: MatTableDataSource<Member>;
  displayedColumns: string[] = ["ID", "Name", "Mail", "Department(Team)"];

  constructor(
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.saveTeam();
    this.saveUser();
  }

  saveUser() {
    this.scheduleService.getUserList().subscribe({
      next: (data) => {
        this.member = data;
        console.log(this.member);
        if (this.member.length != 0) {
          this.check = true;
        }
        this.dataSource = new MatTableDataSource<Member>(this.member);
        this.dataSource.paginator = this.paginator;
      },
      error: (e) => console.log(e),
    });
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

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

  searchFilter(e: any) {
    console.log("search", e.target.value);
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }
}
