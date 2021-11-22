import { NgModule } from "@angular/core";
import { WelcomeComponent } from "./components/welcome/welcome.component";

@NgModule({
	declarations: [
		WelcomeComponent,
	],
	providers: [],
    exports: [
        WelcomeComponent
    ]
})
export class ThemeModule { }
