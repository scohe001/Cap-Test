import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Account } from '../interfaces/account';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Transaction, TransactionDistribution, RevenueCode_TypeDef } from '../interfaces/transaction';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../services/common.service';
import { Title } from '@angular/platform-browser';
import { AreYouSureDeleteDialog } from '../usertable/usertable.component';

@Component({
  selector: 'app-singleaccount',
  templateUrl: './singleaccount.component.html',
  styleUrls: ['./singleaccount.component.css'],
})
export class SingleaccountComponent implements OnInit {

  account: Account;

  colorScheme = {
    // default: domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    domain: ['#8CB369', '#F4A259', '#BC4B51', '#5B8E7D']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountManager: AccountmanagerService,
    private transactionManager: TransactionmanagerService,
    private commonManager: CommonService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
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

  public DeleteClicked() {
    console.log("Delete clicked for", this.account);
    let arysDialog = this.dialog.open(AreYouSureDeleteDialog, {
      data: this.account
    });

    arysDialog.afterClosed().subscribe(x => {
      // Dialog will return true if deleted, else null
      if(x) {
        console.log("Can confirm: DELTED");
        alert("Account successfully deleted. Navigating back to account search...");
        this.router.navigate(['/accounts']);
      }
    });
  }

  public EditClicked() {
    alert("Edit functionality has not yet been built.");
  }

  thing() {
    console.log(this.account);
  }
}
