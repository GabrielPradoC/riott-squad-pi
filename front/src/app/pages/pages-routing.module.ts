import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './login/login.component';
import { MembersComponent } from "./members/members.component";
import { ListsComponent } from "./lists/lists.component";
import { HistoryComponent } from "./history/history.component";
import { TasksComponent } from "./tasks/tasks.component";
import { PagesAuthGuard } from "./pages-auth.guard";

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'lists',
		component: ListsComponent,
		canActivate: [PagesAuthGuard]
	},
	{
		path: 'members',
		component: MembersComponent,
		canActivate: [PagesAuthGuard]
	},
	{
		path: 'history',
		component: HistoryComponent,
		canActivate: [PagesAuthGuard]
	},
	{
		path: 'tasks',
		component: TasksComponent,
		canActivate: [PagesAuthGuard]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule { }
