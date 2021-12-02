import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() customLists: string;
  @Input() customListsLine: string;
  @Input() customHistory: string;
  @Input() customHistoryLine: string;
  @Input() customTasks: string;
  @Input() customTasksLine: string;
  @Input() customMembers: string;
  @Input() customMembersLine: string;
}
