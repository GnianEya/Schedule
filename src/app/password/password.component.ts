import { Component } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { ResetPassword } from "../../models/reset-password";
import { PasswordService } from "../../services/password.service";

@Component({
  selector: "app-password",
  templateUrl: "./password.component.html",
  styleUrls: ["./password.component.scss"],
})
export class PasswordComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  passwordForm!: FormGroup;
  submitted: boolean = false;
  resetPasswords!: ResetPassword[];
  resetPassword: ResetPassword = new ResetPassword();

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    //validation
    this.passwordForm = this.fb.group({
      token: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
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
    return this.passwordForm.controls;
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
    console.log(this.resetPassword);
    this.savePassword();
  }

  //start methods

  savePassword() {
    this.passwordService.resetPassword(this.resetPassword).subscribe(
      (data: any) => {
        console.log(data);
        this.toast.success({
          detail: "Success Message",
          summary: "Successfully Password created.",
          duration: 5000,
        });
        this.router.navigate(["/login"]);
      },
      (error) => {
        this.toast.error({
          detail: "Error Message",
          summary: "Password reset Failed : Invalid OTP code",
          duration: 5000,
        });
        console.log(error);
      }
    );
  }
}
