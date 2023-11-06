import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Invoicestatus} from "../entity/invoicestatus";

@Injectable({
  providedIn: 'root'
})

export class Invoicestatusservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Invoicestatus>> {

    const invoicestatuses = await this.http.get<Array<Invoicestatus>>('http://localhost:8080/invoicestatuses/list').toPromise();
    if(invoicestatuses == undefined){
      return [];
    }
    return invoicestatuses;
  }

}


