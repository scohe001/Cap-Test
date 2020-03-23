import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountmanagerService } from '../accountmanager.service';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import {TransactionType} from '../interfaces/transactiontype';
import { DataSet, DataPoint } from '../interfaces/graphdata';

// TODO: Split this into separate components for each graph.
//  Going to need to learn how to call functions across
//  components to update things.

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';

const moment = _moment;
type Moment = _moment.Moment;

// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'app-pitest',
  templateUrl: './pitest.component.html',
  styleUrls: ['./pitest.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PitestComponent implements OnInit {

  view: any[] = [1000, 500];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  // options
  animations: boolean = true;

  lineData: DataSet[];
  moneyDataByDay: DataSet[];
  moneyDataByWeek: DataSet[];
  moneyDataByMonth: DataSet[];

  weekData: DataSet[];

  tranTotals: DataPoint[];

  // Current scheme: https://coolors.co/8cb369-f4e285-f4a259-5b8e7d-bc4b51
  // But I also enjoy: https://coolors.co/acf39d-e85f5c-9cfffa-773344-e3b5a4
  colorScheme = {
    // default: domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#8CB369', '#F4A259', '#BC4B51', '#5B8E7D']
  };

  // Initialize to a graph by month (in prod, should probably do by week and then initialize to last 3 months)
  startDate = new FormControl(moment(new Date('01/01/2014')));
  endDate = new FormControl(moment(new Date('09/10/2015')));
  moneyGraphGroupBy: string = "Month";

  constructor(private accountManager: AccountmanagerService,) { }

  async ngOnInit() {
    // Populate stuff initially
    await this.refreshData();
  }

  startDateChosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.startDate.value;
    ctrlValue.year(normalizedYear.year());
    this.startDate.setValue(ctrlValue);
  }

  startDateChosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.startDate.setValue(ctrlValue);
    datepicker.close();
  }

  endDateChosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.endDate.value;
    ctrlValue.year(normalizedYear.year());
    this.endDate.setValue(ctrlValue);
  }

  endDateChosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.endDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.endDate.setValue(ctrlValue);
    datepicker.close();
  }

  async refreshData() { 
    this.tranTotals = await this.accountManager.GetTransactionTotals(this.startDate.value.toDate(), this.endDate.value.toDate());
    this.weekData = await this.accountManager.GetAveragesForWeekDays(this.startDate.value.toDate(), this.endDate.value.toDate());

    // For some reason the dates don't want to convert coming over, so we have to do it manually
    this.moneyDataByDay = await this.accountManager.GetTransactionDataByDay(this.startDate.value.toDate(), this.endDate.value.toDate());
    this.moneyDataByDay = this.moneyDataByDay.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByWeek = await this.accountManager.GetTransactionDataByWeek(this.startDate.value.toDate(), this.endDate.value.toDate());
    this.moneyDataByWeek = this.moneyDataByWeek.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByMonth = await this.accountManager.GetTransactionDataByMonth(this.startDate.value.toDate(), this.endDate.value.toDate());
    this.moneyDataByMonth = this.moneyDataByMonth.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });

    this.lineData = this.moneyDataByDay;
    
    console.log(this.lineData);
    console.log("Day data");
    console.log(this.moneyDataByDay);
    console.log("Week data");
    console.log(this.moneyDataByWeek);
    console.log("Month data");
    console.log(this.moneyDataByMonth);
  }

  groupByChanged(event) {
    console.log("Group By");
    console.log(this.moneyGraphGroupBy);
    console.log(event);
  }

  dollarValueFormat(val: number) : string {
    // Find the decimal part
    let decCapture = /\.(\d+)/.exec(val.toFixed(2).toString())
    var decVal: string = '';
    if(decCapture[0].length > 0 && Number(decCapture[0]) > 0) { decVal = '.' + decCapture[0]; }

    // Stick some commas in the integer part
    val = Math.floor(val);
    var intVal: string = (val % 1000).toString();
    val = Math.floor(val/1000);
    while(val > 0) {
      intVal = (val % 1000) + ',' + intVal;
      val = Math.floor(val/1000);
    }

    // Return the final
    return '$' + intVal + decVal;
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
