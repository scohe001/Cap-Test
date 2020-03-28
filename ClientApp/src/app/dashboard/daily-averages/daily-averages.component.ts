import { Component, OnInit, Input } from '@angular/core';
import { DataSet } from 'src/app/interfaces/graphdata';
import { AccountmanagerService } from 'src/app/services/accountmanager.service';

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

  //#region INPUT dateRange

  private startDate: Date;
  private endDate: Date;

  @Input()
  set dateRange(val: [Date, Date]) {
    if(!val || val == null) { return; }
    this.startDate = val[0];
    this.endDate = val[1];
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
