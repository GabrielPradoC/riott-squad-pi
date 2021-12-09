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

    setTimeout(() => {
      document.getElementById("filtro").style.display = "none";
      document.getElementById(modalId).style.display = "none";
    }, 300);
  }
}
