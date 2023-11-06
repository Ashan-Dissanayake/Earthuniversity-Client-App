import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent{

  constructor(private router: Router) {}

  onPrint() {
    this.router.navigate(['/print']);
  }


}
