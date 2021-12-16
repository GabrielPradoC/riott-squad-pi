import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { ListService } from 'src/app/@core/services/list.service';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';
import { List } from 'src/models/list.model';
import { Lists } from 'src/models/lists.model';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from 'src/app/@core/services/local-storage.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  public members: Member[];
  public allowance: number = 0;
  public list: List;
  public listManage: Lists;
  public listManageData: List;
  public tasks: Task[];
  public tasksManage: Task[];
  public totalDiscount: number = 0;
  public lacks: number = 0;

  constructor(
    private memberService: MemberService,
    private listService: ListService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    const id = this.localStorageService.getItem("riott:userId");

    this.memberService.List(`${environment.API}user/${id}/members`)
      .subscribe(members => {
        this.members = members.data.children;

        //allowance
        this.allowance = members.data.children[0].allowance;
      });
    
    this.getTaskList(Number(id));
    this.getTaskListForManage(Number(id));
  }

  getTaskList(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      lists => {
        this.list = new List();
        this.tasks = [];
        this.list = lists?.data[0];
        
        if (this.list?.state === "STARTED")
          this.tasks = lists?.data[0]?.tasks;

        this.calculateTotalAndDiscount();

        //allowance
        this.allowance = this.members.find(member => member.id === memberId).allowance;
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

  calculateTotalAndDiscount(): void {
    this.totalDiscount = 0;
    this.lacks = 0;

    //total of missed tasks
    this.tasks?.map(t => {
      if (t.isMissed === true) {
        this.totalDiscount += Number.parseFloat(t.value)
        this.lacks++;
      }
    })
  }

  toggleMissed(task: Task): void {
    let body = {
      isMissed: true
    }

    if (task.isMissed) {
      body.isMissed = false;
    }
    else {
      body.isMissed = true;
    }

    this.listService.markAsMissed(`${environment.API}list/task/${task.id}`, body).subscribe(
      result => this.getMembers()
    );
  }

  openModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("manageLists").style.display = "flex";
    document.getElementById("manageLists").setAttribute("class", "modal up");
  }
}