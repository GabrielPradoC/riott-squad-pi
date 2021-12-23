import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/@core/services/member.service';
import { ListService } from 'src/app/@core/services/list.service';
import { environment } from 'src/environments/environment';
import { Member } from 'src/models/member.model';
import { List } from 'src/models/list.model';
import { Lists } from 'src/models/lists.model';
import { Task } from 'src/models/task.model';
import { LocalStorageService } from 'src/app/@core/services/local-storage.service';
import { listRequestBody } from 'src/app/@core/common/interfaces/listRequestBody.interface';
import { TaskService } from 'src/app/@core/services/task.service';
import { TaskMinimum } from 'src/models/taskMinimum.model';
import { dialogBoxComponent } from 'src/app/@theme/components/dialog-box/dialog-box.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface ListToCreate {
  name: string;
  member: number;
  tasks: TaskToCreate[];
}

interface TaskToCreate {
  task: number;
  value: number;
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  public currentMemberFinalize: Member;
  public currentMemberManage: Member;
  public members: Member[];
  public allowance: number = 0;
  public list: List;
  public listManage: Lists;
  public listManageData: List;
  public allTasks: TaskMinimum[];
  public tasks: Task[];
  public tasksCreate: Task[];
  public tasksManage: Task[];
  public totalDiscount: number = 0;
  public lacks: number = 0;
  public statesList = {"STARTED": "Em andamento", "ONHOLD": "Em espera"};
  public form: FormGroup;
  public tasksToCreate: TaskToCreate[];

