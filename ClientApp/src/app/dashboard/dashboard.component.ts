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

  // Initialize to some nice dates (in prod, should probably do by week and then initialize to last 3 months)
  private dateRange: [Date, Date] = [new Date('01/01/2014'), new Date('09/10/2015')];

  private dateRangeVal: Date[]; // Going to be unused, but leaving it just in case

  constructor() { }

  ngOnInit() {
  }

  thing() {
    if(this.dateRange[0] > new Date('06/06/2014')) {
      this.dateRange = [new Date('01/01/2014'), new Date('09/10/2015')];
    } else {
      this.dateRange = [new Date('01/01/2015'), new Date('09/10/2015')];
    }
  }

  dateRangeValChange(range: Date[]) {
    if(!range || range == null || range.length < 2) { return; }
    this.dateRange = [range[0], range[1]];
  }

}
