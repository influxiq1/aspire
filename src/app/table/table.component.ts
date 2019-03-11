import {Component, Inject, OnInit, ViewChild, NgModule} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

import { CookieService } from 'ngx-cookie-service';
import {Router} from '@angular/router';

declare var moment:any;
declare var $:any;


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['select', '_id', 'firstname', 'lastname', 'phone_number', 'emailaddress', 'grossrevinue', 'clevelexecutive', 'radio', 'created_at'];
  selection: any;
  columns = [];

  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  x: any;
  public token = '';
  public end_date;
  public start_date;
  public cookieService1: any;
  usercookie: any;
  selectedrowid: any = 0;
  private ServiceUrl = 'https://nodessl.influxiq.com:6011/datalist';
    public surl = 'https://nodessl.influxiq.com:6011/temptoken';
  constructor(public _http: HttpClient, private router: Router, cookieService: CookieService) {
    this.cookieService1 = cookieService;
    console.log(this.cookieService1.get('id'));
    this.usercookie = this.cookieService1.get('id');
    console.log('usercookie');
    console.log(this.usercookie);
  }

  ngOnInit() {


    if ( this.usercookie == ''){
      this.router.navigate(['/login']);
    }
    this._http.get(this.surl,{} ).forEach(res => {
      let result: any = {};
      result = res;
      this.token = result.token;
      console.log(result);

      this._http.post(this.ServiceUrl, {source: 'landing', token: this.token} ).subscribe(res => {
        let result: any = {};
        result = res;
        console.log(result);
        let x = (result);
        this.x = x;
        console.log("x");
        console.log("result.res");
        console.log(result.res);
        this.createtable(result.res);
      });

    });

  }
  convertunixtotimeago(val:any){
    return moment.unix(val).startOf('minute').fromNow();

  }

  unixtodatetimeConverter(flag,UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = (months[a.getMonth()]);
    // if (!) return 1;
    if(month.toString().length==1) month='0'+month;
    var date = (a.getDate());
    if(date<10) var dates='0'+date.toString();
    else var dates=date.toString();
    var hours = (a.getHours());
    if(hours<10) var hour='0'+hours;
    else var hour=hours.toString();
    var min = (a.getMinutes());
    if(min.toString().length==1) var mins='0'+min;
    else var mins=min.toString();
    var sec = (a.getSeconds());
    if(sec.toString().length==1) var secs='0'+sec;
    else var secs=sec.toString();
    var ampm = ((hours) >= 12) ? "PM" : "AM";
    if( flag==0)var time = month + '-' + dates + '-'+year ;
    if( flag==1)var time  =  hour + ':' + mins + ':' + secs+ " "+ampm ;
    return time;
  }



  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  refreshdatatable(data: any) {
    let list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(this.createData(data[i]));
    }
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  createtable(data: any) {

    console.log('in create table');
    console.log(data);
    let x = data;
    this.x = x;
    let temp = [];
    let keys = x[0];
    temp = Object.keys(keys);
    console.log("temp");
    console.log(temp);
    let list = [];
    for (let i = 0; i < this.x.length; i++) {
      list.push(this.createData(x[i]));
    }

    this.dataSource = new MatTableDataSource(list);
    this.selection = new SelectionModel(true, []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  createData(point) {
    let data = {};
    Object.keys(point).forEach( function (key) {
      data[key] = point[key];
    });
    return data;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onLogout(){
    console.log(this.usercookie);
    this.cookieService1.deleteAll();
    //console.log(this.usercookie);
    this.router.navigate(['/']);
  }
  showValue(){
    console.log("start date");
    console.log(this.start_date);
    console.log(this.end_date);
    console.log(moment(this.start_date).unix());
    console.log(moment(this.end_date).unix());
    if(moment(this.end_date).unix()!=null && moment(this.start_date).unix()!=null ) {
      this._http.post(this.ServiceUrl, {
        token: this.token,
        source: 'landing',
        condition: {
          'created_at': {
            $lte: moment(this.end_date).unix() + (24 * 60 * 60),
            $gte: moment(this.start_date).unix()
          }
        }
      }).subscribe(res => {
        let result: any = {};
        result = res;
        console.log(result);
        let x = (result);
        this.x = x;
        console.log("x");
        console.log("result.res");
        console.log(result.res);
        this.createtable(result.res);

      });
    }else
      console.log("error");

  }

  downloadcsv(){
    console.log(this.dataSource.filter);
    console.log(this.dataSource);
    console.log(this.dataSource.filteredData);
    //$('table').table2CSV();
    var test_array = [["name1", 2, 3], ["name2", 4, 5], ["name3", 6, 7], ["name4", 8, 9], ["name5", 10, 11]];
    var fname = "IJGResults";
    console.log(test_array);
    console.log('this.dataSource.filteredData');
    console.log(this.dataSource.filteredData);
    let temparr:any=[];
    for(let v in this.dataSource.filteredData){
      //Object.entries(obj);
      // @ts-ignore
      this.dataSource.filteredData[v].created_at=this.unixtodatetimeConverter(0,this.dataSource.filteredData[v].created_at);
      temparr.push(Object.entries(this.dataSource.filteredData[v]));
    }
    console.log(temparr);

    var csvContent = "data:text/csv;charset=utf-8,";
    temparr.forEach(function(infoArray, index){
      console.log('index');
      console.log(index);
      let dataString = infoArray.join(",");
      csvContent += index < infoArray.length ? dataString+ "\n" : dataString;
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

  }



}
