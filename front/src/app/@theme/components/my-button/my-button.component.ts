import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.scss']
})
export class MyButtonComponent {
  @Input() text: string;
  @Input() disabled: string;
  @Input() customClass: string;
  @Input() customValue: string;
  
  constructor() {
  }

  /**
   * Verifica se foi atribuído um valor ao customValue
   * Se sim, chama a função showModal() com esse valor como parâmetro
   * Se não, deixa que a funcionalidade do botão seja implementada apenas no componente pai
   */
  check() : void {
    if(this.customValue != undefined) {
      this.showModal(this.customValue);
    }
  }

  /**
   * Sobe o modal correspondente ao botão clicado
   * @param modalId - id do modal
   */
  showModal(modalId: string) : void {
      document.getElementById("filtro").style.display = "block";
      document.getElementById(modalId).style.display = "flex";
      document.getElementById(modalId).setAttribute("class", "modal up");
  }
}