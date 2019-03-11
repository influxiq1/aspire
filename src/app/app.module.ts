import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import {appRoutingProviders, routing} from './route';
import { AppComponent } from './app.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LandingfooterComponent } from './landingfooter/landingfooter.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from './form/form.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './table/table.component';
import {DemoMaterialModule} from '../material-module';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    LandingfooterComponent,
    FormComponent,
    TableComponent,
    LoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    routing, NgbModule,
    appRoutingProviders, DemoMaterialModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
