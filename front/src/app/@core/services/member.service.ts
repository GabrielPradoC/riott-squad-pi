import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Members } from 'src/models/members.model';
import { Member } from 'src/models/member.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends CrudService<Members, Member> {

  constructor(protected http: HttpClient) {
    super(http);
  }
//tirar o any depois
  postFormData(data, apiUrl: string): Observable<any> {
    const formData: FormData = new FormData();

    for(let i=0; i<5; i++) {
      formData.append(
        Object.keys(data)[i],
        Object.values<string | Blob>(data)[i]
      );
    }

    return this.http.post(apiUrl, formData, { headers: this.headers }).pipe(take(2));
  }
}
