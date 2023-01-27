import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { UserAuthService } from "../../services/user-auth.service";
import { UserService } from "../../services/user.service";
import { NgToastService } from "ng-angular-popup";
import { resolve } from "path";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  submitted: boolean = false;
  users!: User[];
  user: User = new User();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = "fa-eye") : (this.eyeIcon = "fa-eye-slash");
    this.isText ? (this.type = "text") : (this.type = "password");
  }

  login(loginForm: FormGroup) {
    console.log(this.user);
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setLoginUserId(response.user.userId);
        this.userAuthService.setLoginUserName(response.user.uname);

        const role = response.user.role[0].roleName;
        if (role === "organizer") {
          // alert('** Login as admin role.');
          this.toast.success({
            detail: "Success Message",
            summary: "Login as organizer role",
            duration: 5000,
          });
          this.router.navigate(["/home"]);
        } else if(role === "admin"){
          this.toast.success({
            detail: "Success Message",
            summary: "Login as admin role",
            duration: 5000,
          });
          this.router.navigate(["/departments"]);
        } else {
          // alert('** Login as user role.');
          this.toast.success({
            detail: "Success Message",
            summary: "Login as member role",
            duration: 5000,
          });
          this.router.navigate(["/home"]);
        }
      },
      (error: any) => {
        // this.router.navigate(['/error']);
        // alert('**No registerred user found.');
        this.toast.error({
          detail: "Error Message",
          summary: "No registerred user found.",
          duration: 5000,
        });
      }
    );
  }
}
