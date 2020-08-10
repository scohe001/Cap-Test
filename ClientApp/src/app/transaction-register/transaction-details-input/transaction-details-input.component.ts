import { Component, OnInit, Input } from '@angular/core';
import { TransactionType, TranType_TypeDef } from 'src/app/interfaces/transactiontype';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';
import { FormGroup, FormControl, Form } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AccountmanagerService } from 'src/app/services/accountmanager.service';
import { Account } from 'src/app/interfaces/account';

@Component({
  selector: 'app-transaction-details-input',
  templateUrl: './transaction-details-input.component.html',
  styleUrls: ['./transaction-details-input.component.css']
})
export class TransactionDetailsInputComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() account: Account;
  public tranTypeCtrl: FormControl;
  public tranAmountCtrl: FormControl;

  constructor(
    private tranManager: TransactionmanagerService,
    private accountManager: AccountmanagerService,
    private currencyPipe: CurrencyPipe,
  ) { }

  tranTypes: TransactionType[];

  async ngOnInit() {
    let allTypes: TransactionType[] = await this.tranManager.GetTransactionTypes();
    this.tranTypes = !allTypes ? [] : allTypes.filter(tt => !tt.IsSystemType);

    this.tranTypeCtrl = this.formGroup.get('tranType') as FormControl;
    this.tranAmountCtrl = this.formGroup.get('tranAmount') as FormControl;

    this.formGroup.get('tranType').valueChanges.subscribe(this.tranTypeSelected);

    if(this.tranTypes) {
      // populate initial value
      this.formGroup.patchValue({
        tranType: this.tranTypes.find(tt => tt.Id === TranType_TypeDef.PURCHASE_ID),
        tranAmount: '$-1.00',
      })
    }
  }

  // When they tab out/click away from the amount, format it like a money val
  public validateAmountField = () => {
    let currentAmountVal: string = this.tranAmountCtrl.value;

    if(! /^(-?\$?[0-9]+\.?[0-9]*)$/.test(currentAmountVal)) {
      //Bad number format
      currentAmountVal = '0';
    }

    if(!this.tranTypeCtrl.value) { return; }

    if((this.tranTypeCtrl.value.Id == TranType_TypeDef.PURCHASE_ID 
        || this.tranTypeCtrl.value.Id == TranType_TypeDef.CASHOUT_ID)
        && ! /^-/.test(currentAmountVal)) {
          // Add a negative sign
          currentAmountVal = '-' + currentAmountVal;
    }
    else if((this.tranTypeCtrl.value.Id == TranType_TypeDef.RESALE_ID 
        || this.tranTypeCtrl.value.Id == TranType_TypeDef.RETURN_ID)
        && /^-/.test(currentAmountVal)) {
          // Chop the negative sign off
          currentAmountVal = currentAmountVal.slice(1);
    }

    //Kill the dollar sign if one exists...
    currentAmountVal = currentAmountVal.replace(/\$/g, '');

    this.formGroup.patchValue({
      tranAmount: this.currencyPipe.transform(currentAmountVal),
    })
  }

  private tranTypeSelected = (tt: TransactionType) => {
    if(tt && tt.Id === TranType_TypeDef.CASHOUT_ID) {
      this.cashOutSelected();
    } else {
      this.tranAmountCtrl.enable()
    }

    this.validateAmountField();
  }

  private async cashOutSelected() {
    this.accountManager.GetAccountCashoutValue(this.account.Id.toString()).then(cashoutVal => {
      this.formGroup.patchValue({
        tranAmount: cashoutVal.toString()
      });
      this.tranAmountCtrl.disable()
      this.validateAmountField();
    });
  }
}
