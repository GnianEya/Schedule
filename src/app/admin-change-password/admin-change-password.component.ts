import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ChangePassword } from "models/change-password";
import { NgToastService } from "ng-angular-popup";
import { PasswordService } from "services/password.service";

@Component({
  selector: "app-admin-change-password",
  templateUrl: "./admin-change-password.component.html",
  styleUrls: ["./admin-change-password.component.scss"],
})
export class AdminChangePasswordComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  changePasswordForm!: FormGroup;
  submitted: boolean = false;
  changePasswords!: ChangePassword[];
  changePassword: ChangePassword = new ChangePassword();

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    //validation
    this.changePasswordForm = this.fb.group({
      oldPassword: new FormControl(null, [Validators.required]),
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
    return this.changePasswordForm.controls;
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
    this.changePassword.currentUserId = JSON.parse(localStorage.getItem("id"));
    console.log(this.changePassword);
    this.savePassword();
  }

  //start methods

  savePassword() {
    this.passwordService.changePassword(this.changePassword).subscribe(
      (data: any) => {
        console.log(data);
        this.toast.success({
          detail: "Success Message",
          summary: "Successfully changed password.",
          duration: 5000,
        });
      },
      (error) => {
        console.log(error);
        this.toast.error({
          detail: "Error Message",
          summary: "Failed to change password.",
          duration: 5000,
        });
      }
    );
  }
}
