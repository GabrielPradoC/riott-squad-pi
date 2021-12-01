import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { LoginComponent } from './login/login.component';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MembersComponent } from "./members/members.component";
import { MyButtonComponent } from "../@theme/components/my-button/my-button.component";
import { ListsComponent } from "./lists/lists.component";
import { HeaderComponent } from "../@theme/components/header/header.component";

@NgModule({
	imports: [
        PagesRoutingModule,
        ThemeModule,
				CommonModule,
				ReactiveFormsModule
	],
	declarations: [
		PagesComponent,
		LoginComponent,
		MembersComponent,
		MyButtonComponent,
		ListsComponent,
		HeaderComponent
	],
	providers: []
})
export class PagesModule { }
