import { Component } from '@angular/core';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
  })
  export class TasksComponent {
    funcaoBotaoVerde(){
      dialogBoxComponent.showDialogbox("warningMsgExample", "errorMsgExample");
    }
  }