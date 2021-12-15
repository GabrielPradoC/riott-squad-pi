import { Component } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { UserService } from 'src/app/@core/services/user.service';
import { ListService } from 'src/app/@core/services/list.service';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';
import { List } from 'src/models/list.model';
import { Task } from 'src/models/task.model';
import { Lists } from 'src/models/lists.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent {
  public members: Member[];
  public list: List;
  public listManage: Lists;
  public listManageData: List;
  public tasks: Task[];
  public tasksManage: Task[];
  public totalAllowance: number = 0;
  public totalDiscount: number = 0;
  public lacks: number = 0;

  constructor(
    private memberService: MemberService,
    private userService: UserService,
    private listService: ListService) {
    this.getMembers();
  }

  getMembers(): void {
    const email = localStorage.getItem("riott:email");
    
    this.userService.List(`${environment.API}user`).subscribe(
      complete => {
        const id = complete.data.rows.find(user => user.email === email).id;
        this.memberService.List(`${environment.API}user/${id}/members`)
          .subscribe(members => this.members = members.data.children);

        this.getTaskList(id);
        this.getTaskListForManage(id);
      }
    );
  }

  getTaskList(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      list => {
        this.list = new List();
        this.tasks = [];
        this.list = list.data[0];
        this.tasks = list.data[0].tasks;
        
        this.calculateTotalAllowanceAndDiscount();
      }
    )
  }

  getTaskListForManage(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      list => {
        this.listManage = new Lists();
        this.listManageData = new List();
        this.tasksManage = [];

        this.listManage = list;
        this.listManageData = list.data[0];
        this.tasksManage = list.data[0].tasks;
      }
    )
  }

  select(id): void {
    const selected = document.getElementsByClassName('selected')[0];
    
    if (selected) {
      selected.classList.toggle('selected');
    }

    const newSelected: HTMLElement = document.getElementById(id);
    newSelected.classList.toggle('selected');

    if (selected.id != id)
      this.getTaskList(id);
  }

  selectInManageList(id): void {
    const selected = document.getElementsByClassName('selected-in-manage-list')[0];
    
    if (selected) {
      selected.classList.toggle('selected-in-manage-list');
    }

    const newSelected: HTMLElement = document.getElementById(id + 'manage');
    newSelected.classList.toggle('selected-in-manage-list');

    if (selected.id != id)
      this.getTaskListForManage(id);
  }

  calculateTotalAllowanceAndDiscount(): void {
    this.totalAllowance = 0;
    this.totalDiscount = 0;
    this.lacks = 0;

    //total of task list
    this.tasks.map(t => {
      this.totalAllowance += Number.parseFloat(t.value)

      if (t.isMissed === true) {
        this.totalDiscount += Number.parseFloat(t.value)
        this.lacks++;
      }
    })
  }

  markAsMissed(id: number): void {
    const body = {
      isMissed: true
    };

    this.listService.markAsMissed(`${environment.API}list/task/${id}`, body).subscribe(
      result => this.getMembers()
    );
  }

  openModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("manageLists").style.display = "flex";
    document.getElementById("manageLists").setAttribute("class", "modal up");
  }
}