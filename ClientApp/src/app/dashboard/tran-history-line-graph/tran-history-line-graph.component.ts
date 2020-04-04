import { Component, OnInit, Input } from '@angular/core';
import { DataSet } from 'src/app/interfaces/graphdata';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';

@Component({
  selector: 'app-tran-history-line-graph',
  templateUrl: './tran-history-line-graph.component.html',
  styleUrls: ['./tran-history-line-graph.component.css']
})
export class TranHistoryLineGraphComponent implements OnInit {
  @Input() colorScheme: any;

  view: any[] = [1000, 500];

  readonly GROUP_BY_MONTH: string = "Month";
  readonly GROUP_BY_WEEK: string = "Week";
  readonly GROUP_BY_DAY: string = "Day";

  moneyGraphGroupBy: string = this.GROUP_BY_MONTH;

  moneyDataByDay: DataSet[];
  moneyDataByWeek: DataSet[];
  moneyDataByMonth: DataSet[];

  constructor(private transactionManager: TransactionmanagerService,) { }

  //#region INPUT dateRange

  private startDate: Date;
  private endDate: Date;

  @Input()
  set dateRange(val: [Date, Date]) {
    if(!val || val == null) { return; }
    this.startDate = val[0];
    this.endDate = val[1];

    this.updateGroupBy();
    this.refreshData();
  }
  
  //#endregion

  ngOnInit() {
    this.updateGroupBy();
    this.refreshData();
  }

  async refreshData() {
    // Looks like this happens on first launch since we're using setters. This'll prevent nasty errors
    if(!this.startDate || !this.endDate) { return }

    // For some reason the dates don't want to convert coming over, so we have to do it manually
    this.moneyDataByDay = await this.transactionManager.GetTransactionDataByDay(this.startDate, this.endDate);
    this.moneyDataByDay = this.moneyDataByDay.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByWeek = await this.transactionManager.GetTransactionDataByWeek(this.startDate, this.endDate);
    this.moneyDataByWeek = this.moneyDataByWeek.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
    this.moneyDataByMonth = await this.transactionManager.GetTransactionDataByMonth(this.startDate, this.endDate);
    this.moneyDataByMonth = this.moneyDataByMonth.map(dataSet => { return {name: dataSet.name, series: dataSet.series.map(series => { return {name: new Date(series.name), value: series.value} })} });
  }

  groupByChanged(event) {
    console.log("Group By");
    console.log(this.moneyGraphGroupBy);
    console.log(event);
  }

  updateGroupBy() {
    let daysDiff: number = (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24);

    if(this.moneyGraphGroupBy === this.GROUP_BY_MONTH && daysDiff < 60) {
      this.moneyGraphGroupBy = this.GROUP_BY_WEEK;
    }
    if(this.moneyGraphGroupBy === this.GROUP_BY_WEEK && daysDiff < 14) {
      this.moneyGraphGroupBy = this.GROUP_BY_DAY;
    }
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

}
