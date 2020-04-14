import { Component, OnInit, Input } from '@angular/core';
import { DataSet } from 'src/app/interfaces/graphdata';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-daily-averages',
  templateUrl: './daily-averages.component.html',
  styleUrls: ['./daily-averages.component.css']
})
export class DailyAveragesComponent implements OnInit {
  @Input() colorScheme: any;
  // Undefined forces dynamic resizing
  dimensions: number[] = undefined;

  readonly SMALLEST_LEGEND_SIZE: number = 700;
  readonly SMALLEST_AXISLABES_SIZE: number = 700;
  readonly SMALLEST_YAXIS_SIZE: number = 700;

  public showLegend: boolean = true;
  public showAxisLabes: boolean = true;
  public showYAxis: boolean = true;

  weekData: DataSet[];

  constructor(
    private transactionManager: TransactionmanagerService,
    private responsiveManager: ResponsiveService,) { }

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
    this.responsiveManager.onResize$.subscribe((vals: [number, number]) => {
      console.log("Daily got an event");
      this.showLegend = vals[1] > this.SMALLEST_LEGEND_SIZE;
      this.showAxisLabes = vals[1] > this.SMALLEST_AXISLABES_SIZE;
      this.showYAxis = vals[1] > this.SMALLEST_YAXIS_SIZE;
    });

    this.refreshData();
  }
  
  async refreshData() {
    // Looks like this happens on first launch since we're using setters. This'll prevent nasty errors
    if(!this.startDate || !this.endDate) { return }
    this.weekData = await this.transactionManager.GetAveragesForWeekDays(this.startDate, this.endDate);
  }
}
