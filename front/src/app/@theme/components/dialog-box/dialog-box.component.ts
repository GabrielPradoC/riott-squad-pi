import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class dialogBoxComponent {
  @Input() text: string;
  @Input() customClassSucess: string;
  @Input() customClassError: string;
  @Input() customClassWarning: string;
  @Input() textButton: string;
  @Input() divPrincipal: string;
  @Input() divAtual: string;
  @Input() closeAll: boolean;
  @Input() textError: string;
  @Output() callParent = new EventEmitter<any>();
  @ContentChild('contentDialogBox') contentDialogBox: TemplateRef<any>;

  /**
   *  Esconde o título do modal e mostra o dialog-box requisitado
   * @param divAtual - div que se encontra aberta no momento
   * @param divDialog - div que possui o dialog-box que se quer mostrar
   */
  static showDialogbox(divAtual: string, divDialog: string) {
    document.getElementById("whiteDiv").style.display = "flex";
    document.getElementById(divAtual).style.display = "none";
    document.getElementById(divDialog).style.display = "flex";
  }

  /**
   * Fecha o modal por padrão, ou chama a função implementada no pai, caso exista uma
   */
  onClick(){
    if(this.callParent.observers.length === 0) {
      ModalComponent.prototype.hideModal();
    } else {
      this.callParent.emit(null);
    }
  }

  /**
   * De acordo com o atributo customizado closeAll, ou fecha o modal, ou apenas volta à div anterior
   */
  cancel() : void {
    if(this.closeAll.toString() === "true") {
      ModalComponent.prototype.hideModal();
    } else {
      this.back();
    }
  }

  /**
   * Esconde a div atual e mostra novamente a div anterior
   */
  back() : void {
    document.getElementById(this.divAtual).style.display = "none";
    document.getElementById(this.divPrincipal).style.display = "flex";
    document.getElementById("whiteDiv").style.display = "none";
  }

  /**
   * Pega a resposta de erro e retorna a mensagem do erro
   * @param error - resposta de erro de uma requisição
   * @returns mensagem única ou mensagem do primeiro erro do array de erros
   */
  static formatError(error: any) : string {
    if(typeof error[0] === "string") {
      return error;
    } else {
      return error[0].msg;
    }
  }
}
