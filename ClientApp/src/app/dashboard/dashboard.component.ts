import { Component, OnInit } from '@angular/core';
import { DailyAveragesComponent } from './daily-averages/daily-averages.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Current scheme: https://coolors.co/8cb369-f4e285-f4a259-5b8e7d-bc4b51
  // But I also enjoy: https://coolors.co/acf39d-e85f5c-9cfffa-773344-e3b5a4
  colorScheme = {
    // default: domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#8CB369', '#F4A259', '#BC4B51', '#5B8E7D']
  };

  // startDate = new FormControl(moment(new Date('01/01/2014')));
  // endDate = new FormControl(moment(new Date('09/10/2015')));
  startDate =  new Date('01/01/2014');
  endDate = new Date('09/10/2015');

  constructor() { }

  ngOnInit() {
  }

  thing() {
    if(this.startDate > new Date('06/06/2014')) {
      this.startDate = new Date('01/01/2014');
    } else {
      this.startDate = new Date('01/01/2015');
    }
  }

}
