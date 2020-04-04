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

  async ngOnInit() {
    this.ResetInputs();
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

  ResetInputs() {
    this.newTransaction = {Id: undefined, Date: undefined, AccountId: undefined,
                            Account: undefined, Amount: 0, TransactionTypeId: undefined, TransactionType: undefined};
  }

}
