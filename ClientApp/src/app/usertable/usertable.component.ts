import { Component, OnInit } from '@angular/core';
import { AccountmanagerService } from '../accountmanager.service'
import { TestBed } from '@angular/core/testing';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  newAccount: Account;
  accountList: Account[] = null;
  tranList: Transaction[] = null;
  displayedColumns: string[] = ['amount', 'date', 'type', 'firstName', 'lastName', 'phoneNumber'];

  constructor(public accountManager: AccountmanagerService) { }

  ngOnInit() {
    this.ResetInputs();
    this.RefreshTable();
  }

  thing() {
    console.log(this.accountList);
    console.log(this.tranList);
  }

  private async save() {
    await this.accountManager.AddAccount(this.newAccount);
    this.ResetInputs();
    this.RefreshTable();
  }

  private ResetInputs() {
    this.newAccount = {Id: undefined, FirstName:'', LastName: '', PhoneNumber: null, Notes: null, Transactions: undefined};
  }

  private async RefreshTable() {
    this.accountList = await this.accountManager.GetAccounts();
    this.tranList = await this.accountManager.GetTransactions();
    console.log(this.tranList);
  }

}
