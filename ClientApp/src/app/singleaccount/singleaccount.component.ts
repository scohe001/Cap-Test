import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Account } from '../interfaces/account';
import { MatTableDataSource } from '@angular/material';
import { Transaction, TransactionDistribution, RevenueCode_TypeDef } from '../interfaces/transaction';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-singleaccount',
  templateUrl: './singleaccount.component.html',
  styleUrls: ['./singleaccount.component.css'],
})
export class SingleaccountComponent implements OnInit {

  account: Account;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService,
    private commonManager: CommonService,
    private cdRef: ChangeDetectorRef,
    private titleService: Title) { }

  // TODO: Add option for "Account Adjustment" and then give option for Misc or Reversal
  //  Reversal allows to choose a past transaction to reverse (but disallows it if it'd put resale or return balance below 0)
  //  Misc allows free reign. Enter an adjustment amount for Resale and for Return (also disallow either balance going below 0)
  //  Both require a "reason" text field
  async ngOnInit() {
    this.account = await this.GetAccountFromRoute();
    this.titleService.setTitle(`${this.account.FirstName} ${this.account.LastName} - Credit Cache`);
  }

  private async GetAccountFromRoute() {
    let id = this.route.snapshot.paramMap.get('id');
    let acct: Account =  await this.accountManager.GetAccount(id);

    // If it's bad, go back to account search
    if(!acct) {
      this.router.navigate(['/accounts']);
      return null;
    }

    return acct;
  }

  thing() {
    console.log(this.account);
  }
}
