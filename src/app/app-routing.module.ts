import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {CourseComponent} from "./view/modules/course/course.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {BatchregistrationComponent} from "./view/modules/batchregistration/batchregistration.component";
import {StudentComponent} from "./view/modules/student/student.component";
import {ClassesComponent} from "./view/modules/classes/classes.component";
import {BookdistributionComponent} from "./view/modules/bookdistribution/bookdistribution.component";
import {AttendanceComponent} from "./view/modules/attendance/attendance.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {InvoiceComponent} from "./view/modules/invoice/invoice.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "course", component: CourseComponent},
      {path: "invoice", component: InvoiceComponent},
      {path: "user", component: UserComponent},
      {path:"reports", component: ArrearsByProgramComponent},
      {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path:"batchregistration",component:BatchregistrationComponent},
      {path: "home/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path:"students",component:StudentComponent},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path:"classes",component:ClassesComponent},
      {path: "home/classes", redirectTo: 'classes', pathMatch: 'full'},
      {path:"books",component:BookdistributionComponent},
      {path: "home/books", redirectTo: 'books', pathMatch: 'full'},
      {path:"attendance",component:AttendanceComponent},
      {path: "home/attendance", redirectTo: 'attendance', pathMatch: 'full'},
      {path:"privilege",component:PrivilageComponent},
      {path: "home/privilege", redirectTo: 'attendance', pathMatch: 'full'},
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
