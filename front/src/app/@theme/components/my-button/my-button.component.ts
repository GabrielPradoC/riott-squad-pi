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
   * Verifica se foi atribuído um valor ao botão
   * Se sim, chama a função showModal() com esse valor como parâmetro
   * Se não, deixa que a funcionalidade do botão seja implementada apenas no componente pai
   */
  check() : void {
    let value: string = document.activeElement.attributes.getNamedItem("value").value;
    
    if(value != '') {
      this.showModal(value);
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