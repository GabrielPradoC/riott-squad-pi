export interface Auth {
  status: boolean;
  date: Date;
  data: {
    token: string;
    userId: number;
  }
}