import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TasksMinimum } from 'src/models/tasksMinimum.model';
import { TaskMinimum } from 'src/models/taskMinimum.model';
import { take } from 'rxjs/operators';
import { TaskSingle } from 'src/models/taskSingle.model';
import { Observable } from 'rxjs';
import { Error } from 'src/models/error.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CrudService<TasksMinimum, TaskMinimum> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * Requisição de tarefa por id
   * @param apiUrl - url da requisição
   * @param id - id da tarefa desejada
   * @returns informações da tarefa
   */
  LoadOneByID(apiUrl: string, id: string) {
    return this.http.get<TaskSingle>(`${apiUrl}/${id}`, { headers: this.headers }).pipe(take(2));
  }

  /**
   * Atualização de tarefa
   * @param data - nova descrição da tarefa e seu id
   * @param apiUrl - url da requisição
   * @returns erros, casa haja algum
   */
  UpdateOne(data, apiUrl: string): Observable<Error> {
    return this.http.put<Error>(`${apiUrl}`, data,  { headers: this.headers }).pipe(take(2));
  }
}
