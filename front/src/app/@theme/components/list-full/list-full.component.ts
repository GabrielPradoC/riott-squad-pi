import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-list-full',
  templateUrl: './list-full.component.html',
  styleUrls: ['./list-full.component.scss']
})
export class ListFullComponent {
  @Input() customTitle: string;
  @Input() textButton: string;
  @Input() customValueButton: string;
  @ContentChild('contentListFull') contentListFull: TemplateRef<any>;
}
