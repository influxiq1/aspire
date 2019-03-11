import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {UserdataComponent} from "./userdata/userdata.component";
// import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  // {path:"login", component:LoginComponent}
  // {path:"login", component:LoginComponent}
  // {path:"userdata", component:UserdataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
