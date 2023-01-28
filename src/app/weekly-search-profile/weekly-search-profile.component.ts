import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataShareService } from 'services/data-share.service';
import { HttpServiceService } from 'services/http-service.service';

@Component({
  selector: 'app-weeky-search-profile',
  templateUrl: './weekly-search-profile.component.html',
  styleUrls: ['./weekly-search-profile.component.scss']
})
export class WeeklySearchProfileComponent implements OnInit {
  showAtOnceProfile:any;
  username:any;
  nickname:any;
  biography:any;
  fbLink:any='https://www.facebook.com/phyoe.minthu.771';
  ttLink:any='https://twitter.com/BraceIrving?s=09&fbclid=IwAR3yepgGrXZZILa1_-lxzpCj_iPXEFq_2nj3vtDz2OYmWEV8gExB9nazG0Q';
  ggLink:any='https://myaccount.google.com/profile?';
  editProfile:any;
  editProfileData:any;
  searchUserId:any;
  constructor(
    private HttpService: HttpServiceService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dataShare:DataShareService
  ) { }

  ngOnInit(): void {

    this.dataShare.searchUserIdMessage.subscribe((message)=>this.searchUserId=message);
   

    this.HttpService.getMethod(
      "http://localhost:8081/user/serchUserProfile?userId=" + this.searchUserId
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
        // this.teamName = data.teamName;
        this.biography = data.biography;
        // this.mail = data.mail;
        // this.departmentName = data.departmentName;
        console.log("username " + this.username);
        console.log("Nick name", this.nickname);
        // console.log("team Name : ", this.teamName);
        console.log("Biography : ", this.biography);
        // console.log("Mail : ", this.mail);
        // console.log("Department : ", this.departmentName);
      });

  }
);
this.HttpService.getMethod(
  "http://localhost:8081/image/getImage?id=" + this.searchUserId
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
});
  }

}
