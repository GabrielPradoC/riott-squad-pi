import { Component } from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent {
  select(id): void {
    const selected = document.getElementsByClassName('selected')[0];
    
    if (selected) {
      selected.classList.toggle('selected');
    }

    const newSelected: HTMLElement = document.getElementById(id);
    newSelected.classList.toggle('selected');
  }
}