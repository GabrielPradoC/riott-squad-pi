import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit  {
  public members: Member[];
  public idSelected: number;

  constructor(private service: MemberService) {
  }

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    const id = localStorage.getItem("riott:userId");
    this.service.List(`${environment.API}user/${id}/members`)
      .subscribe(
        complete => {
          this.members = complete.data.children;
        },
        error => console.log(error)
      );
  }

  changeFormatDate(date: string) : string {
    const newDate: Date = new Date(date);
    return newDate.toLocaleDateString();
  }

  saveId(id: number) : void {
    this.idSelected = id;
  }

  removerMembro(): void {
    this.service.Remove(`${environment.API}member/${this.idSelected}`).subscribe(
      complete => {
        this.getMembers();
        dialogBoxComponent.showDialogbox("warningMsgDeleteMember", "sucessMsgDeleteMember")
      }
    );
  }


}