import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Invoice} from "../../../entity/invoice";
import {Customer} from "../../../entity/customer";
import {Invoicestatus} from "../../../entity/invoicestatus";
import {Item} from "../../../entity/item";
import {Invoicestatusservice} from "../../../service/invoicestatusservice";
import {Customerservice} from "../../../service/customerservice";
import {Itemservice} from "../../../service/itemservice";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Invoiceservice} from "../../../service/invoiceservice";
import {Invoiceitem} from "../../../entity/invoiceitem";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {RegexService} from "../../../service/regexservice";


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  columns: string[] = ['name','customer','date', 'time', 'grandtotal','invoicestatus'];
  headers: string[] = ['Code','Customer', 'Date', 'Time', 'Grand Total','Invoice Status'];
  binders: string[] = ['name','customer.name', 'date', 'time', 'grandtotal','invoicestatus.name'];

  cscolumns: string[] = ['cscode', 'cscustomer','csdate', 'cstime', 'csgrandtotal','csinvoicestatus'];
  csprompts: string[] = ['Search by Code','Search by Customer', 'Search by Date', 'Search by Time',
    'Search by Grand Total','Search by Status'];

  incolumns: string[] = ['name', 'quatity', 'unitprice', 'linetotal', 'remove'];
  inheaders: string[] = ['Name', 'Quantity', 'Unit Price', 'Line Total', 'Remove'];
  inbinders: string[] = ['item.name', 'quantity', 'item.saleprice', 'linetotal', 'getBtn()'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  invoice!:Invoice;
  oldinvoice!:Invoice;

  innerdata:any;
  oldinnerdata:any;

  regexes:any;

  invoices: Array<Invoice> = [];
  data!: MatTableDataSource<Invoice>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Invoiceitem>

  customers: Array<Customer> = [];
  invoicestatuses: Array<Invoicestatus> = [];
  items: Array<Item> = [];

  grandtotal = 0;

  selectedrow: any;

  invoiceitems:Array<Invoiceitem> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private ist:Invoicestatusservice,
    private cs:Customerservice,
    private it:Itemservice,
    private is:Invoiceservice,
    private dg:MatDialog,
    private dp:DatePipe,
    private rs:RegexService
  ) {

    this.uiassist = new UiAssist(this);
    this.invoiceitems = new Array<Invoiceitem>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "cscode": new FormControl(),
      "cstime": new FormControl(),
      "csgrandtotal": new FormControl(),
      "cscustomer": new FormControl(),
      "csinvoicestatus": new FormControl()
    });

    this.form = this.fb.group({
      "customer": new FormControl('',Validators.required),
      "name": new FormControl('',Validators.required),
      "grandtotal": new FormControl('',Validators.required),
      "date": new FormControl('',Validators.required),
      "time": new FormControl('',Validators.required),
      "invoicestatus": new FormControl('',Validators.required)
    }, {updateOn: 'change'});


    this.innerform = this.fb.group({
      "item": new FormControl('',Validators.required),
      "quantity": new FormControl('',Validators.required),
    }, {updateOn: 'change'});


    this.ssearch = this.fb.group({
      "ssitem": new FormControl(),
      "sscustomer": new FormControl(),
      "ssinvoicestatus": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {

    this.createView();

    this.ist.getAllList().then((inst: Invoicestatus[]) => {
      this.invoicestatuses = inst;
    });

    this.cs.getAllList().then((cus: Customer[]) => {
      this.customers = cus;
    });

    this.it.getAll().then((itms: Item[]) => {
      this.items = itms;
    });

    this.rs.get('invoices').then((rgx:any[])=>{
      this.regexes = rgx;
      this.createForm();
    }) ;

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  loadTable(query: string) {

    this.is.getAll(query)
      .then((invs: Invoice[]) => {
        this.invoices = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.invoices);
        this.data.paginator = this.paginator;
      });

  }

  getBtn(element:Invoice){
    return `<button mat-raised-button>Modify</button>`;
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (invoice: Invoice, filter: string) => {
      return(cserchdata.cscode == null || invoice.name.includes(cserchdata.cscode)) &&
        (cserchdata.csdate == null || invoice.date.includes(cserchdata.csdate)) &&
        (cserchdata.cstime == null || invoice.time.includes(cserchdata.cstime)) &&
        (cserchdata.cscustomer == null || invoice.customer.name.includes(cserchdata.cscustomer)) &&
        (cserchdata.csinvoicestatus == null || invoice.invoicestatus.name.toLowerCase().includes(cserchdata.csinvoicestatus)) &&
        (cserchdata.csgrandtotal == null || invoice.grandtotal.toString().includes(cserchdata.csgrandtotal));
    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let customer = sserchdata.sscustomer;
    let statusid = sserchdata.ssinvoicestatus;

    let query = "";

    if (customer != null && customer.trim() != "") query = query + "&customer=" + customer;
    if (statusid != null) query = query + "&statusid=" + statusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

   id = 0;

  btnaddMc() {

    // let quantity = this.form.controls['quantity'].getRawValue();
    // let item = this.form.controls['item'].getRawValue();

    this.innerdata = this.innerform.getRawValue();

    if( this.innerdata != null){

      let linetotal = this.innerdata.quantity * this.innerdata.item.saleprice;

      let invoiceitem = new  Invoiceitem(this.id,this.innerdata.item,this.innerdata.quantity,linetotal);

      let tem: Invoiceitem[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.invoiceitems = [];
      tem.forEach((t)=> this.invoiceitems.push(t));

      this.invoiceitems.push(invoiceitem);
      this.indata = new MatTableDataSource(this.invoiceitems);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  deleteRaw(x:any) {

   // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasource = this.indata.data

    const index = datasource.findIndex(item => item.id === x.id);
    if (index > -1) {
      datasource.splice(index, 1);
    }
    this.indata.data = datasource;
    this.invoiceitems = this.indata.data;

    this.calculateGrandTotal();
  }

  calculateGrandTotal(){

    this.grandtotal = 0;

    this.indata.data.forEach((e)=>{
      this.grandtotal = this.grandtotal+e.linetotal
    })

    this.form.controls['grandtotal'].setValue(this.grandtotal);
  }


  createForm() {

    this.form.controls['customer'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['time'].setValidators([Validators.required]);
    this.form.controls['invoicestatus'].setValidators([Validators.required]);

    this.innerform.controls['item'].setValidators([Validators.required]);
    this.innerform.controls['quantity'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldinvoice != undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }


    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.valueChanges.subscribe(value => {

         if (this.oldinnerdata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerdata[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enableButtons(true,false,false);

  }


  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Invoice Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.invoice = this.form.getRawValue();
      this.invoice.invoiceitem = this.invoiceitems;

      // @ts-ignore
      this.invoiceitems.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");
      this.invoice.time = this.invoice.time+":00";

      let invdata: string = "";

      invdata = invdata + "<br>Customer is : " + this.invoice.customer.name
      invdata = invdata + "<br>Grand Total is : " + this.invoice.grandtotal;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Invoice Add",
          message: "Are you sure to Add the following Invoice? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.is.add(this.invoice).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.innerform.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Invoice Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  fillForm(invoice: Invoice) {

    this.enableButtons(false,true,true);

    this.selectedrow=invoice;

    this.invoice = JSON.parse(JSON.stringify(invoice));
    this.oldinvoice = JSON.parse(JSON.stringify(invoice));

    //@ts-ignore
    this.invoice.customer = this.customers.find(c => c.id === this.invoice.customer.id);

    //@ts-ignore
    this.invoice.invoicestatus = this.invoicestatuses.find(s => s.id === this.invoice.invoicestatus.id);

    this.indata = new MatTableDataSource(this.invoice.invoiceitem);

    this.form.patchValue(this.invoice);
    this.form.markAsPristine();

  }


  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;

  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Invoice Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();
      console.log(updates);

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Invoice Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.invoice = this.form.getRawValue();

            // @ts-ignore
            delete this.invoice.quantity;

            // @ts-ignore
            delete this.invoice.item;

            this.invoice.invoiceitem = this.invoiceitems;

            // @ts-ignore
            this.invoiceitems.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");

            this.is.update(this.invoice).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.innerform.reset();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Invoice Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Invoice Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Invoice Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.invoice.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.is.delete(this.invoice.name).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.innerform.reset();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Invoice Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
          });

        });
      }
    });
  }

}
