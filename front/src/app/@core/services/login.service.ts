import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Auth } from "../common/interfaces/auth.interface";
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: 'root',
})
export class LoginService extends CrudService<Auth, Auth> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}