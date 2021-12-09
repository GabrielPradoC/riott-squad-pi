import { Component } from '@angular/core';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
  })
  export class TasksComponent {
    sobeElemento() {
      document.getElementById("filtro").style.display = "block";
      document.getElementById("cadastrarAtividade").style.display = "flex";
      document.getElementById("cadastrarAtividade").setAttribute("class", "modal up");
    }
  }