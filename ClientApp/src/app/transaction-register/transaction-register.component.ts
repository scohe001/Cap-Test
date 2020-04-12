import { Component, OnInit, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';

import { AccountmanagerService } from '../services/accountmanager.service';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType, TranType_TypeDef } from '../interfaces/transactiontype';
import { CommonService } from '../services/common.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-transaction-register',
  templateUrl: './transaction-register.component.html',
  styleUrls: ['./transaction-register.component.css']
})
export class TransactionRegisterComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService,
    private commonManager: CommonService,
    private fb: FormBuilder,) { }

  @ViewChild('stepper',  {static: false}) private tranStepper: MatStepper;

  selectedAccount: Account = null;

  tranForm: FormGroup = this.fb.group({
    tranAcctForm: this.fb.group({
        tranAccount: ['', Validators.required],
    }),
    tranDetailsForm: this.fb.group({
      tranType: ['', Validators.required],
      tranAmount: ['$15.00', Validators.min(0.01)],
    }),
  });

  async ngOnInit() {
    // Make sure we know if account selection changes
    this.tranForm.get('tranAcctForm').get('tranAccount').valueChanges.subscribe(this.acctSelectionChanged);
  } 

  public acctSelectionChanged = (newAcctSelection: any) => {
    if(!newAcctSelection) {
      //empty selection...maybe do something special?
      this.tranStepper.selectedIndex = 0; // Move to Account selection step
      this.selectedAccount = null;
      console.log("Empty acct selection!");
      return;
    }

    // If it's not an account, we don't really care...
    if(!this.accountManager.isObjectAnAccount(newAcctSelection)) { 
      this.selectedAccount = null;
      return;
    }

    // New Account selected!
    setTimeout(() => this.tranStepper.selectedIndex = 1); // Move to next step
    let newAcct: Account = newAcctSelection as Account;
    console.log("New selection is: ", newAcct);
    this.selectedAccount = newAcct;
  }

  public thing() {
    console.log(this.tranForm.get('tranAcctForm').get('tranAccount').value);
  }

  private currencyToNumber(currency: string) {
    return Number(currency.replace(/[^0-9.-]+/g,""));
  }


  public onSubmit() {
    // Raw val includes disabled controls (like in the case of a cash out)
    console.log("Submitted!", this.tranForm.getRawValue());

    let newTransaction: Transaction = {
      Date: new Date(), // TODO: Pull this from a control yet to be made
      AccountId: this.tranForm.get('tranAcctForm').get('tranAccount').value.Id,
      Amount: this.currencyToNumber(this.tranForm.get('tranDetailsForm').get('tranAmount').value),
      TransactionTypeId: this.tranForm.get('tranDetailsForm').get('tranType').value.Id, 
      Id: undefined, NewTotal: undefined, Account: undefined, TransactionType: undefined, TransactionDistributions: undefined
    }

    console.log("Adding tran: ", newTransaction);

    let result = this.transactionManager.AddTransaction(newTransaction);
    console.log("Got back result...", result);

    // TODO: Maybe popup some "Success!" message box for 2 seconds before redirecting to account?
    this.router.navigate(['/a/', newTransaction.AccountId]);
  }
}
