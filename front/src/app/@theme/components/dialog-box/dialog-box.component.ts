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
  @Output() callParent = new EventEmitter<any>();
  @ContentChild('contentDialogBox') contentDialogBox: TemplateRef<any>;

  static showDialogbox(divAtual: string, divDialog: string) {
    document.getElementById(divAtual).style.display = "none";
    document.getElementById(divDialog).style.display = "flex";
    document.getElementById("whiteDiv").style.display = "flex";
  }

  onClick(){
    if(this.callParent.observers.length === 0) {
      ModalComponent.prototype.hideModal();
    } else {
      this.callParent.emit(null);
    }
  }

  cancel() : void {
    if(this.closeAll === true) {
      ModalComponent.prototype.hideModal();
    } else {
      this.back();
    }
  }

  back() : void {
    document.getElementById(this.divAtual).style.display = "none";
    document.getElementById(this.divPrincipal).style.display = "flex";
    document.getElementById("whiteDiv").style.display = "none";
  }
}
