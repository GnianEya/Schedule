import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "models/employee";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private baseUrl = "http://localhost:8081/employee";
  constructor(private httpClient: HttpClient) {}

  addEmployee(employee: Employee): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/createEmployee`, employee);
  }

  getEmployeeList(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/getAllEmployees`);
  }

  getEmployeeDataList(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/getEmployees`);
  }

  deleteEmployee(employeeId: Number): Observable<Object> {
    return this.httpClient.delete(
      `${this.baseUrl}/deleteEmployee/${employeeId}`
    );
  }

  // getEmployeeByEmpId(employeeId: Number): Observable<Employee> {
  //   return this.httpClient.get<Employee>(`${this.baseUrl}/${employeeId}`);
  // }
  // updateEmployee(employeeId: Number, employee: Employee): Observable<Object> {
  //   return this.httpClient.put(`${this.baseUrl}/${employeeId}`, employee);
  // }

  searchEmployee(empTxt: number): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${this.baseUrl}/searchEmployee?empTxt=${empTxt}`
    );
  }
}
