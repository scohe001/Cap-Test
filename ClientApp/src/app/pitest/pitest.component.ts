import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountmanagerService } from '../accountmanager.service';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import {TransactionType} from '../interfaces/transactiontype';
import { DataSet, DataPoint } from '../interfaces/graphdata';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

const moment = _moment;
type Moment = _moment.Moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  // parse: {
  //   dateInput: 'MM/DD/YYYY',
  // },
  // display: {
  //   dateInput: 'MM/DD/YYYY',
  //   monthYearLabel: 'MMM D YYYY',
  //   dateA11yLabel: 'LL',
  //   monthYearA11yLabel: 'MMMM Do YYYY',
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

  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];

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

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // Initialize to a graph by month (in prod, should probably do by week and then initialize to last 3 months)
  startDate = new FormControl(moment(new Date('01/01/2014')));
  endDate = new FormControl(moment(new Date('09/10/2015')));
  moneyGraphGroupBy: string = "Month";

  constructor(private accountManager: AccountmanagerService,) { }

  async ngOnInit() {
    // In production, do this. And then maybe call for the last 3 months? That'd be cute
    // let tranTypes: TransactionType[] = await this.accountManager.GetTransactionTypes();
    // this.lineData = tranTypes.map(tranType => { return {name: tranType.Name, series: [{name: new Date(), value: 0}]}; });

    // For testing, just set stuff up initially
    await this.thing();
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

  async thing() { 
    console.log("Oh. So you clicked me.");
    console.log(this.startDate.value);

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
    // switch(this.moneyGraphGroupBy) {
    //   case "Day":
    //     // this.lineData = this.moneyDataByDay.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    //     this.lineData = this.moneyDataByDay;
    //     break;
    //   case "Week":
    //     // this.lineData = this.moneyDataByWeek.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    //     this.lineData = this.moneyDataByWeek;
    //     break;
    //   case "Month":
    //     // this.lineData = this.moneyDataByMonth.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    //     this.lineData = this.moneyDataByMonth;
    //     break;
    // }
    // console.log(this.lineData);
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
