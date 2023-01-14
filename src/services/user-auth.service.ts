import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserAuthService {
  constructor() {}

  public setRoles(roles: []) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): [] {
    return JSON.parse(localStorage.getItem("roles") || "{}");
  }

  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken);
  }

  public getToken(): string {
    return localStorage.getItem("jwtToken") || "{}";
  }

  public setLoginUserName(uname: string) {
    localStorage.setItem("name", JSON.stringify(uname));
  }

  public getLoginUserName(): string {
    return localStorage.getItem("uname") || "{}";
  }

  public setLoginUserId(id: string) {
    localStorage.setItem("id", JSON.stringify(id));
  }

  public getLoginUserId(): string {
    return window.localStorage.getItem("id");
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }
}
