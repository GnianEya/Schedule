import { HttpServiceService } from "../../services/http-service.service";
import { DataShareService } from "../../services/data-share.service";
import { ProfileDTO } from "../../models/profileDTO";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { EditDto } from "../../models/editDto";
import { MatDialog } from "@angular/material/dialog";
import { PasswordConfirmationPopupComponent } from "app/password-confirmation-popup/password-confirmation-popup.component";
import { EditProfileSender } from "../../models/editProfileSender";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin-user-profile",
  templateUrl: "./admin-user-profile.component.html",
  styleUrls: ["./admin-user-profile.component.scss"],
})
export class AdminUserProfileComponent implements OnInit {
  isEdit: boolean = true;
  currentUserID: number;
  selectedFile: File;
  showAtOnceProfile: any;
  validatedProfileDTO: ProfileDTO;
  editProfile: any;
  editProfileData: EditDto;
  editProfileSenderDto: EditProfileSender;
  dejavupass: any;
  authority: string;
  password: string;
  teamName: string;
  nickname: string;
  userId: number;
  username: string;
  departmentName: string;
  mail: string;
  biography: string;
  fbLink: any;
  ttLink: any;
  ggLink: any;
  dialogData: any;
  isSetDefaultImage: boolean;
  userdetails: any;

  constructor(
    private HttpService: HttpServiceService,
    private dataShare: DataShareService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUserID = JSON.parse(localStorage.getItem("id"));
    console.log("Current User Id : ", this.currentUserID);

    this.HttpService.getMethod(
      "http://localhost:8081/user/serchUserProfile?userId=" + this.currentUserID
    ).subscribe(async (response) => {
      this.editProfile = response;
      console.log("Info Edit ", this.editProfile);
      this.editProfileData = this.editProfile.map((data) => {
        return {
          authority: data.authority,
          password: data.password,
          teamName: data.teamName,
          nickname: data.nickName,
          userId: data.userId,
          username: data.uname,
          mail: data.mail,
          biography: data.biography,
          departmentName: data.departmentName,
        };
      });
      console.log("Edit Info data ", this.editProfileData);

      this.editProfile.map((data) => {
        this.username = data.uname;
        this.nickname = data.nickName;
        this.teamName = data.teamName;
        this.biography = data.biography;
        this.mail = data.mail;
        this.departmentName = data.departmentName;
        console.log("username " + this.username);
        console.log("Nick name", this.nickname);
        console.log("team Name : ", this.teamName);
        console.log("Biography : ", this.biography);
        console.log("Mail : ", this.mail);
        console.log("Department : ", this.departmentName);
      });
    });

    this.HttpService.getMethod(
      "http://localhost:8081/user/serchUserProfile?userId=" + this.currentUserID
    ).subscribe(async (params) => {
      this.userdetails = params;
      console.log("User Detail => username : ", this.userdetails);
      this.userdetails.map((each) => {
        this.username = each.uname;
        console.log("Username : ", this.username);
        this.nickname = each.nickName;
        console.log("Nick Name : ", this.nickname);
        this.biography = each.biography;
        console.log("Biography : ", this.biography);
      });
      console.log("Username : ", this.username);
    });
    this.HttpService.getMethod(
      "http://localhost:8081/image/getImage?id=" + this.currentUserID
    ).subscribe(async (response) => {
      this.showAtOnceProfile = response;
      this.showAtOnceProfile = this.sanitizer.bypassSecurityTrustUrl(
        "data:image/png;base64," + this.showAtOnceProfile.userImageData
      );
      console.log(
        "Profile image Data : ",
        this.showAtOnceProfile.userImageData
      );
      console.log(typeof this.showAtOnceProfile);
      //setting default image
      if (this.showAtOnceProfile === undefined) {
        console.log("Profile image is not set yet.");
        this.isSetDefaultImage = true;
      } else {
        console.log("Profile image already exist.");
        this.isSetDefaultImage = false;
      }
    });
  }

  onSubmit(): void {
    this.isEdit = true;
  }

