import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { ExampleComponent } from './example/example.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
	imports: [
        PagesRoutingModule,
        ThemeModule,
				CommonModule,
				ReactiveFormsModule
	],
	declarations: [
		PagesComponent,
		ExampleComponent,
		LoginComponent
	],
	providers: []
})
export class PagesModule { }
