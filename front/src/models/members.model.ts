import { Member } from "./member.model";

export class Members {
  status: boolean;
  date: Date;
  data: {
    children: Member[];
  }
}