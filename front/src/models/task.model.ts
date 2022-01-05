export class Task {
  id: number;
  value: string;
  isMissed: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: {
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
}