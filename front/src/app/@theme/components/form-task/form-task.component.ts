import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/@core/services/task.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss']
})

export class FormTaskComponent implements OnInit {
  @Input() typeForm: number;      //0 para create, 1 para edit
  @Input() taskId: string;

  public form: FormGroup;

  constructor(private fb: FormBuilder, private service: TaskService) {
    this.form = this.fb.group({
      description: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    if(this.typeForm == 1) {
      this.setValuesTask();
    }
  }

  /**
   * @returns string para complementar o id com '2' caso seja o formulário de edição
   */
  completeEdit() : string {
    if(this.typeForm == 1) {
      return '2'
    }
    return '';
  }

  /**
   * Preenche o formulário com a descrição da tarefa selecionada
   */
  setValuesTask() : void {
    this.service.LoadOneByID(`${environment.API}task`, this.taskId).subscribe(
      complete => {
        this.form.controls['description'].setValue(complete.data.description);
      })
  }

  /**
   * Pega valor do formulário e id de usuário e redireciona para a função adequada
   */
  requisicaoAtividade() : void {
    const description: string = this.form.controls['description'].value;
    const parent = parseInt(localStorage.getItem("riott:userId"));

    if(this.typeForm == 0) {
      this.cadastrarAtividade(description, parent);
    } else {
      this.editarAtividade(description, parent);
    }
  }

  /**
   * Faz a requisição de criação e redireciona para o dialog-box adequado
   * @param description - descrição da atividade
   * @param parent - id do usuário atual
   */
  cadastrarAtividade(description: string, parent: number) : void {
    this.service.Create(`${environment.API}task`, {description, parent}).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormTask", "sucessMsgFormTask")
      },
      error => dialogBoxComponent.showDialogbox("divFormTask", "errorMsgFormTask")
    );
  }

  /**
   * Faz a requisição de edição e redireciona para o dialog-box adequado
   * @param description - nova descrição para a ativdade
   * @param parent - id do usuário atual
   */
  editarAtividade(description: string, parent: number) {
    this.service.UpdateOne({description, parent}, `${environment.API}task/${this.taskId}`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormTask2", "sucessMsgFormTask2")
      },
      error => dialogBoxComponent.showDialogbox("divFormTask2", "errorMsgFormTask2")
    );
  }

  /**
   * Chama a função que fecha o modal atual
   */
  cancelar(): void {
    ModalComponent.prototype.hideModal();
  }

  /**
   * @returns frase de sucesso de acordo com o tipo de formulário
   */
  textSucess() : string {
    if(this.typeForm == 0) {
      return 'Atividade adicionada com sucesso!';
    } else {
      return 'Atividade editada com sucesso!';
    }
  }
}