  onFileSelected(event) {
    const inputFileElement = document.getElementById(
      "wizard-picture"
    ) as HTMLInputElement;
    this.selectedFile = inputFileElement.files[0];
    console.log("Selected file : ", this.selectedFile);
    if (this.selectedFile) {
      this.imageResolver(this.selectedFile);
      const formdata = new FormData();
      formdata.append("file", this.selectedFile);
      // formdata.append("userId",this.currentUserID.toString());
      // this.validatedProfileDTO=new ProfileDTO(this.currentUserID,this.selectFile);
      //  console.log("Validated file Data : ",formdata);
      //  const imageData=formdata.get('userImageData');
      //  console.log("image Data : ",imageData);
      //  const headers=new HttpHeaders({'Content-Type': 'multipart/form-data'});
      //  headers.append('Content-Type', 'multipart/form-data');

      // this.HttpService.postMethod('http://localhost:8081/image/dejavu',formdata,headers);

      this.http
        .post(
          "http://localhost:8081/image/dejavu?userId=" + this.currentUserID,
          formdata
        )
        .subscribe((result) => {
          console.log("Result => ", result);
        });
    }
    //   console.log("Selected By id : ",this.selectFile);
    //   console.log(event.target.files);
    // if(event.target.files){
    //   console.log("SelectedFile : ");
    //   this.selectFile =event.target.Files[0];
    //   console.log(this.selectFile);
    //   if(this.selectFile){
    //     this.validatedProfileDTO=new ProfileDTO(this.currentUserID,this.selectFile);
    //     console.log("ProfileDTO : ",this.validatedProfileDTO);
    //     // this.HttpService.postMethod('/userImage',this.validatedProfileDTO).subscribe();
    //   }
    // }
  }

  imageResolver(data: any) {
    const reader = new FileReader(); //api
    reader.readAsDataURL(data);
    reader.onload = () => {
      this.showAtOnceProfile = reader.result;
      console.log("ShowAtOnce : ", this.showAtOnceProfile);
      //sending data to navigation bar
      //this.dataShare.changeData(this.showAtOnceProfile);
    };
  }

  edit() {
    this.isEdit = !this.isEdit;
    // if (this.isEdit) {
    //   this.HttpService.getMethod(
    //     "http://localhost:8081/user/serchUserProfile?userId=" +
    //       this.currentUserID
    //   ).subscribe(async (response) => {
    //     this.editProfile = response;
    //     console.log("Info Edit ", this.editProfile);
    //     this.editProfileData = this.editProfile.map((data) => {
    //       return {
    //         authority: data.authority,
    //         password: data.password,
    //         teamName: data.teamName,
    //         nickname: data.nickName,
    //         userId: data.userId,
    //         username: data.uname,
    //         mail: data.mail,
    //         biography: data.biography,
    //         departmentName: data.departmentName,
    //       };
    //     });
    //     console.log("Edit Info data ", this.editProfileData);

    //     this.editProfile.map((data) => {
    //       this.username = data.uname;
    //       this.nickname = data.nickName;
    //       this.teamName = data.teamName;
    //       this.biography = data.biography;
    //       this.mail = data.mail;
    //       this.departmentName = data.departmentName;
    //       console.log("username " + this.username);
    //       console.log("Nick name", this.nickname);
    //       console.log("team Name : ", this.teamName);
    //       console.log("Biography : ", this.biography);
    //       console.log("Mail : ", this.mail);
    //       console.log("Department : ", this.departmentName);
    //     });
    //   });
    // }
  }

  getNickname(value) {
    this.nickname = value;
    console.log("nickname : ", this.nickname);
  }

  onValueChange(value) {
    this.biography = value;
    console.log(this.biography);
  }

  facebookLink(value) {
    this.fbLink = value;
    console.log("fb =>" + this.fbLink);
  }
  googleLink(value) {
    this.ggLink = value;
    console.log("google =>" + this.ggLink);
  }
  twitterLink(value) {
    this.ttLink = value;
    console.log("twitter =>" + this.ttLink);
  }

  upload() {
    const dialogRef = this.dialog.open(PasswordConfirmationPopupComponent, {
      data: "",
    });
    this.editProfileSenderDto = new EditProfileSender(
      this.currentUserID,
      this.nickname,
      this.biography
    );
    console.log("Edit Profile Sender =>", this.editProfileSenderDto);
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogData = result.data;
      console.log("dialog" + this.dialogData);

      console.log("Continue ");
      console.log("nickname : ", this.nickname);
      console.log("Bio : ", this.biography);
      //   const formdata=new FormData();
      // formdata.append("userId",this.currentUserID.toString());
      // formdata.append("nickname",this.nickname);
      // formdata.append("biography",this.biography);
      this.http
        .put<any>(
          "http://localhost:8081/user/updateUserProfile?password=" +
            this.dialogData,
          this.editProfileSenderDto
        )
        .subscribe((result) => {
          console.log("Upload message =>", result);
        });
    });
  }
}
