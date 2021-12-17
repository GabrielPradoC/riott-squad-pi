import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Users } from 'src/models/Users.model';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<Users, User> {

  constructor(protected http: HttpClient) {
    super(http);
  }
}
