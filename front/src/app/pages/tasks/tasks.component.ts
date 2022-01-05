import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/@core/services/task.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { environment } from 'src/environments/environment';
import { TaskMinimum } from 'src/models/taskMinimum.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasks: TaskMinimum[];
  public idSelected: number;
  public modalEditShowed: boolean = false;

  constructor(private service: TaskService) {
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    const id = localStorage.getItem("riott:userId");

    this.service.List(`${environment.API}user/${id}/tasks`)
      .subscribe(
        complete => {
          this.tasks = complete.data.createdTasks;
        },
        error => console.log(error)
      );
  }

  saveId(id: number) : void {
    this.idSelected = id;
  }

  callEdit(id: number) : void {
    this.saveId(id);
    this.modalEditShowed = true;
  }

  removerAtividade(): void {
    this.service.Remove(`${environment.API}task/${this.idSelected}`).subscribe(
      complete => {
        this.getTasks();
        dialogBoxComponent.showDialogbox("warningMsgDeleteTask", "sucessMsgDeleteTask")
      }
    );
  }
}