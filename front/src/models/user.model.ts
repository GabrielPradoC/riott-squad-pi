import { Member } from "./member.model";

export class User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createAt: Date;
  updateAt: Date;
  createdTasks: [];
  children: Member[];
}