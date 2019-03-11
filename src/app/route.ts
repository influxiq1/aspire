/**
 * Created by INFLUXIQ-05 on 31-10-2018.
 */


import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LandingpageComponent} from "./landingpage/landingpage.component";
import {LandingfooterComponent} from "./landingfooter/landingfooter.component";
import {FormComponent} from "./form/form.component";
import {TableComponent} from "./table/table.component";
import {LoginComponent} from "./login/login.component";





const appRoutes: Routes =   [
  // { path: '**', redirectTo: '' },
  // {path: '**', component: LoginComponent},
  { path: '', redirectTo:'/landing', pathMatch: 'full' },

  { path:'landing', component: LandingpageComponent},
  { path:'footer', component: LandingfooterComponent},
  { path:'form', component: FormComponent},
  { path:'table', component: TableComponent},
  { path:'login', component: LoginComponent}
];

export const appRoutingProviders: any[] = [
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: false });

