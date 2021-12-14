export interface Auth {
  status: Boolean;
  date: Date;
  data: {
    token: string;
    userId: number;
  }
}