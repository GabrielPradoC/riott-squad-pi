import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() customId: string;
  @Input() customTitle: string;
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
      document.getElementById(modalId).setAttribute("class", "modal down2");
      document.getElementById("div"+modalId).style.display = "none";
    }

    setTimeout(() => {
      document.getElementById("filtro").style.display = "none";
      document.getElementById(modalId).style.display = "none";
      this.restartModal(modalId);
    }, 200);
    
    document.getElementById("whiteDiv").style.display = "none";
  }

  restartModal(modalId: string) : void {
    let children: HTMLCollection = document.getElementById(modalId).children;
    let n: number = 2;

    (<HTMLSelectElement>children.item(1)).style.display = "flex";

    while(children.item(n) != null) {
      (<HTMLSelectElement>children.item(n)).style.display = "none";
      n++;
    }
    //falta reiniciar inputs e recarregar infos
  }
}
