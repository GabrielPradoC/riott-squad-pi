import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input } from '@angular/core';

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
}
