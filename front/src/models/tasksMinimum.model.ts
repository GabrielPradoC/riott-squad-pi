import { TaskMinimum } from "./taskMinimum.model";

export class TasksMinimum {
  status: boolean;
  date: Date;
  data: {
    rows: TaskMinimum[];
    count: number;
  }
}