import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/@core/services/local-storage.service';
import { TaskService } from 'src/app/@core/services/task.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { ModalComponent } from 'src/app/@theme/components/modal/modal.component';
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

  constructor(
    private taskService: TaskService,
    private localStorageService: LocalStorageService) {
    //do nothing
  }

  ngOnInit() {
    this.getTasks();
  }

  /**
   * Method that fetches all tasks of a user in the database.
   * 
   * @returns void
   */
  getTasks(): void {
    const userId = this.localStorageService.getItem("riott:userId");

    this.taskService.List(`${environment.API}user/${userId}/tasks`)
      .subscribe(
        complete => {
          this.tasks = complete.data.createdTasks;
        }
      );
  }

  /**
   * Save the id of the activity selected for editing/deletion in the idSelected 
   * variable.
   * 
   * @param id - activityId
   * @returns void
   */
  saveId(activityId: number): void {
    this.idSelected = activityId;
  }

  /**
   * Save the id and change the modalEditShowed variable to true, which causes the 
   * form-task component to be loaded in edit mode.
   * 
   * @param id - id da atividade selecionada
   * @returns void
   */
  callEdit(id: number): void {
    this.saveId(id);
    setTimeout(() => {
      this.modalEditShowed = true;
    }, 100);
  }

  /**
   * Method that does the deletion, updates the activity table and redirects to the 
   * appropriate dialog-box.
   * 
   * @returns void
   */
  removerAtividade(): void {
    this.taskService.Remove(`${environment.API}task/${this.idSelected}`).subscribe(
      complete => {
        this.getTasks();
        dialogBoxComponent.showDialogbox("warningMsgDeleteTask", "sucessMsgDeleteTask")
      }
    );
  }

  /**
   * Method that calls the function that checks if the modal is visible
   * 
   * @param idModal - id of the modal to check
   * @returns a boolean saying whether it is visible or not
   */
  callIsShowed(idModal: string): boolean {
    return ModalComponent.isShowed(idModal);
  }
}