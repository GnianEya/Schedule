import { Component } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { User } from "../../models/user";
import { UserCrudService } from "../../services/user-crud.service";
import { HttpServiceService } from "services/http-service.service";
import { ScheduleService } from "services/schedule.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  submitted: boolean = false;
  users!: User[];
  user: User = new User();
  currentUserLogin: number;
  base64data: any;

  constructor(
    private fb: FormBuilder,
    private userCrudService: UserCrudService,
    private router: Router,
    private toast: NgToastService,
    private httpService: HttpServiceService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    //get logined user id
    this.currentUserLogin = JSON.parse(localStorage.getItem("id"));
    //validation
    this.signUpForm = this.fb.group({
      employeeId: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          //  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-zd$@$!%*?&].{7,}$"
        ),
      ]),
      coPassword: new FormControl(null, [Validators.required]),
    });
    //end of validation
  }

  get f() {
    return this.signUpForm.controls;
  }

  //icon eyes
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = "fa-eye") : (this.eyeIcon = "fa-eye-slash");
    this.isText ? (this.type = "text") : (this.type = "password");
  }
  hideShowPass2() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = "fa-eye") : (this.eyeIcon = "fa-eye-slash");
    this.isText ? (this.type = "text") : (this.type = "password");
  }

  //form submit
  onSubmit() {
    console.log(this.user);
    this.saveUser();
  }

  //start methods
  saveUser() {
    this.userCrudService.addUser(this.user).subscribe(
      (data: any) => {
        console.log(data);
        this.toast.success({
          detail: "Success Message",
          summary: "Successfully registered.",
          duration: 5000,
        });
        this.goToLogin();
      },
      (error) => {
        this.toast.error({
          detail: "Error Message",
          summary: "Register Failed : Invalid employee ID",
          duration: 5000,
        });
        console.log(error);
      }
    );
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
  goToError() {
    this.router.navigate(["/error"]);
  }
}
