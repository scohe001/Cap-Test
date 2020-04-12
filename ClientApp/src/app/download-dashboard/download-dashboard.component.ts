import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionType, TranType_TypeDef } from '../interfaces/transactiontype';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-download-dashboard',
  templateUrl: './download-dashboard.component.html',
  styleUrls: ['./download-dashboard.component.css'],
})
export class DownloadDashboardComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private tranManager: TransactionmanagerService,
              private currencyPipe: CurrencyPipe) { }

  // boring way:
  // tranForm: FormGroup = new FormGroup({
  //   tranType: new FormControl(''),
  //   tranAmount: new FormControl(0),
  // });

  tranTypes: TransactionType[];

  // cool way:
  tranForm: FormGroup = this.fb.group({
    tranType: ['', Validators.required],
    tranAmount: ['$15.00', Validators.min(0.01)],
  })

  async ngOnInit() {
    this.tranTypes = (await this.tranManager.GetTransactionTypes()).filter(tt => !tt.IsSystemType);
    // Initialize to purchase
    this.tranForm.patchValue({
      tranType: this.tranTypes.find(tt => tt.Id === TranType_TypeDef.PURCHASE_ID),
    });

    this.tranForm.get('tranType').valueChanges.subscribe(this.tranTypeSelected);
  }

  onSubmit() {
    this.validateAmountField(); // Make sure to validate before submission
    console.log("Submitting! With: ", this.tranForm.value);
    console.log(this.tranForm.value.tranType);
  }

  thing() {
    this.tranForm.patchValue({
      tranType: this.tranTypes.find(tt => tt.Id === TranType_TypeDef.PURCHASE_ID),
      tranAmount: 72,
    });
  }

  cashOutSelected() {
    this.tranForm.patchValue({
      tranAmount: 29.72,
    });
    this.tranForm.get('tranAmount').disable()
  }

  // When they tab out/click away from the amount, format it like a money val
  validateAmountField() {
    let currentAmountVal: string = this.tranForm.get('tranAmount').value;
    if(! /^([0-9]+\.?[0-9]*)$/.test(currentAmountVal)) {
      //Bad number format
      currentAmountVal = '0';
    }

    this.tranForm.patchValue({
      tranAmount: this.currencyPipe.transform(currentAmountVal)
    })
  }

  // Formatted like this since it's being used as a callback
  tranTypeSelected = (tt: TransactionType) => {
    if(tt && tt.Id === TranType_TypeDef.CASHOUT_ID) {
      this.cashOutSelected();
    } else {
      this.tranForm.get('tranAmount').enable()
    }
  }

}
