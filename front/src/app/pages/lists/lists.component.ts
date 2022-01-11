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
import { ModalComponent } from 'src/app/@theme/components/modal/modal.component';

interface CreateList {
  name: string;
  member: number;
  tasks: CreateTask[];
}

interface EditList {
  name: string;
  state: string;
  tasks: CreateTask[];
}

interface CreateTask {
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
  public allEditTasks: TaskMinimum[];
  public tasks: Task[];
  public tasksCreate: Task[];
  public tasksManage: Task[];
  public totalDiscount: number = 0;
  public lacks: number = 0;
  public statesList = {"STARTED": "Em andamento", "ONHOLD": "Em espera"};
  public form: FormGroup;
  public formToEdit: FormGroup;
  public tasksToCreate: CreateTask[];
  public tasksToEdit: Task[];
  public editedTasks: CreateTask[];
  public visibleTasks: Boolean = true;
  public error: string;
  public editListIsVisible: Boolean = false;

  constructor(
    private memberService: MemberService,
    private listService: ListService,
    private localStorageService: LocalStorageService,
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.formToEdit = this.fb.group({
      listId: ['', Validators.compose([
        Validators.required
      ])],
      name: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  ngOnInit(): void {
    this.getMembers();
    this.getAllTasks();
  }

  getMembers(id?: number): void {
    const userId = this.localStorageService.getItem("riott:userId");

    this.memberService.List(`${environment.API}user/${userId}/members`)
      .subscribe(members => {
        this.members = [];

        this.members = members?.data?.children;

        let selectedUserId: number;
        if (id) {
          //get the current member
          this.currentMemberFinalize = members?.data?.children.find(user => user.id === id);

          selectedUserId = members?.data?.children.find(user => user.id === id).id;
        }
        else {
          //get the first member
          this.currentMemberFinalize = members?.data?.children[0];

          selectedUserId = members?.data?.children[0].id;
        }

        const indexOfSelectedUser = members?.data.children.findIndex(user => user.id == selectedUserId);
        //allowance
        this.allowance = members?.data?.children[indexOfSelectedUser]?.allowance;

        this.getTaskList(members?.data?.children[indexOfSelectedUser].id);
        this.getTaskListForManage(members?.data?.children[indexOfSelectedUser].id);
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
    const userId = this.localStorageService.getItem("riott:userId");

    this.listService.List(`${environment.API}member/${memberId}/lists`).subscribe(
      lists => {
        this.listManage = new Lists();
        this.listManageData = new List();
        this.tasksManage = [];

        this.listManage = lists;

        const statesList = ["STARTED", "ONHOLD"];
        this.listManageData = lists?.data?.find(list => statesList.includes(list.state));

        //Set the name of the list
        this.formToEdit.controls['name'].setValue(lists?.data?.find(list => statesList.includes(list.state))?.name);
        this.formToEdit.controls['listId'].setValue(lists?.data?.find(list => statesList.includes(list.state))?.id);

        const listOnHold = ["ONHOLD"];
        this.tasksToEdit = lists?.data?.find(list => listOnHold.includes(list.state))?.tasks;

        this.editedTasks = [];
        lists?.data?.find(list => listOnHold.includes(list.state))?.tasks.map(task => {
          this.editedTasks?.push({ task: task.content.id, value: Number(task.value) })
        });

        this.taskService.List(`${environment.API}user/${userId}/tasks`).subscribe(
          tasks => {
            tasks?.data?.createdTasks?.map((task: TaskMinimum) => {
              this.allEditTasks?.push({
                id: task.id,
                value: Number(lists?.data?.find(list => listOnHold.includes(list.state))?.tasks.find(taskToEdit => taskToEdit.content.id == task.id)?.value),
                description: task.description,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                checked: lists?.data?.find(list => listOnHold.includes(list.state))?.tasks.find(taskToEdit => taskToEdit.content.id == task.id) ? true: false
              });

              lists?.data?.find(list => listOnHold.includes(list.state))?.tasks;
            })
          }
        )
    
        this.tasksToCreate = [];
      
        if (statesList?.includes(this.listManageData?.state)) {
          this.tasksManage = lists?.data?.find(list => statesList?.includes(list.state))?.tasks;
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
    //makes the to-do list invisible
    this.visibleTasks = false;

    //if exists, get the selected user
    const selected = document.getElementsByClassName('selected-in-manage-list');
    const selectedId = selected?.item(0)?.id;

    //set as the current member
    this.currentMemberManage = member;

    if (selected?.length > 0) {
      //remove selected user border
      selected.item(0)?.classList.toggle('selected-in-manage-list');
    }

    // Reset the array of edit tasks
    this.allEditTasks = [];

    //get the tasklist of the selected user
    if (selectedId?.replace("manage", "") != member.id.toString())
      this.getTaskListForManage(member.id)

    //set the new selected user
    const newSelected: HTMLElement = document.getElementById(member.id + 'manage');
    newSelected.classList.toggle('selected-in-manage-list');
  }

  selectInCreateList(id): void {
    const newSelected: HTMLElement = document.getElementById(id + 'create');
    newSelected.classList.toggle('selected-in-create-list');
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
      result => this.getMembers(this.currentMemberFinalize.id)
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

  removeList(id: number) {
    this.listService.Remove(`${environment.API}list/${id}`).subscribe(
      result => this.getTaskListForManage(this.currentMemberManage.id),
      error => {
        this.error = dialogBoxComponent.formatError(error.error.error);
        dialogBoxComponent.showDialogbox("contentDeleteList", "errorMsgDeleteList");
      }
    )
  }

  startList(listId: number) {
    const body = {
      state: "STARTED"
    };

    this.listService.patch(`${environment.API}list/${listId}`, body).subscribe(
      result => this.getTaskListForManage(this.currentMemberManage.id),
      error => {
        this.error = dialogBoxComponent.formatError(error.error.error);
        dialogBoxComponent.showDialogbox("contentInitList", "errorMsgInitList");
      }
    )
  }

  //Create list modal
  createList(): void {
    const name = this.form.controls['name'].value;
    
    this.getTasksValues(this.tasksToCreate);
    
    const list: CreateList = {
      name,
      member: this.currentMemberManage.id,
      tasks: this.tasksToCreate
    };

    const validation = this.tasksToCreate.every(task => task.value.toString().length > 0);
    
    if (validation) {
      this.listService.Create(`${environment.API}list`, list).subscribe(
        result => {
          this.tasksToCreate = [];
        },
        error => {
          this.error = dialogBoxComponent.formatError(error.error.error);
          dialogBoxComponent.showDialogbox("contentCreateList", "errorMsgCreateList");
        }
      );
    }
    else {
      alert('Alguma atividade está sem o valor de desconto. Para prosseguir, preencha o campo!');
    }
  }

  saveList(): void {
    const name = this.formToEdit.controls['name'].value;
    const listId = this.formToEdit.controls['listId'].value;
    
    const list: EditList = {
      name,
      state: "ONHOLD",
      tasks: []
    };

    this.editedTasks.map((task: CreateTask) => {
      list.tasks.push({ task: task.task, value: Number(task.value) });
    });

    this.getTasksEditedValues(list.tasks);
    
    this.listService.patch(`${environment.API}list/${listId}`, list).subscribe(
      result => {
      },
      error => {
        this.error = dialogBoxComponent.formatError(error.error.error);
        dialogBoxComponent.showDialogbox("contentCreateList", "errorMsgCreateList");
      }
    );
  }

  getTasksValues(tasks: CreateTask[]): void {
    tasks.map((task: CreateTask) => {
      const value: HTMLInputElement = document.getElementById(`${task.task}task-create-modal`) as HTMLInputElement;

      if (Number(value.value)) {
        task.value = Number(value.value);
      }
    })
  }

  getTasksEditedValues(tasks: CreateTask[]): void {
    tasks.map((task: CreateTask) => {
      const value: HTMLInputElement = document.getElementById(`${task.task}task-edit-modal`) as HTMLInputElement;

      task.value = Number(value.value);
    })
  }

  onCheckChange(event, taskId: number) {
    if(event.target.checked){
      const task: CreateTask = {
        task: taskId,
        value: 0
      }

      this.tasksToCreate.push(task);
    }
    else {
      const selected = this.tasksToCreate.find((task: CreateTask) => task.task == taskId);

      if (selected) {
        const index = this.tasksToCreate.findIndex(task => task.task == selected.task);
        
        this.tasksToCreate.splice(index, 1);
      }
    }
  }

  onCheckChangeEdit(event, taskId: number) {
    if(event.target.checked){
      const task: CreateTask = {
        task: taskId,
        value: 0
      }

      this.editedTasks.push(task);
    }
    else {
      const selected = this.editedTasks.find((task: CreateTask) => task.task == taskId);

      if (selected) {
        const index = this.editedTasks.findIndex(task => task.task == selected.task);
        
        this.editedTasks.splice(index, 1);
      }
    }
  }

  existsTaskInArray(taskId: number): CreateTask {
    return this.tasksToCreate.find(task => task.task == taskId);
  }

  existsTaskInArrayToEdit(taskId: number): CreateTask {
    return this.editedTasks?.find(task => task.task == taskId);
  }

  mask(): void{
    let value: string = (<HTMLSelectElement>document.getElementsByName("input-task-value").item(0)).value;

    value = value.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    value = value.replace(/(\d)(\d\d$)/,"$1,$2");    //Coloca vírgula entre o penúltimo e antepenúltimo dígitos

    (<HTMLSelectElement>document.getElementsByName("input-task-value").item(0)).value = value;
  }

  maskEdit(): void{
    let value: string = (<HTMLSelectElement>document.getElementsByName("input-task-value-edit").item(0)).value;

    value = value.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    value = value.replace(/(\d)(\d\d$)/,"$1,$2");    //Coloca vírgula entre o penúltimo e antepenúltimo dígitos

    (<HTMLSelectElement>document.getElementsByName("input-task-value-edit").item(0)).value = value;
  }

  everyTaskHasValue(): Boolean {
    return this.tasksToCreate.every(task => task.value == 1);
  }

  OpenFinalizeListModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("finalize-list").style.display = "flex";
    document.getElementById("finalize-list").setAttribute("class", "modal up");
  }

  OpenManageListsModal(): void {
    document.getElementById("filtro").style.display = "block";
    document.getElementById("manageLists").style.display = "flex";
    document.getElementById("manageLists").setAttribute("class", "modal up");
  }

  showCreateList() {
    this.form.controls["name"].setValue("");
    document.getElementById("createList").style.zIndex = "4";
    document.getElementById("createList").style.position = "initial";
    document.getElementById("createList").style.display = "flex";
    document.getElementById("createList").setAttribute("class", "modal subModal");
  }

  showEditList() {
    document.getElementById("editList").style.zIndex = "4";
    document.getElementById("editList").style.position = "initial";
    document.getElementById("editList").style.display = "flex";
    document.getElementById("editList").setAttribute("class", "modal subModal");
  }

  /**
   * Chama a função que verifica se o modal está visível
   * @param idModal - id do modal a ser verificado
   * @returns booleano dizendo se está visível ou não
   */
  callIsShowed(idModal: string) : boolean {
    return ModalComponent.isShowed(idModal);
  }
}