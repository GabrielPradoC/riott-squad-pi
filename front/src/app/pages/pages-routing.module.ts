import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from './login/login.component';
import { MembersComponent } from "./members/members.component";
import { ListsComponent } from "./lists/lists.component";

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'lists',
		component: ListsComponent,
	},
	{
		path: 'members',
		component: MembersComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule { }
