class Tasks {
  task: number;
  value: number;
}

export class listRequestBody {
  name?: string;
  state: string;
  tasks?: Tasks[];
}