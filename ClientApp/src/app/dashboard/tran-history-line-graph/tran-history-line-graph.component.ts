import { Component, OnInit, Input } from '@angular/core';
import { AccountmanagerService } from 'src/app/accountmanager.service';
import { DataSet } from 'src/app/interfaces/graphdata';

@Component({
  selector: 'app-tran-history-line-graph',
  templateUrl: './tran-history-line-graph.component.html',
  styleUrls: ['./tran-history-line-graph.component.css']
})
export class TranHistoryLineGraphComponent implements OnInit {
  @Input() colorScheme: any;

  view: any[] = [1000, 500];
  moneyGraphGroupBy: string = "Month";

  moneyDataByDay: DataSet[];
  moneyDataByWeek: DataSet[];
  moneyDataByMonth: DataSet[];

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

    // For some reason the dates don't want to convert coming over, so we have to do it manually
    this.moneyDataByDay = await this.accountManager.GetTransactionDataByDay(this.startDate, this.endDate);
    this.moneyDataByDay = this.moneyDataByDay.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByWeek = await this.accountManager.GetTransactionDataByWeek(this.startDate, this.endDate);
    this.moneyDataByWeek = this.moneyDataByWeek.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByMonth = await this.accountManager.GetTransactionDataByMonth(this.startDate, this.endDate);
    this.moneyDataByMonth = this.moneyDataByMonth.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
  }

  groupByChanged(event) {
    console.log("Group By");
    console.log(this.moneyGraphGroupBy);
    console.log(event);
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
