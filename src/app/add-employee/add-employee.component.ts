import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Department } from "models/department";
import { Employee } from "models/employee";
import { Team } from "models/team";
import { NgToastService } from "ng-angular-popup";
import { EmployeeService } from "services/employee.service";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.scss"],
})
export class AddEmployeeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router,
    private employeeService: EmployeeService,
    private toast: NgToastService
  ) {
    this.department = [];
    this.teamArr = [];
    this.team = [];
  }

  ngOnInit(): void {
    this.saveDepartment();
    this.saveTeam();

    this.employeeForm = this.fb.group({
      id: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      name: new FormControl(null, [Validators.required]),
    });
  }

  //fomr-submit
  employeeForm!: FormGroup;
  employee: Employee = new Employee();
  onSubmit() {
    this.employee.position = this.position;
    this.employee.team = this.empTeam;
    console.log(this.employee);
    //service method
    this.saveEmployee();
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
  teamArr: Team[];
  saveTeam() {
    this.scheduleService.getTeamList().subscribe({
      next: (data) => {
        this.teamArr = data;
        console.log(this.teamArr);
      },
      error: (e) => console.log(e),
    });
  }

  //team
  team: Team[];
  onSelect(department) {
    this.team = this.teamArr.filter(
      (e) => e.departmentId == department.target.value
    );
  }

  empTeam: any;
  onSelect1(team) {
    this.empTeam = team.target.value;
  }

  //position
  positionArr: any = ["Team Leader", "Manager", "Intern"];
  position: any;
  onSelectPosition(e: any) {
    this.position = e.target.value;
    console.log(this.position);
  }

  //start methods
  saveEmployee() {
    this.employeeService.addEmployee(this.employee).subscribe(
      (data: any) => {
        this.toast.success({
          detail: "Success Message",
          summary: "Successfully Added.",
          duration: 5000,
        });
        console.log(data);
      },
      (error) => {
        this.toast.error({
          detail: "Error Message",
          summary: "Duplicate ID cannot be added.",
          duration: 5000,
        });
        console.log(error);
      }
    );
  }
}
