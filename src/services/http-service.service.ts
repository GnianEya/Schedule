import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }
  getMethod(url: string): Observable<any> {
    return this.http.get(url);
  }

  fileGetMethod(url: string): Observable<any> {
    return this.http.get(url, {responseType: "arraybuffer"});
  }
  postMethod(url: string) {
    return this.http.post(url, []);
  }
  putMethod(url: string, body: any) {
    return this.http.put<any>(url, body);
  }
}