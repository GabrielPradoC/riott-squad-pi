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

  check() : void {
    let value: string = document.activeElement.attributes.getNamedItem("value").value;
    
    if(value != '') {
      this.showModal(value);
    }
  }

  showModal(modalId: string) : void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById(modalId).style.display = "flex";
    document.getElementById(modalId).setAttribute("class", "modal up");
  }
}