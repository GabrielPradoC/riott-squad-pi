export class Member {
  id: number;
  name: string;
  allowance: number;
  birthday: Date;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
  taskLists: any[];
  totalAllowance: number;
  totalDiscounts: number;
  currentListResult: {
    missedTasksCount: number;
    totalDebit: number;
    currentAllowance: number;
  }
}