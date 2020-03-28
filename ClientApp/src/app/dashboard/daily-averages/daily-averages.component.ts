import { Component, OnInit, Input } from '@angular/core';
import { DataSet } from 'src/app/interfaces/graphdata';
import { AccountmanagerService } from 'src/app/accountmanager.service';

@Component({
  selector: 'app-daily-averages',
  templateUrl: './daily-averages.component.html',
  styleUrls: ['./daily-averages.component.css']
})
export class DailyAveragesComponent implements OnInit {
  @Input() colorScheme: any;
  
  view: any[] = [1000, 500];
  gradient: boolean = true;

  weekData: DataSet[];

  constructor(private accountManager: AccountmanagerService,) { }

  //#region INPUT startDate
  private _startDate: Date;

  get startDate(): Date { 
    return this._startDate;
  }
  
  @Input()
  set startDate(val: Date) {
    this._startDate = val;
    this.refreshData();
  }
  //#endregion

  //#region INPUT endDate

  private _endDate: Date;

  get endDate(): Date { 
    return this._endDate;
  }
  
  @Input()
  set endDate(val: Date) {
    this._endDate = val;
    this.refreshData();
  }

  //#endregion

  ngOnInit() {
    this.refreshData();
  }
  
  async refreshData() {
    // Looks like this happens on first launch since we're using setters. This'll prevent nasty errors
    if(!this.startDate || !this.endDate) { return }
    this.weekData = await this.accountManager.GetAveragesForWeekDays(this.startDate, this.endDate);
  }
}
