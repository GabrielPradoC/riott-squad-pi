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
  @Output() click: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {
  }

  clickEvent(): void {
    this.click.emit();
  }
}
