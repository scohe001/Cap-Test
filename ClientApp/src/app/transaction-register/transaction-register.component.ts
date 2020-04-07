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

  selectedAccount: Account = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService) { }


  private id: string;
  private passedId: string = null;
  public passedAccount: Account = null;

  async ngOnInit() {
    // Will be null if they haven't come here from an account
    // Setup acct selection if we have an account
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id != null && !(await this.checkAndUpdateId(this.id))) {
      // If checkAndUpdateId returned false, we got a bad Id, so reroute
      this.router.navigate(['/transaction-register']);
    }
  } 

  private async checkAndUpdateId(id: string) {
    if(! (/^([0-9]+)$/.test(id)) ) { return false; }
    let acct: Account = await this.accountManager.GetAccount(id);
    if(acct === null) { return false; }
    this.passedAccount = acct;
    return true;
  }

  public acctSelectionChanged(newAcct: Account) {
    console.log("New selection is: ", newAcct);
    this.selectedAccount = newAcct;
  }

  public thing() {
    // console.log(this.acctCtrl.value)
  }
}
