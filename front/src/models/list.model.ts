import { Task } from "./task.model";

export class List {
  id: number;
  name: string;
  dateStart: Date;
  dateEnd: Date | null;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  AmountTasksMissed?: number;
  tasks: Task[];
}