  constructor(
    private memberService: MemberService,
    private listService: ListService,
    private localStorageService: LocalStorageService,
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.email,
        Validators.required
      ])]
    });
  }

  ngOnInit(): void {
    this.getMembers();
    this.getAllTasks();
  }

  getMembers(): void {
    const id = this.localStorageService.getItem("riott:userId");

    this.memberService.List(`${environment.API}user/${id}/members`)
      .subscribe(members => {
        this.members = [];

        this.members = members?.data?.children;

        //get the first member
        this.currentMemberFinalize = members?.data?.children[0];

        //allowance
        this.allowance = members?.data?.children[0]?.allowance;

        this.getTaskList(members?.data?.children[0].id);
        this.getTaskListForManage(members?.data?.children[0].id);
      });
  }

  getTaskList(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      lists => {
        this.list = new List();
        this.tasks = [];
        this.list = lists?.data.find(list => list.state == "STARTED");
        
        if (this.list?.state === "STARTED")
          this.tasks = lists?.data?.find(list => list.state == "STARTED").tasks;

        this.calculateTotalAndDiscount();

        //allowance
        this.allowance = this.members?.find(member => member.id === memberId)?.allowance;
      }
    )
  }

  getTaskListForManage(memberId: number): void {
    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      lists => {
        this.listManage = new Lists();
        this.listManageData = new List();
        this.tasksManage = [];

        this.listManage = lists;

        const statesList = ["STARTED", "ONHOLD"];
        this.listManageData = lists?.data?.find(list => statesList.includes(list.state));

        // if (this.listManageData) {
        //   //show the no-list div
        //   const list = document.getElementById('no-list-container-display');
          
        //   if (list) {
        //     list.style.display = "";
        //   }
        // }
        // else {
        //   const list = document.getElementById('no-list-container-display');
        //   list.style.display = "none"
        // }
      
        if (statesList.includes(this.listManageData?.state)) {
          this.tasksManage = lists?.data?.find(list => statesList.includes(list.state))?.tasks;
        }
      }
    )
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

  getAllTasks() {
    const userId = this.localStorageService.getItem("riott:userId");

    this.taskService.List(`${environment.API}user/${userId}/tasks`).subscribe(
      tasks => {
        this.allTasks = tasks?.data?.createdTasks;
      }
    )

    this.tasksToCreate = [];
  }

  select(member: Member): void {
    const selected = document.getElementsByClassName('selected')[0];
    
    if (selected) {
      selected.classList.toggle('selected');
    }

    const newSelected: HTMLElement = document.getElementById(member.id.toString());
    newSelected.classList.toggle('selected');

    //set as the current member
    this.currentMemberFinalize = member;

    if (selected.id != member.id.toString())
      this.getTaskList(member.id);
  }

  selectInManageList(member: Member): void {    
    const selected = document.getElementsByClassName('selected-in-manage-list');
    
    if (selected.length > 0) {
      selected.item(0).classList.toggle('selected-in-manage-list');
    }
    
    const newSelected: HTMLElement = document.getElementById(member.id + 'manage');
    newSelected.classList.toggle('selected-in-manage-list');

    //set as the current member
    this.currentMemberManage = member;

    if (selected.item(0).id != member.id.toString())
      this.getTaskListForManage(member.id);

    this.activeUserVersionList();
  }

  selectInCreateList(id): void {
    const newSelected: HTMLElement = document.getElementById(id + 'create');
    newSelected.classList.toggle('selected-in-create-list');
  }

  activeUserVersionList() {
    const initialVersion: HTMLDivElement = document.getElementsByClassName('list-initial').item(0) as HTMLDivElement;
    const userVersion: HTMLDivElement = document.getElementById('list') as HTMLDivElement;

    if (initialVersion) {
      initialVersion.style.display = "none";
    }

    if (userVersion) {
      userVersion.style.display = "";
    }
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

  finalizeList(list: List): void {
    const body: listRequestBody = {
      state: "FINISHED"
    };

    this.listService.patch(`${environment.API}list/${list.id}`, body).subscribe(
      result => {
        dialogBoxComponent.showDialogbox("warningMsgFinalizeList", "sucessMsgFinalizeList");
        this.getMembers()
      }
    );
  }
  
  OpenManageListsModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("manageLists").style.display = "flex";
    document.getElementById("manageLists").setAttribute("class", "modal up");
  }

  removeList(id: number) {
    this.listService.Remove(`${environment.API}list/${id}`).subscribe(
      result => this.getTaskListForManage(this.currentMemberManage.id)
    )
  }

  startList(listId: number) {
    const body = {
      state: "STARTED"
    };

    this.listService.patch(`${environment.API}list/${listId}`, body).subscribe(
      result => this.getTaskListForManage(this.currentMemberManage.id)
    )
  }

  //Create list modal
  createList(): void {
    const name = this.form.controls['name'].value;
    
    this.getTasksValues(this.tasksToCreate);
    
    const list: ListToCreate = {
      name,
      member: this.currentMemberManage.id,
      tasks: this.tasksToCreate
    };

    const validation = this.tasksToCreate.every(task => task.value !== null);
    
    if (validation) {
      this.listService.Create(`${environment.API}list`, list).subscribe();
    }
    else {
      alert('Alguma atividade está sem o valor de desconto. Para prosseguir, preencha o campo!');
    }
  }

  onCheckChange(event, id: number) {
    if(event.target.checked){
      const task: TaskToCreate = {
        task: id,
        value: 0
      }

      this.tasksToCreate.push(task);
    }
    else {
      const selected = this.tasksToCreate.find((task: TaskToCreate) => task.task == id);

      if (selected) {
        const index = this.tasksToCreate.findIndex(task => task.task == selected.task);
        
        this.tasksToCreate.splice(index, 1);
      }
    }
  }

  existsTaskInArray(id: number): TaskToCreate {
    return this.tasksToCreate.find(task => task.task == id);
  }

  getTasksValues(tasks: TaskToCreate[]): void {
    tasks.map((task: TaskToCreate) => {
      const value: HTMLInputElement = document.getElementById(`${task.task}task-create-modal`) as HTMLInputElement;

      if (Number(value.value)) {
        task.value = Number(value.value);
      }
    })
  }

  OpenFinalizeListModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("finalize-list").style.display = "flex";
    document.getElementById("finalize-list").setAttribute("class", "modal up");
  }

  showCreateList() {
    document.getElementById("createList").style.zIndex = "4";
    document.getElementById("createList").style.position = "initial";
    document.getElementById("createList").style.display = "flex";
    document.getElementById("createList").setAttribute("class", "modal subModal");
    document.getElementById("divcreateList").style.display = "flex";
  }

  showEditList() {
    document.getElementById("editList").style.zIndex = "4";
    document.getElementById("editList").style.position = "initial";
    document.getElementById("editList").style.display = "flex";
    document.getElementById("editList").setAttribute("class", "modal subModal");
    document.getElementById("diveditList").style.display = "flex";
  }
}