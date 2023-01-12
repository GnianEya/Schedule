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
import { PasswordService } from "../../services/password.service";
import { UserCrudService } from "../../services/user-crud.service";

@Component({
  selector: "app-forget-pass",
  templateUrl: "./forget-pass.component.html",
  styleUrls: ["./forget-pass.component.scss"],
})
export class ForgetPassComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  forgetPassForm!: FormGroup;
  submitted: boolean = false;
  // users!: User[];
  // user: User = new User();
  user!: User;
  email!: string;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    //validation
    this.forgetPassForm = this.fb.group({
      uEmail: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ]),
    });
    //end of validation
  }

  get f() {
    return this.forgetPassForm.controls;
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
    console.log(this.email);
    this.savePassword();
  }

  // start methods
  savePassword() {
    this.passwordService.processForgetPasswordForm(this.email).subscribe(
      (data: any) => {
        console.log(data);
        alert(
          "We have sent an OTP code to your email address.If you do not receive the email under 30 seconds, you are either an invalid user or the email address you just entered is incorrect.We suggest you to enter a valid email address and sent again."
        );
        // this.toast.success({
        //   detail: 'Success Message',
        //   summary: 'Password reset email link sent. Please Check your inbox',
        //   duration: 5000,
        // });
        this.router.navigate(["/login"]);
      },
      (error) => {
        alert(
          "We have sent an OTP code to your email address. \n \n If you do not receive the email under 30 seconds, you are either an invalid user or the email address you just entered is incorrect.\n \nWe suggest you to enter a valid email address and send  again."
        );
        // this.toast.success({
        //   detail: 'Success Message',
        //   summary: 'Password reset email link sent. Please Check your inbox',
        //   duration: 5000,
        // });
        this.router.navigate(["/forgetpass"]);
      }
    );
  }
  goToHome() {
    this.router.navigate(["/login"]);
  }
  goToError() {
    this.router.navigate(["/error"]);
  }
}
