import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';
/*declare var $:any;*/

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  public varsubmitmodal: any = false;
  public myForm: FormGroup;
  public closeResult: string;
  // private cookieService1: CookieService;
  public submitted = false;
  fulllink = 'https://nodessl.influxiq.com:6011/addorupdatedata';
  public x: any;
  // public usercookie: any;
  // public _url = "http://localhost:3000";
  /* private content: any;
  @ViewChild('target') target: any;*/

  constructor(public   modalService: NgbModal,
              public router: Router,
              private _http: HttpClient,
              private route: ActivatedRoute, /*cookieService: CookieService,*/
              private fb: FormBuilder) {
    /*this.cookieService1=cookieService;
    this.cookieService1.get('id');
    this.usercookie = this.cookieService1.get('id');*/
  }

  ngOnInit() {
    /*if (this.usercookie == ''){
      this.router.navigate(['/login']);
    }*/

    this.myForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone_number: ['', Validators.compose( [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)])],
      emailaddress: ['', Validators.compose([Validators.required, Validators.pattern(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)])],
      grossrevinue: ['', Validators.required],
      clevelexecutive: ['', Validators.required],
      radio: []

    });
  }


/*  submitmodal(){
    this.varsubmitmodal=true;
  }*/




  onSubmit() {
    let x: any;
    let data = this.myForm.value;
    console.log("gsfdhj");
    console.log(data);
    for (x in this.myForm.controls) {
      this.myForm.controls[x].markAsTouched();
    }

    // const link = "http://localhost:3000/aspire";

    console.log("hjgd");

    console.log(this.fulllink);


    this._http.post(this.fulllink, { data: data, source: 'landing', sourceobj:[]})
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



    this.myForm.reset();
  }




// --------modal-----//


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
