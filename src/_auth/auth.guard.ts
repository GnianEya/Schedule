import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserAuthService } from "../services/user-auth.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    department: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userAuthService.getToken() !== null) {
      const role = route.data["roles"] as Array<string>;
      console.log(role);
      // const id = JSON.parse(localStorage.getItem("id"));
      // if (id == null) {
      //   this.router.navigate(["/login"]);
      // }
      // this.router.navigate(['/forbidden']);
      if (role) {
        const match = this.userService.roleMatch(role);

        if (match) {
          console.log("success");
          return true;
        } else {
          console.log("fail");
          window.alert("You do not have permission to access this feature!");
          return false;
        }
      }
    }

    this.router.navigate(["/login"]);
    return true;
  }
}
