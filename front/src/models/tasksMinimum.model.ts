import { TaskMinimum } from "./taskMinimum.model";

export class TasksMinimum {
  status: boolean;
  date: Date;
  data: {
    createdTasks: TaskMinimum[];
  }
}