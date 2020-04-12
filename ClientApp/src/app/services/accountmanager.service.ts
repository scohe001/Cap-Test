import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { DataSet, DataPoint } from '../interfaces/graphdata';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AccountmanagerService {
  private url: string = 'https://localhost:5001/';

  constructor(private http: HttpClient,
              private commonManager: CommonService) { } // , @Inject('SERVER_URL') serverUrl: string) {

  public async AddAccount(acct: Account) {
    // this.http.post<Account>(this.url + 'Tester/AddAccountByAccount', acct).subscribe(result => {
    //   console.log("Written successfully!");
    // }, error => console.error(error));
    return await this.http.post<Account>(this.url + 'Account/AddAccountByAccount', acct).toPromise();
  }

  public async GetAccounts(isIncludeRelatedData: boolean = false) {
    // this.http.get<Account[]>(this.url + 'Tester/GetAccounts').subscribe(result => {
    //   this.accounts = result;
    // }, error => console.error(error));
    return await this.http.get<Account[]>(this.url + 'Account/GetAccounts',
                                    { params: new HttpParams().set('isIncludeRelatedData', isIncludeRelatedData.toString()) }).toPromise();
  }

  public async GetAccount(acctId: string) {
    if(!this.commonManager.IsGoodIdFormat(acctId)) { return null; }
    return this.GetAccountFromDb(acctId);
  }

  private async GetAccountFromDb(acctId: string) {
    return await this.http.get<Account>(this.url + 'Account/GetAccount',
                                    { params: new HttpParams().set('acctId', acctId.toString()) }).toPromise();
  }

  isObjectAnAccount(obj: any): obj is Account {
    return obj && obj != null && typeof obj.Id === "number" && typeof obj.FirstName === "string" && typeof obj.LastName === "string";
  }

}
