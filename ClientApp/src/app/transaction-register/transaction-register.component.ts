import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';

import { AccountmanagerService } from '../services/accountmanager.service';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';

@Component({
  selector: 'app-transaction-register',
  templateUrl: './transaction-register.component.html',
  styleUrls: ['./transaction-register.component.css']
})
export class TransactionRegisterComponent implements OnInit {

  acctCtrl = new FormControl();
  filteredAccounts: Observable<Account[]>;

  accountList: Account[] = null;
  displayedColumns: string[] = ['FirstName', 'LastName', 'PhoneNumber'];
  selectedAccount: Account = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService) { }

  private id: string;
  async ngOnInit() {
    await this.setupAccountDropdown();

    // Will be null if they haven't come here from an account
    // Setup acct selection if we have an account
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null) {
      this.acctCtrl.setValue(await this.accountManager.GetAccount(this.id))
      this.acctCtrl.disable();
    }
  } 

  private async setupAccountDropdown() {
    this.accountList = await this.accountManager.GetAccounts(false);
    console.log(this.accountList);

    this.filteredAccounts = this.acctCtrl.valueChanges
      .pipe(
        map(searchVal => searchVal ? this._filterAccounts(searchVal) : this.accountList.slice())
      );
    // this.acctCtrl.valueChanges.subscribe(val => console.log("GOT: ", val));

    // Hacky way to have dropdown popup on click (need to wait for accounts to have been gotten)
    setTimeout(() => this.acctCtrl.setValue(""));

  }

  public thing() {
    console.log(this.acctCtrl.value)
  }

  private clearSelection() {
    this.acctCtrl.enable();
    // Hacky again to give the field time to enable. This way when we update the val, it'll open the panel
    setTimeout(() => this.acctCtrl.setValue(""));
  }

  private openAccount() {
    window.open('/a/' + this.acctCtrl.value.Id, '_blank');
  }

  public acctToString(acct: Account): string {
    if(!acct) return '';
    return acct.FirstName + ' ' + acct.LastName + (acct.PhoneNumber && acct.PhoneNumber.length > 0 ? (' (' + acct.PhoneNumber + ')') : '');
  }

  isAccount(obj: any): obj is Account {
    return obj && obj != null && typeof obj.Id === "number" && typeof obj.FirstName === "string" && typeof obj.LastName === "string";
  }

  private _filterAccounts(searchVal: any): Account[] {
    if(!searchVal) { return this.accountList; }
    if(this.isAccount(searchVal)) { 
      console.log("It's an account!", searchVal);
      return [this.accountList.find( acct => acct.Id === (<Account>searchVal).Id )]
    }

    const filterVal = (<string>searchVal).toLowerCase();

    let filtered: Account[] = this.accountList.filter(acct => 
      acct.FirstName.toLowerCase().includes(filterVal)
      || acct.LastName.toLowerCase().includes(filterVal)
      || (acct.PhoneNumber && acct.PhoneNumber.toLowerCase().includes(filterVal))
    );
    return filtered;
  }
}
