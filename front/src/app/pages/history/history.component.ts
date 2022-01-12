import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { LocalStorageService } from 'src/app/@core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';
import { ListService } from 'src/app/@core/services/list.service';
import { List } from 'src/models/list.model';
import { Task } from 'src/models/task.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public currentMember: Member;
  public members: Member[];
  public lists: List[];
  public currentList: List;
  public tasks: Task[];
  public lacks: number = 0;
  public isMissed = {true: "Faltou", false: "Concluída"};

  constructor(
    private memberService: MemberService,
    private localStorageService: LocalStorageService,
    private listService: ListService) {
    //do nothing
  }

  ngOnInit(): void {
    this.getMembers();
  }

  /**
   * Method that fetches members in the database and calls the method responsible 
   * for fetching the configured list of the default member.
   * 
   * @returns void
   */
  getMembers(): void {
    const userId = this.localStorageService.getItem("riott:userId");

    this.memberService.List(`${environment.API}user/${userId}/members`)
      .subscribe(members => {
        this.members = [];
        this.members = members?.data?.children;

        //get the first member
        this.currentMember = members?.data?.children[0];

        this.getLists(members?.data?.children[0]?.id);
      });
  }

  /**
   * Method that fetches a member's finished lists from the database.
   * 
   * @param memberId - member Id
   * @returns void
   */
  getLists(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      result => {
        this.lists = [];
        this.lists = result?.data?.filter(list => list.state == "FINISHED");

        this.lists.map((list: List) => this.calculateTotalLacks(list));
      }
    )
  }

  /**
   * Method that calculates the total of missed tasks.
   * 
   * @param memberId - member Id
   * @returns void
   */
  calculateTotalLacks(list: List): void {
    const missedTasks = list?.tasks?.filter((taks: Task) => taks.isMissed)?.length;
    
    list.AmountTasksMissed = missedTasks;
  }

  /**
   * Method that sets a new user to selected.
   * 
   * @param member - member
   * @returns void
   */
  select(member: Member): void {
    const selected = document.getElementsByClassName('selected')[0];
    
    if (selected) {
      selected.classList.toggle('selected');
    }

    const newSelected: HTMLElement = document.getElementById(member.id.toString());
    newSelected.classList.toggle('selected');

    //set as the current member
    this.currentMember = member;

    if (selected.id != member.id.toString())
      this.getLists(member.id);
  }

  /**
   * Method that opens the list details modal.
   * 
   * @param list - list
   * @returns void
   */
  OpenListDetailsModal(list: List): void {
    //get the list of the member
    this.currentList = list;

    //get the tasks list
    this.listService.ListById(`${environment.API}list`, list.id).subscribe(
      result => {
        this.tasks = result?.data?.tasks;
      }
    );
    
    document.getElementById("filtro").style.display = "block";
    document.getElementById("listDetails").style.display = "flex";
    document.getElementById("listDetails").setAttribute("class", "modal up");
  }
}