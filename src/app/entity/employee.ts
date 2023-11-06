import {Gender} from "./gender";
import {Designation} from "./designation";
import {Employeestatus} from "./employeestatus";

export class Employee{

  public id !: number;
  public fullname !: string;
  public number !: string;
  public callingname !: string;
  public photo !: string;
  public dobirth !: string;
  public nic !: string;
  public address !: string;
  public mobile !: string;
  public land !: string;
  public doassignment !: string;
  public description !: string;
  public gender !: Gender;
  public designation !: Designation;
  public employeestatus !: Employeestatus;


  constructor(id:number, fullname:string, number:string,
              callingname:string, photo:string, dobirth:string,
              nic:string, address:string, mobile:string,
              land:string, doassignment:string, description:string,
              gender:Gender, designation:Designation,
              employeestatus:Employeestatus ) {

    this.id=id;
    this.fullname=fullname;
    this.number=number;
    this.callingname=callingname;
    this.photo=photo;
    this.dobirth=dobirth;
    this.nic=nic;
    this.address=address;
    this.mobile=mobile;
    this.land=land;
    this.doassignment=doassignment;
    this.description=description;
    this.gender=gender;
    this.designation=designation;
    this.employeestatus=employeestatus;
  }


}





