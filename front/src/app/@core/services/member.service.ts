import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Members } from 'src/models/members.model';
import { Member } from 'src/models/member.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MemberSingle } from 'src/models/memberSingle';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends CrudService<Members, Member> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Passa os valores recebidos pelo parâmetro data para um FormData e o envia numa requisição post
   * @param data - dados do membro a ser cadastrado
   * @param apiUrl - url da requisição
   * @returns resultado da requisição
   */
  postFormData(data: any, apiUrl: string): Observable<any> {
    const formData: FormData = new FormData();

    for(let i=0; i<5; i++) {
      formData.append(
        Object.keys(data)[i],
        Object.values<string | Blob>(data)[i]
      );
    }

    return this.http.post(apiUrl, formData, { headers: this.headers }).pipe(take(2));
  }

  /**
   * Requisição de membro por id
   * @param apiUrl - url da requisição
   * @param id - id do membro desejado
   * @returns informações do membro
   */
   LoadMemberByID(apiUrl: string, id: string) {
    return this.http.get<MemberSingle>(`${apiUrl}/${id}`, { headers: this.headers }).pipe(take(2));
  }
}
