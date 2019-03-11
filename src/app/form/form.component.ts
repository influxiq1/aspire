import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  myForm: FormGroup;
  myForm1: FormGroup;
  submitted = false;

  fulllink = 'https://nodessl.influxiq.com:6011/addorupdatedata';

  private ServiceUrl = 'https://nodessl.influxiq.com:6011/datalist';
  public surl = 'https://nodessl.influxiq.com:6011/temptoken';
  selection: any;
  columns = [];
  displayedColumns: any;
  categorylist: any=[];
  plist: any=[];
  // public user1: any;
  private user;
  private cookieServic: CookieService;
  // selection: any;
  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  x: any;
  public token='';
  constructor(private formBuilder: FormBuilder, private _http: HttpClient, cookieServic: CookieService) {
    this.cookieServic = cookieServic;

    // this.user=cookieServic.get('');
  }
  /*public set user1(value: string) {
    this.user = value;
    this.cookieService.set("user1", value);
  }*/

  ngOnInit() {



    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      option: ['', Validators.required],
      dis: ['', Validators.required]
    },
      {
      // validator: MustMatch('password', 'confirmPassword')
    });

    this.myForm1 = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      dis: ['', Validators.required]
    }, {
      // validator: MustMatch('password', 'confirmPassword')
    });

    this._http.post(this.surl,{} ).forEach(res => {
      let result: any = {};
      result = res;
      this.token = result.token;
      console.log(result);

      this._http.post(this.ServiceUrl, {source: 'category', token: this.token } ).forEach(res => {
        let result: any = {};
        result = res;
        console.log(result);
        let x = (result);
        this.x = x;
        console.log("x");
        this.categorylist=result.res;
        console.log("res");
        console.log(res);
        console.log(result);
        console.log(result.res);
        //this.createdatatsourceobjable(result.res);
      });
      this._http.post(this.ServiceUrl, {source: 'category_view', token: this.token ,condition:{'categoryid_object': '5c7f8ae1a06f291d810c135c'}} ).forEach(res => {
        let result: any = {};
        result = res;
        console.log(result);
        let x = (result);
        this.x = x;
        console.log("x");
        this.plist=result.res;
        this.createdatatsourceobjable(result.res);

      });

    });
  }

  // convenience getter for easy access to form fields
  // get f() { return this.myForm.controls; }

  onSubmit() {
    let x: any;
    let data = this.myForm.value;
    console.log("form val");
    console.log(data);
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }

    // const link = "http://localhost:3000/aspire";

    console.log("hjgd");

    console.log(this.fulllink);


    this._http.post(this.fulllink, { data: data, source: 'category', sourceobj:[]})
      .subscribe(res => {
        let result: any = {};
        result = res;
        console.log('result:');
        console.log(result);
      }, error => {
        console.log('Oooops!');
      });


    /*this._http.get(this.fulllink, data).subscribe(res => {
      let result: any = {};
      result = res;
      console.log('result: get', result);
      console.log(result);
      let x= (result);
      this.x = x;
      console.log("x");
      console.log(x);
    }, error => {
      console.log('Oooops!');
    });*/



    // this.myForm.reset();
  }

  onSubmit1() {
    let x: any;
    let data = this.myForm1.value;
    console.log("form val");
    console.log(data);
    for (x in this.myForm1.controls) {
      this.myForm1.controls[x].markAsTouched();
    }

    // const link = "http://localhost:3000/aspire";

    console.log("hjgd");

    console.log(this.fulllink);


    this._http.post(this.fulllink, { data: data, source: 'product', sourceobj: ['category']})
      .subscribe(res => {
        let result: any = {};
        result = res;
        // this.cookieServic.set('userdetails', JSON.stringify(result.msg));
        console.log('result succes');
        console.log(result.res);
      }, error => {
        console.log('Oooops!');
      });


    /*this._http.get(this.fulllink, data).subscribe(res => {
      let result: any = {};
      result = res;
      console.log('result: get', result);
      console.log(result);
      let x= (result);
      this.x = x;
      console.log("x");
      console.log(x);
    }, error => {
      console.log('Oooops!');
    });*/



    // this.myForm1.reset();
  }

  refreshdatatable(data: any) {
    let data_list = [];
    for (let i = 0; i < data.length; i++) {
      data_list.push(this.createData(data[i]));
    }

    this.dataSource = new MatTableDataSource(data_list);
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  createdatatsourceobjable(data: any) {

    console.log('in create table');
    console.log(data);
    let x = data;
    console.log(x);
    this.x = x;

    let temp = [];
    let keys = x[0];
    temp = Object.keys(keys);
    let coldef_list = [];
    let header_list = [];
    for (let i = 0; i < temp.length; i++) {
      coldef_list.push(temp[i].replace(/\s/g, "_"));
      header_list.push(temp[i]);
    }
    // coldef_list.push('Actions');
    // header_list.push('Actions')
    console.log('coldef_list', coldef_list);
    console.log('header_list', header_list);

    for (let i = 0; i < coldef_list.length; i++) {
      let ff = `row.${coldef_list[i]}`;
      var tt = {
        columnDef: `${coldef_list[i]}`,
        header: `${header_list[i].replace(/_/g, " ")}`,
        cell: (row) => eval(ff),
        objlength: header_list.length
      };
      this.columns.push(tt);
    }
    let displayedcols = this.columns.map(x => x.columnDef);
    displayedcols.push('Actions');

    this.displayedColumns = displayedcols;
    this.displayedColumns.unshift('select');

    let data_list = [];
    for (let i = 0; i < this.x.length; i++) {
      data_list.push(this.createData(x[i]));
    }

    this.dataSource = new MatTableDataSource(data_list);
    this.selection = new SelectionModel(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  } // end createdatatable

  isAllSelected() {

    // console.log('adfadfasfaf');

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  } // end isAllSelected
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  } // end masterToggl

  createData(point) {
    let data = {};
    Object.keys(point).forEach( function (key) {
      data[key.replace(/\s/g, '_')] = point[key];
    });
    return data;
  } // end createData

  styleCell(col_name, row) {

    /*
     if (col_name['columnDef']=='progress' && row['progress']=='100'){
     return {'color' : 'red'}
     } else {
     return {}
     }
     */


    return {};
  } // end styleCell

}
