import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { ModalComponent } from 'src/app/@theme/components/modal/modal.component';
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
  public modalEditShowed: boolean = false;

  constructor(private service: MemberService) {
    //do nothing
  }

  ngOnInit() {
    this.getMembers();
  }

  /**
   * Method that fetches members in the database.
   * 
   * @returns void
   */
  getMembers(): void {
    const id = localStorage.getItem("riott:userId");
    this.service.List(`${environment.API}user/${id}/members`)
      .subscribe(
        complete => {
          this.members = complete.data.children;
        }
      );
  }

  /**
   * Method that changes a date to the Brazilian date pattern.
   * 
   * @param date - Date
   * @returns Date in Brazilian format
   */
  changeFormatDate(date: string): string {
    const newDate: Date = new Date(date);
    return newDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }

  /**
   * Method that converts a numeric value to reais
   * 
   * @param value - value
   * @returns value in reais
   */
  changeFormatValue(value: number): string {
    return "R$ " + value.toString().replace(".", ",");
  }

  /**
   * Save the id of the selected member for editing/deletion in the idSelected variable
   * 
   * @param id - id
   * @returns void
   */
  saveId(memberId: number): void {
    this.idSelected = memberId;
  }

  /**
   * Save the id and change the modalEditShowed variable to true, which causes the 
   * form-members component to be loaded in edit mode.
   * 
   * @param taskId - id da atividade selecionada
   * @returns void
   */
  callEdit(taskId: number): void {
    this.saveId(taskId);
    setTimeout(() => {
      this.modalEditShowed = true;
    }, 200);
  }

  /**
   * Make delete request, update member table and redirect to appropriate dialog-box
   * 
   * @returns void
   */
  removerMembro(): void {
    this.service.Remove(`${environment.API}member/${this.idSelected}`).subscribe(
      complete => {
        this.getMembers();
        dialogBoxComponent.showDialogbox("warningMsgDeleteMember", "sucessMsgDeleteMember")
      }
    );
  }

  /**
   * Method that calls the function that checks if the modal is visible
   * 
   * @param modalId - id of the modal to check
   * @returns A boolean saying whether it is visible or not
   */
  callIsShowed(modalId: string): boolean {
    return ModalComponent.isShowed(modalId);
  }
}