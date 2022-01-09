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
   * Envia o formData por uma requisição post
   * @param formData - dados do membro a ser cadastrado
   * @param apiUrl - url da requisição
   * @returns resultado da requisição
   */
  createMember(formData: FormData, apiUrl: string): Observable<any> {
    return this.http.post(apiUrl, formData, { headers: this.headers }).pipe(take(2));
  }

  /**
   * Envia o formData por uma requisição put
   * @param data - novos dados do membro a ser alterado
   * @param apiUrl - url da requisição
   * @returns resultado da requisição
   */
   editMember(formData: FormData, apiUrl: string): Observable<any> {
    return this.http.put(apiUrl, formData, { headers: this.headers }).pipe(take(2));
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
