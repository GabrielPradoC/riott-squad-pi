import { NgModule } from "@angular/core";
import { ThemeModule } from "../@theme/theme.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { ExampleComponent } from './example/example.component';

@NgModule({
	imports: [
        PagesRoutingModule,
        ThemeModule
	],
	declarations: [
		PagesComponent,
		ExampleComponent,
	],
	providers: []
})
export class PagesModule { }
