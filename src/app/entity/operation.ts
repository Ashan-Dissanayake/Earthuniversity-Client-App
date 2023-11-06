import {Module} from "./module";

export class Operation {

  public id !: number;
  public name !: string;
  public moduleByModuleId!:Module;

  constructor(id:number,name:string,moduleByModuleId:Module) {
    this.id=id;
    this.name=name;
    this.moduleByModuleId = moduleByModuleId;
  }

}


