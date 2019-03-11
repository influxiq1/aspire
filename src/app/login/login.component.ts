import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private ServiceUrl = 'https://nodessl.influxiq.com:6011/login';
  private cookieService: CookieService;
  public myForm: FormGroup;
  cookieValue = '';
  constructor( private fb: FormBuilder, public _http: HttpClient, private router: Router, cookieService: CookieService) {
    this.cookieService = cookieService;
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    /*if (this.cookieService != ''){
      this.router.navigate(['/table']);
    }*/


   /* this._http.get(this.ServiceUrl).forEach(res=>{
      let result: any = {};
      result = res;
      console.log("hgj");
      console.log(result);
      let x = (result);
      this.x = x;
      console.log("x");
      console.log(x);

    });*/
  }
/*
  getCookie(key: string){
    return this.cookieService.get(key);
  }

  checkCookie(key: string){
    return this.cookieService.check(key);
  }
  deleteAllCookie(){
    return this.cookieService.deleteAll();
  }*/



  onSubmit() {
    let x: any;
    let data = this.myForm.value;
    /*let username = this.myForm.value.username;
    let password = this.myForm.value.password;
    if(username==="himadri" && password==="admin"){
      this.router.navigate(['/table']);
      console.log("success1!!!");
      alert('Login successful');
    }else if (username==="hima" && password==="123456"){
      console.log("Success2!!!");
      this.router.navigate(['/table']);
    } else if (username==="admin" && password==="admin"){
      console.log("Success3!!!");
      this.router.navigate(['/table']);
    } else {
      console.log("error");
    }*/

    console.log('data');
    console.log(data);
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }
    this._http.post(this.ServiceUrl, data)
      .subscribe(res => {
        let result: any = {};
        result = res;
        console.log('result:');
        console.log(result);
        console.log(result.status);
        console.log('result.status');
        console.log(result.item[0]._id);
        // this.cookieService.set('username', result.item[0].username);
        this.cookieService.set('id', result.item[0]._id);

        if (result.status == 'success') {
          this.router.navigate(['/table']);
        }
        console.log('result.res:');
        console.log(result.res);
        console.log('data');
        console.log(data);

      }, error => {
        console.log('Oooops!');
      });
    this.myForm.reset();

  }

}
