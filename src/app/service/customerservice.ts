import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Customer} from "../entity/customer";

@Injectable({
  providedIn: 'root'
})

export class Customerservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Customer>> {

    const customers = await this.http.get<Array<Customer>>('http://localhost:8080/customers/list').toPromise();
    if(customers == undefined){
      return [];
    }
    return customers;
  }

}


