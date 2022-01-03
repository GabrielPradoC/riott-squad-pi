import { User } from "./user.model";

export class Users {
  status: boolean;
  date: Date;
  data: {
    rows: User[];
    count: number;
  }
}