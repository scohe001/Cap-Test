import { Component, OnInit, ViewChild, Inject, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';

import { AccountmanagerService } from '../services/accountmanager.service';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType, TranType_TypeDef } from '../interfaces/transactiontype';
import { CommonService, HttpStatusCodeResponse } from '../services/common.service';
import { MatStepper, MatSnackBar, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';

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
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBarManager: MatSnackBar,
    private titleService: Title) { }

  @ViewChild('stepper',  {static: false}) private tranStepper: MatStepper;

  selectedAccount: Account = null;

  tranForm: FormGroup = this.fb.group({
    tranAcctForm: this.fb.group({
        tranAccount: ['', Validators.required],
    }),
    tranDetailsForm: this.fb.group({
      tranType: ['', Validators.required],
      tranAmount: ['$15.00', Validators.min(0.01)],
      tranDate: [new Date(), Validators.required],
    }),
  });

  async ngOnInit() {
    this.titleService.setTitle("Transaction Register - Credit Cache");
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
    console.log("Raw form val is: ", this.tranForm.getRawValue());
  }

  private currencyToNumber(currency: string) {
    return Number(currency.replace(/[^0-9.-]+/g,""));
  }

  public async onSubmit() {
    let newTransaction: Transaction = {
      Date: this.tranForm.get('tranDetailsForm').get('tranDate').value,
      AccountId: this.tranForm.get('tranAcctForm').get('tranAccount').value.Id,
      Amount: this.currencyToNumber(this.tranForm.get('tranDetailsForm').get('tranAmount').value),
      TransactionTypeId: this.tranForm.get('tranDetailsForm').get('tranType').value.Id, 
      Id: undefined, NewTotal: undefined, Account: undefined, TransactionType: undefined, TransactionDistributions: undefined
    }

    // Raw val includes disabled controls (like in the case of a cash out)
    console.log("Submitted!", this.tranForm.getRawValue());
    console.log("Adding tran: ", newTransaction);

    let result: HttpStatusCodeResponse = await this.transactionManager.AddTransaction(newTransaction);

    if(result.StatusCode === 200) { // Okay!
      this.snackBarManager.open(`Success! Redirecting to ${this.tranForm.get('tranAcctForm').get('tranAccount').value.FirstName}'s account page in 3 seconds...`, "Dismiss", {
        duration: 3000,
      });
      // Wait 3 seconds and then redirect...
      setTimeout(() => this.router.navigate(['/a/', newTransaction.AccountId]), 3000);
    } else {
      console.log(`Error #${result.StatusCode}: ${result.StatusDescription}`);

      this.dialog.open(TranPostingErrorDialog, {
        data: result
      });
    }
  }
}

@Component({
  selector: 'tran-posting-error',
  templateUrl: './tran-posting-error.html',
  styleUrls: ['./transaction-register.component.css'],
})
export class TranPostingErrorDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public result: HttpStatusCodeResponse) {}
}
