import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { LoginComponent } from './login/login.component';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MembersComponent } from "./members/members.component";
import { MyButtonComponent } from "../@theme/components/my-button/my-button.component";
import { ListsComponent } from "./lists/lists.component";
import { HeaderComponent } from "../@theme/components/header/header.component";
import { HistoryComponent } from "./history/history.component";
import { TasksComponent } from "./tasks/tasks.component";
import { PagesAuthGuard } from "./pages-auth.guard";
import { ModalComponent } from "../@theme/components/modal/modal.component";
import { dialogBoxComponent } from "../@theme/components/dialog-box/dialog-box.component";
import { ListFullComponent } from "../@theme/components/list-full/list-full.component";
import { FormMemberComponent } from "../@theme/components/form-member/form-member.component";
import { FormTaskComponent } from "../@theme/components/form-task/form-task.component";

@NgModule({
	imports: [
		PagesRoutingModule,
		ThemeModule,
		CommonModule,
		ReactiveFormsModule
	],
	declarations: [
		LoginComponent,
		MembersComponent,
		MyButtonComponent,
		ListsComponent,
		HeaderComponent,
		HistoryComponent,
		TasksComponent,
		ModalComponent,
		dialogBoxComponent,
		ListFullComponent,
		FormMemberComponent,
		FormTaskComponent
	],
	providers: [PagesAuthGuard]
})
export class PagesModule { }
