import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';

import { AccountmanagerService } from '../services/accountmanager.service';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { CommonService } from '../services/common.service';

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
    private transactionManager: TransactionmanagerService,
    private commonManager: CommonService,
    private fb: FormBuilder,) { }

  public passedAccount: Account = null;

  tranTypes: TransactionType[];

  tranForm: FormGroup = this.fb.group({
    tranAcctForm: this.fb.group({
      tranAccount: ['', Validators.required]
    }),
    tranType: ['', Validators.required],
    tranAmount: [-1, Validators.min(0)],
  })

  async ngOnInit() {
    // Make sure we know if account selection changes
    this.tranForm.get('tranAcctForm').get('tranAccount').valueChanges.subscribe(this.acctSelectionChanged);
  } 

  public acctSelectionChanged = (newAcctSelection: any) => {
    if(!newAcctSelection) {
      //empty selection...maybe do something special?
      console.log("Empty acct selection!");
      return;
    }

    // If it's not an account, we don't really care...
    if(!this.accountManager.isObjectAnAccount(newAcctSelection)) { return; }

    // New Account selected!
    let newAcct: Account = newAcctSelection as Account;
    console.log("New selection is: ", newAcct);
    this.selectedAccount = newAcct;
  }

  public thing() {
    console.log(this.tranForm.get('tranAcctForm').get('tranAccount').value);
  }
}
