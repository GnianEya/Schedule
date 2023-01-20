import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Department } from "models/department";
import { Team } from "models/team";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.scss"],
})
export class DepartmentsComponent implements OnInit {
  dataSource!: MatTableDataSource<Department>;
  displayedColumns: string[] = ["ID", "Departments", "Teams"];

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
        this.dataSource = new MatTableDataSource<Department>(this.department);
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
        console.log(this.team);
      },
      error: (e) => console.log(e),
    });
  }
}
