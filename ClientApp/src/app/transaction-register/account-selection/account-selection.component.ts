import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AccountmanagerService } from 'src/app/services/accountmanager.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account } from '../../interfaces/account';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.css']
})
export class AccountSelectionComponent implements OnInit {

  @Output() accountSelectionChanged: EventEmitter<Account> = new EventEmitter<Account>();

  //#region selectedId
  private idSetManually: boolean = false;
  @Input()
  set selectAccount(acct: Account) {
    if(!acct || acct == null) { return; }
    this.selectedAccount = acct;
    this.acctCtrl.setValue(this.selectedAccount);
    this.acctCtrl.disable();
    this.accountSelectionChanged.emit(this.selectedAccount);
    this.idSetManually = true;
  }
  //#endregion

  acctCtrl = new FormControl();
  filteredAccounts: Observable<Account[]>;

  accountList: Account[] = null;
  selectedAccount: Account = null;

  constructor(private accountManager: AccountmanagerService,) { }

  async ngOnInit() {
    await this.setupAccountDropdown();

    if(!this.idSetManually) {
      this.accountSelectionChanged.emit(null);
    }
  }

  private async setupAccountDropdown() {
    this.accountList = await this.accountManager.GetAccounts(false);
    console.log(this.accountList);

    this.filteredAccounts = this.acctCtrl.valueChanges
      .pipe(map(searchVal => this._filterAccounts(searchVal)));

    if(!this.idSetManually) {
      this.clearSelection();
    }
  }

  public clearSelection() {
    this.acctCtrl.enable();
    // Hacky again to give the field time to enable or view to setup.
    setTimeout(() => this.acctCtrl.setValue(""));
  }

  public openAccount() {
    window.open('/a/' + this.acctCtrl.value.Id, '_blank');
  }

  public acctToString(acct: Account): string {
    if(!acct) return '';
    return acct.FirstName + ' ' + acct.LastName + (acct.PhoneNumber && acct.PhoneNumber.length > 0 ? (' (' + acct.PhoneNumber + ')') : '');
  }

  isAccount(obj: any): obj is Account {
    return obj && obj != null && typeof obj.Id === "number" && typeof obj.FirstName === "string" && typeof obj.LastName === "string";
  }

  private _filterAccounts(searchVal: any): Account[] {
    if(this.isAccount(searchVal)) { 
      if(this.selectedAccount !== searchVal) { // A selection was made!
        this.selectedAccount = searchVal;
        this.accountSelectionChanged.emit(this.selectedAccount);
      }
      return [this.accountList.find( acct => acct.Id === (<Account>searchVal).Id )]
    }

    if(this.selectedAccount !== null) { // Selection was cleared
      this.selectedAccount = null;
      this.accountSelectionChanged.emit(this.selectedAccount);
    }
    if(!searchVal) { return this.accountList.slice(); }

    // Else we have a string, so do the actual filtering...
    const filterVal = (<string>searchVal).toLowerCase();

    let filtered: Account[] = this.accountList.filter(acct => 
      acct.FirstName.toLowerCase().includes(filterVal)
      || acct.LastName.toLowerCase().includes(filterVal)
      || (acct.PhoneNumber && acct.PhoneNumber.toLowerCase().includes(filterVal))
    );
    return filtered;
  }

}
