import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Members } from 'src/models/members.model';
import { Member } from 'src/models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends CrudService<Members, Member> {

  constructor(protected http: HttpClient) {
    super(http);
  }
}
