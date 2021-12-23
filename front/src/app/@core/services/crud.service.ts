import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class CrudService<List, Model> {
  public headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem('riott:token')}`);

  constructor(protected http: HttpClient) {}

  List(apiUrl: string) {
    return this.http.get<List>(apiUrl, { headers: this.headers })
      .pipe(take(2));
  }
  
  LoadByID(apiUrl: string, id: number) {
    return this.http.get<List>(`${apiUrl}/${id}`).pipe(take(2));
  }

  /**
   * Generic method that makes a post request to the api
   * @param url - request url
   * @param body - object containing user email and password
   * @ret urns - void
   */
  Create(apiUrl: string, data): Observable<Model> {
    return this.http.post<Model>(apiUrl, data, { headers: this.headers }).pipe(take(2));
  }

  Update(data, apiUrl: string): Observable<Model> {
    return this.http.put<Model>(`${apiUrl}/${data['id']}`, data).pipe(take(2));
  }

  Remove(apiUrl: string) {
    return this.http.delete(apiUrl, { headers: this.headers })
      .pipe(take(2));
  }
}
