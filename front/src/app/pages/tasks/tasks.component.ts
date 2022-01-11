import { Component, OnInit } from '@angular/core';
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

  constructor(private service: TaskService) {
  }

  ngOnInit() {
    this.getTasks();
  }

  /**
   * Faz requisição de todas as atividades do usuário e as insere no array tasks
   */
  getTasks() {
    const id = localStorage.getItem("riott:userId");

    this.service.List(`${environment.API}user/${id}/tasks`)
      .subscribe(
        complete => {
          this.tasks = complete.data.createdTasks;
        }
      );
  }

  /**
   * Salva o id da atividade selecionada para edição/exclusão na variável idSelected
   * @param id - id selecionado
   */
  saveId(id: number) : void {
    this.idSelected = id;
  }

  /**
   * Salva o id e muda a variável modalEditShowed para true, o que faz o componente form-task ser carregado no modo edição
   * @param id - id da atividade selecionada
   */
  callEdit(id: number) : void {
    this.saveId(id);
    setTimeout(() => {
      this.modalEditShowed = true;
    }, 100);
  }

  /**
   * Faz requisição de exclusão, atualiza a tabela de atividades e redireciona para o dialog-box adequado
   */
  removerAtividade(): void {
    this.service.Remove(`${environment.API}task/${this.idSelected}`).subscribe(
      complete => {
        this.getTasks();
        dialogBoxComponent.showDialogbox("warningMsgDeleteTask", "sucessMsgDeleteTask")
      }
    );
  }

    /**
   * Chama a função que verifica se o modal está visível
   * @param idModal - id do modal a ser verificado
   * @returns booleano dizendo se está visível ou não
   */
     callIsShowed(idModal: string) : boolean {
      return ModalComponent.isShowed(idModal);
    }
}