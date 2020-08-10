import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account } from 'src/app/interfaces/account';
import { TransactionType } from 'src/app/interfaces/transactiontype';

@Component({
  selector: 'app-transaction-review',
  templateUrl: './transaction-review.component.html',
  styleUrls: ['./transaction-review.component.css']
})
export class TransactionReviewComponent implements OnInit {

  @Input() formGroup: FormGroup;
  account: Account;
  date: Date;
  amount: number;
  tranType: TransactionType;

  constructor() { }

  ngOnInit() {
    console.log(this.formGroup);

    // Seed with initial values
    this.account = this.formGroup.get('tranAcctForm').get('tranAccount').value;
    this.amount = this.formGroup.get('tranDetailsForm').get('tranAmount').value;
    this.date = this.formGroup.get('tranDetailsForm').get('tranDate').value;
    this.tranType = this.formGroup.get('tranDetailsForm').get('tranType').value;

    // Sync up our member vars with the form vals
    this.formGroup.get('tranAcctForm').get('tranAccount').valueChanges.subscribe(newAcct => this.account = newAcct);
    this.formGroup.get('tranDetailsForm').get('tranAmount').valueChanges.subscribe(newAmount => this.amount = newAmount);
    this.formGroup.get('tranDetailsForm').get('tranDate').valueChanges.subscribe(newDate => this.date = newDate);
    this.formGroup.get('tranDetailsForm').get('tranType').valueChanges.subscribe(newType => this.tranType = newType);
  }

}
