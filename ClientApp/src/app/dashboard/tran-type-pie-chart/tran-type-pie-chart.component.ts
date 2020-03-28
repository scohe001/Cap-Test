import { Component, OnInit, Input } from '@angular/core';
import { DataPoint } from 'src/app/interfaces/graphdata';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';

@Component({
  selector: 'app-tran-type-pie-chart',
  templateUrl: './tran-type-pie-chart.component.html',
  styleUrls: ['./tran-type-pie-chart.component.css']
})
export class TranTypePieChartComponent implements OnInit {
  @Input() colorScheme: any;
  
  view: any[] = [1000, 500];
  gradient: boolean = true;

  tranTotals: DataPoint[];

  constructor(private transactionManager: TransactionmanagerService,) { }

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
    this.tranTotals = await this.transactionManager.GetTransactionTotals(this.startDate, this.endDate);
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

}
