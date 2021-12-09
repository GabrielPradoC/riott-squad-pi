import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent {

  constructor() { }

  sobeElemento() {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("cadastrarMembro").style.display = "flex";
    document.getElementById("cadastrarMembro").setAttribute("class", "modal up");
  }
}
