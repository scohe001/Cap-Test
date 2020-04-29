import { Component, OnInit } from '@angular/core';
import { DailyAveragesComponent } from './daily-averages/daily-averages.component';
import { ResponsiveService } from '../services/responsive.service';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

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
  public dateRange: [Date, Date] = [new Date('01/01/2014'), new Date('09/10/2015')];
  public startDateCtrl = new FormControl(this.dateRange[0]);
  public endDateCtrl = new FormControl(this.dateRange[1]);

  public dateRangeVal: Date[]; // Going to be unused, but leaving it just in case

  constructor(
    private responsiveManager: ResponsiveService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Dashboard - Credit Cache");
    this.responsiveManager.onResize$.subscribe((vals: [number, number]) => {
    });

    // Initialize it this way so that the val will show in the date range input
    this.dateRangeVal = this.dateRange;
  }

  thing() {
  }

  dateRangeValChange(range: Date[]) {
    console.log("Date range changed to: ", range);
  }

  refresh() {
    if(!this.dateRangeVal || this.dateRangeVal == null || this.dateRangeVal.length < 2) { return; }
    this.dateRange = [this.dateRangeVal[0], this.dateRangeVal[1]];
  }

  public dateChange(newDate, dateIndx) {
    this.dateRange[dateIndx] = newDate;
  }

}
