import { NgModule, NgModuleFactory, Type } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
		path: 'pages',
		loadChildren: (): Promise<NgModuleFactory<any> | Type<any> | any> => import('./pages/pages.module').then(module => module.PagesModule),
	},
    { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
