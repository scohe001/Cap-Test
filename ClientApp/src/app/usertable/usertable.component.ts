import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef, ViewRef, Inject } from '@angular/core';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { FormControl, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ResponsiveService } from '../services/responsive.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit, OnDestroy, AfterViewInit {
  newAccount: Account;
  newTransaction: Transaction;
  accountList: Account[] = null;
  selectedAccount: Account = undefined;
  tranList: Transaction[] = null;
  transactionTypes: TransactionType[] = null;
  selectedTranType: TransactionType = undefined;
  displayedColumns: string[] = ['FirstName', 'LastName', 'PhoneNumber', 'Actions'];
  transactionTypeControl: FormControl =  new FormControl('', Validators.required);
  accountControl: FormControl =  new FormControl('', Validators.required);
  amountControl: FormControl = new FormControl('', Validators.required);

  filterVal: string = "";
  readonly FILTER_VAL_STORAGE_TAG: string = "ACCOUNT_SEARCH_FILTER_VAL";
  readonly PAGINATOR_PAGE_STORAGE_TAG: string = "ACCOUNT_SEARCH_PAGINATOR_PAGE";

  accountTableSource: MatTableDataSource<Account> = new MatTableDataSource<Account>();
  badgeSubscription: Subscription;
  buttonMousedOver: boolean = false;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public accountManager: AccountmanagerService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private dialog: MatDialog,
              private responsiveManager: ResponsiveService,) { }

  ngOnInit() {
    this.ResetInputs();
    this.RefreshTable();
    this.RefreshWindowSize([null, window.innerWidth]);

    this.accountTableSource.paginator = this.paginator;

    this.accountTableSource.sortingDataAccessor = (acct: Account, sortHeader: string) => {
      return sortHeader !== "Total" ? acct[sortHeader].toLowerCase() : acct[sortHeader]; // Ignore case on the sorting
    };
    this.accountTableSource.sort = this.sort;

    this.responsiveManager.onResize$.subscribe(this.RefreshWindowSize);

    let lastFilterVal: string = localStorage.getItem(this.FILTER_VAL_STORAGE_TAG);
    if(lastFilterVal && lastFilterVal != null) {
      this.filterVal = lastFilterVal;
      this.applyFilter();
    }

    // Have to wait for table to come all the way up to update paginator
    setTimeout(() => {
      let lastPaginatorPage: string = localStorage.getItem(this.PAGINATOR_PAGE_STORAGE_TAG);
      if(lastPaginatorPage && lastPaginatorPage != null && /^([0-9]+)$/.test(lastPaginatorPage)) {
        this.setPaginatorPage(Number(lastPaginatorPage));
      }
    });
  }

  ngAfterViewInit() {
    // this.accountTableSource.sort = this.sort;
    // setTimeout(() => this.accountTableSource.sort = this.sort);
  }

  ngOnDestroy() {
  }

  async thing() {
    // window.dispatchEvent(new Event('resize'));
    // console.log('Account List:');
    // console.log(this.accountList);
    // console.log("Seeing val of: ", this.paginatorVal);
  }

  // This is suuuuuper hacky because of a known Angular bug. See here for more: https://github.com/angular/components/issues/8417
  private setPaginatorPage(pageNum: number) {
      let currentPage = this.paginator.pageIndex;
      this.paginator.pageIndex = pageNum;
      this.accountTableSource.paginator.page.emit({
        length: this.paginator.getNumberOfPages(),
        pageIndex: pageNum,
        pageSize: this.paginator.pageSize,
        previousPageIndex: currentPage 
      });
  }

  private async save() {
    console.log('Account List:');
    console.log(this.accountList.slice(0, 10));
    this.ResetInputs();
    this.RefreshTable();
  }

  private ResetInputs() {
    this.newAccount = {Id: undefined, FirstName: '', LastName: '', PhoneNumber: null, Notes: null, Total: null, Transactions: undefined};
  }

  private async RefreshTable() {
    this.accountList = await this.accountManager.GetAccounts(false);
    // this.tranList = await this.accountManager.GetTransactions();
    // this.accountTableSource.data = this.tranList.slice(0, 20);
    this.accountTableSource.data = this.accountList;
    // console.log('Account List:');
    // console.log(this.accountList.slice(0, 10));
  }

  // Super bizarre, but need to do it this way since it's being called as a callback
  private RefreshWindowSize = (vals: [number, number]) => {
    console.log("User table resizing...", this.displayedColumns, vals, this.cdRef);
    if(vals[1] < 525) {
      this.displayedColumns = ['FirstName', 'LastName', 'Total', 'Actions'];
    } else {
      this.displayedColumns = ['FirstName', 'LastName', 'PhoneNumber', 'Total', 'Actions'];
    }
    if (this.cdRef && !(this.cdRef as ViewRef).destroyed) {
      this.cdRef.detectChanges();
    }
  }

  public clearSelection() {
    this.setPaginatorPage(0);
    this.paginatorChangedPage();
    this.filterVal = "";
    this.applyFilter();
  }

  public paginatorChangedPage() {
    localStorage.setItem(this.PAGINATOR_PAGE_STORAGE_TAG, this.paginator.pageIndex.toString());
  }

  public applyFilter() {
    if(this.filterVal == null) { this.filterVal = "" }
    console.log("Applying filter! With: ", this.filterVal);
    localStorage.setItem(this.FILTER_VAL_STORAGE_TAG, this.filterVal);
    this.accountTableSource.filter = this.filterVal.trim().toLowerCase();
  }

  public AccountClick(acct: Account) {
    console.log(acct);
    console.log("Navigating to: " + 'a/' + acct.Id + '/' + acct.FirstName + acct.LastName);
    this.router.navigate(['a/' + acct.Id + '/' + acct.FirstName + acct.LastName]);
  }

  public DeleteClicked(acct: Account) {
    console.log("Delete clicked for", acct);
    this.dialog.open(AreYouSureDeleteDialog, {
      data: acct
    });
  }

  private MouseIn() {
    console.log("In!");
  }

  private MouseOut() {
    console.log("Out!");
  }
}

@Component({
  selector: 'are-you-sure-delete-dialog',
  templateUrl: 'are-you-sure-delete-dialog.html',
})
export class AreYouSureDeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public acct: Account) {}
  public deleteAcct() {
    console.log("Deleted!");
  }
}
