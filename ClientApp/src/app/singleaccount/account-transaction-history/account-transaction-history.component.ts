import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from 'src/app/services/accountmanager.service';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material';
import { Transaction, TransactionDistribution, RevenueCode_TypeDef } from 'src/app/interfaces/transaction';
import { Account } from 'src/app/interfaces/account';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-account-transaction-history',
  templateUrl: './account-transaction-history.component.html',
  styleUrls: ['./account-transaction-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountTransactionHistoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService,
    private commonManager: CommonService,
    private cdRef: ChangeDetectorRef,) { }

    public currentAccount: Account;

    @Input()
    set account(val: Account) {
      if(!val) { return; }
      this.currentAccount = val;
      this.RefreshTable();
    }

  transactionTableSource: MatTableDataSource<TranData> = new MatTableDataSource<TranData>();
  displayedColumns: string[] = ['Date', 'Type', 'Amount', 'Total'];

  // For detail expansion
  isExpansionDetailRow = (i: number, row: TranData) => row.detailRow;
  expandedId: number;

  async ngOnInit() {
  }

  private async RefreshTable() {
    // Duplicate each row. One is main, one is hidden detail
    this.transactionTableSource.data = this.currentAccount.Transactions.sort((tranA, tranB) => (tranA.Date < tranB.Date) ? 1 : -1).map(tran => [{ detailRow: false, tran: tran }, { detailRow: true, tran: tran }]).flat();
    console.log(this.transactionTableSource.data);
  }

  private getDistForTran(tran: Transaction, revCodeId: RevenueCode_TypeDef) {
    let dist: TransactionDistribution = tran.TransactionDistributions.find(tranDist => tranDist.RevenueCodeId === revCodeId)
    if(!dist || dist == null) {
      return 0;
    }
    return dist.Amount;
  }

  public getResaleDist(tran: Transaction) {
    return this.getDistForTran(tran, RevenueCode_TypeDef.RESALE_ID);
  }

  public getReturnDist(tran: Transaction) {
    return this.getDistForTran(tran, RevenueCode_TypeDef.RETURN_ID);
  }
}

interface TranData {
  tran: Transaction;
  detailRow: boolean;
}