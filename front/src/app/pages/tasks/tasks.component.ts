import { Component } from '@angular/core';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
  })
  export class TasksComponent {
    funcaoBotaoVerde(){
      document.getElementById("warningMsgExample").style.display = "none";
      document.getElementById("sucessMsgExample").style.display = "flex";
    }
  }