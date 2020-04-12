import { Component, OnInit, Input } from '@angular/core';
import { TransactionType, TranType_TypeDef } from 'src/app/interfaces/transactiontype';
import { TransactionmanagerService } from 'src/app/services/transactionmanager.service';
import { FormGroup, FormControl, Form } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-details-input',
  templateUrl: './transaction-details-input.component.html',
  styleUrls: ['./transaction-details-input.component.css']
})
export class TransactionDetailsInputComponent implements OnInit {

  @Input() formGroup: FormGroup;
  public tranTypeCtrl: FormControl;
  public tranAmountCtrl: FormControl;

  constructor(
    private tranManager: TransactionmanagerService,
    private currencyPipe: CurrencyPipe,
  ) { }

  tranTypes: TransactionType[];

  async ngOnInit() {
    this.tranTypes = (await this.tranManager.GetTransactionTypes()).filter(tt => !tt.IsSystemType);

    this.tranTypeCtrl = this.formGroup.get('tranType') as FormControl;
    this.tranAmountCtrl = this.formGroup.get('tranAmount') as FormControl;

    this.formGroup.get('tranType').valueChanges.subscribe(this.tranTypeSelected);

    // populate initial value
    this.formGroup.patchValue({
      tranType: this.tranTypes.find(tt => tt.Id === TranType_TypeDef.PURCHASE_ID),
      tranAmount: '$0.00',
    })
  }

  // When they tab out/click away from the amount, format it like a money val
  public validateAmountField = () => {
    let currentAmountVal: string = this.tranAmountCtrl.value;

    if(! /^(-?\$?[0-9]+\.?[0-9]*)$/.test(currentAmountVal)) {
      //Bad number format
      currentAmountVal = '0';
    }

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

  private cashOutSelected() {
    this.formGroup.patchValue({
      tranAmount: 29.72,
    });
    this.tranAmountCtrl.disable()
  }
}
