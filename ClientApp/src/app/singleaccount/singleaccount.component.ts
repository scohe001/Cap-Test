import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Account } from '../interfaces/account';
import { MatTableDataSource } from '@angular/material';
import { Transaction, TransactionDistribution, RevenueCode_TypeDef } from '../interfaces/transaction';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-singleaccount',
  templateUrl: './singleaccount.component.html',
  styleUrls: ['./singleaccount.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SingleaccountComponent implements OnInit {

  account: Account;
  transactionTableSource: MatTableDataSource<TranData> = new MatTableDataSource<TranData>();
  displayedColumns: string[] = ['Amount', 'Type', 'Date', 'Total'];

  // For detail expansion
  isExpansionDetailRow = (i: number, row: TranData) => row.detailRow;
  expandedId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService,
    private cdRef: ChangeDetectorRef,) { }

  // TODO: Add option for "Account Adjustment" and then give option for Misc or Reversal
  //  Reversal allows to choose a past transaction to reverse (but disallows it if it'd put resale or return balance below 0)
  //  Misc allows free reign. Enter an adjustment amount for Resale and for Return (also disallow either balance going below 0)
  //  Both require a "reason" text field
  async ngOnInit() {
    this.RefreshTable();
  }

  thing() {
    console.log(this.account);
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

  private async RefreshTable() {
    // TODO: add some validation around the id from route. Make sure it's actually a good id (a positive integer) (see register for a good example)
    let id = this.route.snapshot.paramMap.get('id');
    this.account = await this.accountManager.GetAccount(id);
    // Duplicate each row. One is main, one is hidden detail
    this.transactionTableSource.data = this.account.Transactions.map(tran => [{ detailRow: false, tran: tran }, { detailRow: true, tran: tran }]).flat();
    console.log(this.transactionTableSource.data);
  }
}

interface TranData {
  tran: Transaction;
  detailRow: boolean;
}
