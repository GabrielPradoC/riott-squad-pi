import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lists } from 'src/models/lists.model';
import { List } from 'src/models/list.model';
import { CrudService } from './crud.service';
import { take } from 'rxjs/operators';
import { listRequestBody } from '../common/interfaces/listRequestBody.interface';
import { ListById } from 'src/models/listById.model';

@Injectable({
  providedIn: 'root'
})
export class ListService extends CrudService<Lists, List> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  markAsMissed(apiUrl: string, body: { isMissed: boolean }) {
    return this.http.patch<List>(apiUrl, body, { headers: this.headers })
      .pipe(take(2));
  }

  patch(apiUrl: string, body: listRequestBody) {
    return this.http.patch(apiUrl, body, { headers: this.headers })
      .pipe(take(2));
  }

  ListByID(apiUrl: string, id: number) {
    return this.http.get<ListById>(`${apiUrl}/${id}`, { headers: this.headers }).pipe(take(2));
  }
}
