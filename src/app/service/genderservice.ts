import {Gender} from "../entity/gender";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GenderService {

  constructor(private http: HttpClient) {  }

  // async getAllList(): Promise<Array<Gender>> {
  //
  //   const genders = await this.http.get<Array<Gender>>('http://localhost:8080/genders/list').toPromise();
  //   if(genders == undefined){
  //     return [];
  //   }
  //   return genders;
  // }

  getAllList(): Observable<Gender[]> {
    return this.http.get<Gender[]>('http://localhost:8080/genders/list')
      .pipe(
        catchError((error: any) => {
            return throwError(()=> new Error(error));
        })
      )
  }

}


