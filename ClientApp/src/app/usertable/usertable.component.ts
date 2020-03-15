import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { AccountmanagerService } from '../accountmanager.service';
import { TestBed } from '@angular/core/testing';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { FormControl, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit, OnDestroy, AfterViewInit {
  newAccount: Account;
  newTransaction: Transaction;
  accountList: Account[] = null;
  selectedAccount: Account = undefined;
  tranList: Transaction[] = null;
  transactionTypes: TransactionType[] = null;
  selectedTranType: TransactionType = undefined;
  displayedColumns: string[] = ['FirstName', 'LastName', 'PhoneNumber', 'Actions'];
  transactionTypeControl: FormControl =  new FormControl('', Validators.required);
  accountControl: FormControl =  new FormControl('', Validators.required);
  amountControl: FormControl = new FormControl('', Validators.required);

  accountTableSource: MatTableDataSource<Account> = new MatTableDataSource<Account>();
  badgeSubscription: Subscription;
  badgeNum: number = 0;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.RefreshWindowSize();
  }

  constructor(public accountManager: AccountmanagerService,
              private router: Router) { }

  ngOnInit() {
    this.ResetInputs();
    this.RefreshTable();
    this.RefreshDropdowns();
    this.RefreshWindowSize();

    this.badgeSubscription = interval(1000).subscribe(val => this.badgeNum = (this.badgeNum + 30) % 31);
    // this.accountTableSource.sort = this.sort;
    this.accountTableSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    // this.accountTableSource.sort = this.sort;
    setTimeout(() => this.accountTableSource.sort = this.sort);
  }

  ngOnDestroy() {
    this.badgeSubscription.unsubscribe();
  }

  async thing() {
    console.log('Account List:');
    console.log(this.accountList);
    console.log('Inner Width:');
    console.log(this.innerWidth);
  }

  private async save() {
    // this.newAccount.FirstName = 'Tom';
    // this.newAccount.LastName = 'Hudson';
    // await this.accountManager.AddAccount(this.newAccount);
    console.log('Account List:');
    console.log(this.accountList.slice(0, 10));
    this.ResetInputs();
    this.RefreshTable();
  }

  private ResetInputs() {
    this.newAccount = {Id: undefined, FirstName: '', LastName: '', PhoneNumber: null, Notes: null, Transactions: undefined};
    this.newTransaction = {Id: undefined, Date: undefined, AccountId: undefined,
                            Account: undefined, Amount: 0, TransactionTypeId: undefined, TransactionType: undefined};
  }

  private async RefreshTable() {
    this.accountList = await this.accountManager.GetAccounts(false);
    // this.tranList = await this.accountManager.GetTransactions();
    // this.accountTableSource.data = this.tranList.slice(0, 20);
    this.accountTableSource.data = this.accountList;
    console.log('Account List:');
    console.log(this.accountList.slice(0, 10));
  }

  private RefreshWindowSize() {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 275) {
      this.displayedColumns = ['FirstName', 'LastName'];
    } else if(this.innerWidth < 400) {
      this.displayedColumns = ['FirstName', 'LastName', 'Actions'];
    } else {
      this.displayedColumns = ['FirstName', 'LastName', 'PhoneNumber', 'Actions'];
    }
  }

  private async RefreshDropdowns() {
    this.transactionTypes = await this.accountManager.GetTransactionTypes();
    console.log(this.transactionTypes);
  }

  private applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.accountTableSource.filter = filterValue.trim().toLowerCase();
  }

  private AccountClick(acct: Account) {
    console.log(acct);
    this.router.navigate(['a/' + acct.Id]);
  }
}
