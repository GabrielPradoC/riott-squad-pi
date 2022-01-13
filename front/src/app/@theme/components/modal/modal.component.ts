import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() customId: string;
  @Input() customTitle: string;
  @Output() callParent = new EventEmitter<any>();
  @ContentChild('content') content: TemplateRef<any>;

  /**
   * Encontra o id do modal ativo e o esconde novamente
   */
  hideModal() {
    let modalId: string = document.getElementsByClassName("modal up").item(0).attributes.getNamedItem("id").value;
    document.getElementById(modalId).setAttribute("class", "modal down");

    if(document.getElementsByClassName("modal subModal").length > 0) {
      document.getElementById(modalId).style.display = "none";
      modalId = document.getElementsByClassName("modal subModal").item(0).attributes.getNamedItem("id").value;
      document.getElementById(modalId).setAttribute("class", "modal subModal down2");
    }

    setTimeout(() => {
      document.getElementById(modalId).style.display = "none";
      document.getElementById("filtro").style.display = "none";
      this.restartModal(modalId);
    }, 200);

    if(this.callParent && (this.callParent.observers.length > 0)) {
      this.callParent.emit(null);
    }
  }

  /**
   * Volta o modal pra div inicial
   * @param modalId - id do modal
   */
  restartModal(modalId: string) : void {
    let children: HTMLCollection = document.getElementById(modalId).children;
    let n: number = 2;

    while(children.item(n) != null) {
      (<HTMLSelectElement>children.item(n)).style.display = "none";
      n++;
    }
  }

  /**
   * Diz se o modal está visível ou não
   * @param idModal - id do modal a ser verificado
   * @returns booleano com a resposta
   */
  static isShowed(idModal: string) : boolean {
    if(document.getElementById(idModal)) {
      if(document.getElementById(idModal).style.display === "flex") {
        return true;
      }
    }
    return false;
  }
}
