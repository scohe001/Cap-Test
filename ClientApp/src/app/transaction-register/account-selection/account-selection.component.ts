import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AccountmanagerService } from 'src/app/services/accountmanager.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Account } from '../../interfaces/account';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.css']
})
export class AccountSelectionComponent implements OnInit {

  // Our form group. Should have a control called `tranAccount`
  @Input() formGroup: FormGroup;
  public acctCtrl: FormControl;

  private readonly smallestSize: number = 600;
  public showGridDropdown: boolean = true;

  accountList: Account[] = null;
  filteredAccounts: Observable<Account[]>;

  constructor(
    public accountManager: AccountmanagerService,
    private router: Router,
    private route: ActivatedRoute,
    public responsiveManager: ResponsiveService,) { }

  async ngOnInit() {
    this.acctCtrl = this.formGroup.get('tranAccount') as FormControl;

    this.responsiveManager.onResize$.subscribe((vals: [number, number]) => {
      this.showGridDropdown = vals[1] > this.smallestSize;
    });

    await this.setupAccountDropdown();

    let id: string = this.route.snapshot.paramMap.get('id');
    if(!id) {
      // If they didn't come here from an account, clear selection once so dropdown is ready
      this.clearSelection();
    }
    else if(id != null && !(await this.checkAndUpdateId(id))) {
      // If checkAndUpdateId returned false, we got a bad Id somehow, so reroute
      this.router.navigate(['/transaction-register']);
    }
  } 

  private async checkAndUpdateId(id: string) {
    let passedAccount: Account = await this.accountManager.GetAccount(id);
    this.formGroup.patchValue({
      tranAccount: passedAccount
    });
    // if(passedAccount) { this.acctCtrl.disable(); }
    return passedAccount;
  }

  private async setupAccountDropdown() {
    this.accountList = await this.accountManager.GetAccounts(false);
    console.log(this.accountList);

    this.filteredAccounts = this.acctCtrl.valueChanges
      .pipe(map(searchVal => this._filterAccounts(searchVal)));
  }

  public clearSelection() {
    this.acctCtrl.enable();
    // Hacky to give the field time to enable or view to setup.
    setTimeout(() => this.acctCtrl.setValue(""));
  }

  public openAccount() {
    window.open('/a/' + this.acctCtrl.value.Id, '_blank');
  }

  public acctToString(acct: Account): string {
    if(!acct) return '';
    return acct.FirstName + ' ' + acct.LastName + (acct.PhoneNumber && acct.PhoneNumber.length > 0 ? (' (' + acct.PhoneNumber + ')') : '');
  }

  // TODO: Consider doing this on the backend? That'd prevent having to send over a FULL list of accounts
  // and then having to store all of those accounts on the client side (would need to do the same thing with the acount view)
  private _filterAccounts(searchVal: any): Account[] {
    if(this.accountManager.isObjectAnAccount(searchVal)) { 
      return [this.accountList.find( acct => acct.Id === (<Account>searchVal).Id )]
    }

    if(!searchVal) { return this.accountList.slice(0, 20); }

    // Else we have a string, so do the actual filtering...
    const filterVal = (<string>searchVal).toLowerCase();

    return this.accountList.filter(acct => 
      acct.FirstName.toLowerCase().includes(filterVal)
      || acct.LastName.toLowerCase().includes(filterVal)
      || (acct.PhoneNumber && acct.PhoneNumber.toLowerCase().includes(filterVal))
    ).slice(0, 20);
  }

}
