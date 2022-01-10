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
  public modalEditShowed: boolean = false;

  constructor(private service: MemberService) {
  }

  ngOnInit() {
    this.getMembers();
  }

  /**
   * Faz requisição de todos os membros e os insere no array members
   */
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

  /**
   * Altera a data recebida para o padrão brasileiro de data
   * @param date - data no formato original
   * @returns data no formato brasileiro
   */
  changeFormatDate(date: string) : string {
    const newDate: Date = new Date(date);
    return newDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'});;
    
  }

  /**
   * Salva o id do membro selecionado para edição/exclusão na variável idSelected
   * @param id - id selecionado
   */
  saveId(id: number) : void {
    this.idSelected = id;
  }

  /**
   * Salva o id e muda a variável modalEditShowed para true, o que faz o componente form-members ser carregado no modo edição
   * @param id - id da atividade selecionada
   */
  callEdit(id: number) : void {
    this.saveId(id);
    this.modalEditShowed = true;
  }

  /**
   * Faz requisição de exclusão, atualiza a tabela de membros e redireciona para o dialog-box adequado
   */
  removerMembro(): void {
    this.service.Remove(`${environment.API}member/${this.idSelected}`).subscribe(
      complete => {
        this.getMembers();
        dialogBoxComponent.showDialogbox("warningMsgDeleteMember", "sucessMsgDeleteMember")
      }
    );
  }
}