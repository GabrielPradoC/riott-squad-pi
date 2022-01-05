import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TasksMinimum } from 'src/models/tasksMinimum.model';
import { TaskMinimum } from 'src/models/taskMinimum.model';
import { take } from 'rxjs/operators';
import { TaskSingle } from 'src/models/taskSingle.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CrudService<TasksMinimum, TaskMinimum> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  LoadOneByID(apiUrl: string, id: string) {
    return this.http.get<TaskSingle>(`${apiUrl}/${id}`, { headers: this.headers }).pipe(take(2));
  }

  UpdateOne(data, apiUrl: string): Observable<TaskMinimum> {
    return this.http.put<TaskMinimum>(`${apiUrl}`, data,  { headers: this.headers }).pipe(take(2));
  }
}
