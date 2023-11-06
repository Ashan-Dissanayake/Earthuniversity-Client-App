import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Item} from "../entity/item";

@Injectable({
  providedIn: 'root'
})

export class Itemservice {

  constructor(private http: HttpClient) {  }

  async getAll(): Promise<Array<Item>> {

    const items = await this.http.get<Array<Item>>('http://localhost:8080/items').toPromise();
    if(items == undefined){
      return [];
    }
    return items;
  }

}


