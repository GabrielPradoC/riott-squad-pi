import { Task } from "./task.model";

export class Tasks {
  status: boolean;
  date: Date;
  data: {
    rows: Task[];
    count: number;
  }
}