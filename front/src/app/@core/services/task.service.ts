import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { TasksMinimum } from 'src/models/tasksMinimum.model';
import { TaskMinimum } from 'src/models/taskMinimum.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CrudService<TasksMinimum, TaskMinimum> {

  constructor(protected http: HttpClient) {
    super(http);
  }
}
