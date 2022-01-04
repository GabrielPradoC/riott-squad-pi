import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/@core/services/task.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { environment } from 'src/environments/environment';
import { TaskMinimum } from 'src/models/taskMinimum.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-form-task',
  templateUrl: './form-task.component.html',
  styleUrls: ['./form-task.component.scss']
})
export class FormTaskComponent implements OnInit {
  @Input() typeForm: number;
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
      this.trocaIds();
      this.setValuesTask();
    }
  }

  trocaIds() {
    document.getElementsByName("divFormTask").item(1).setAttribute("id", "divFormTask2");
    document.getElementsByName("sucessMsgFormTask").item(1).setAttribute("id", "sucessMsgFormTask2");
    document.getElementsByName("errorMsgFormTask").item(1).setAttribute("id", "errorMsgFormTask2");
    document.getElementsByName("description").item(1).setAttribute("id", "description2");
    document.getElementsByName("labelDescription").item(1).setAttribute("for", "description2");
  }

  setValuesTask() : void {
    this.service.LoadOneByID(`${environment.API}task`, this.taskId).subscribe(
      complete => {
        this.form.controls['description'].setValue(complete.data.description);
      })
  }

  requisicaoAtividade() : void {
    const description: string = this.form.controls['description'].value;
    const parent = parseInt(localStorage.getItem("riott:userId"));

    if(this.typeForm == 0) {
      this.cadastrarAtividade(description, parent);
    } else {
      this.editarAtividade(description, parent);
    }
  }

  cadastrarAtividade(description: string, parent: number) : void {
    this.service.Create(`${environment.API}task`, {description, parent}).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormTask", "sucessMsgFormTask")
      },
      error => dialogBoxComponent.showDialogbox("divFormTask", "errorMsgFormTask")
    );
  }

  editarAtividade(description: string, parent: number) {
    this.service.UpdateOne({description, parent}, `${environment.API}task/${this.taskId}`).subscribe(
      complete => {
        dialogBoxComponent.showDialogbox("divFormTask2", "sucessMsgFormTask2")
      },
      error => dialogBoxComponent.showDialogbox("divFormTask2", "errorMsgFormTask2")
    );
  }

  cancelar(): void {
    ModalComponent.prototype.hideModal();
  }

  textSucess() : string {
    if(this.typeForm == 0) {
      return 'Atividade adicionada com sucesso!'
    }  {
      return 'Atividade editada com sucesso!';
    }
  }

  completeEdit() {
    if(this.typeForm == 0) {
      return ''
    }  {
      return '2';
    }
  }
}
