import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  /**
   * Limpa o armazenamento local ao sair
   */
  logout() {
    localStorage.clear();
  }
}
