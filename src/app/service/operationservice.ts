import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Operation} from "../entity/operation";

@Injectable({
  providedIn: 'root'
})

export class Operationservice{

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Operation>> {

    const operations = await this.http.get<Array<Operation>>('http://localhost:8080/operations/list').toPromise();
    if(operations == undefined){
      return [];
    }
    return operations;
  }

}


