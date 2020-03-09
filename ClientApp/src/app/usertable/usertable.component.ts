import { Component, OnInit } from '@angular/core';
import { AccountmanagerService, Account } from '../accountmanager.service'
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  newAccount: Account;
  accountList: Account[] = null;
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber'];

  constructor(public accountManager: AccountmanagerService) { }

  ngOnInit() {
    this.ResetInputs();
    this.RefreshTable();
  }

  thing() {
    console.log(this.accountList);
  }

  private async save() {
    await this.accountManager.AddAccount(this.newAccount);
    this.ResetInputs();
    this.RefreshTable();
  }

  private ResetInputs() {
    this.newAccount = {Id: undefined, FirstName:'', LastName: '', PhoneNumber: null, Notes: null};
  }

  private async RefreshTable() {
    this.accountList = await this.accountManager.GetAccounts();
  }

}
