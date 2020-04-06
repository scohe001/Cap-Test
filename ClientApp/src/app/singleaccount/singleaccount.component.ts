import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Account } from '../interfaces/account';
import { MatTableDataSource } from '@angular/material';
import { Transaction } from '../interfaces/transaction';
import { TransactionmanagerService } from '../services/transactionmanager.service';

@Component({
  selector: 'app-singleaccount',
  templateUrl: './singleaccount.component.html',
  styleUrls: ['./singleaccount.component.css']
})
export class SingleaccountComponent implements OnInit {

  account: Account;
  newTransaction: Transaction;
  transactionTableSource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>();
  displayedColumns: string[] = ['Amount', 'Type', 'Date', 'Total'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService) { }

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

  private async RefreshTable() {
    // TODO: add some validation around the id from route. Make sure it's actually a good id (a positive integer)
    let id = this.route.snapshot.paramMap.get('id');
    this.account = await this.accountManager.GetAccount(id);
    this.transactionTableSource.data = this.account.Transactions;
  }
}
