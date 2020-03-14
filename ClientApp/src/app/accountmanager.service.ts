import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from './interfaces/account';
import { Transaction } from './interfaces/transaction';
import { TransactionType } from './interfaces/transactiontype';

@Injectable({
  providedIn: 'root'
})
export class AccountmanagerService {
  public accounts: Account[];
  private url: string = 'https://localhost:5001/';

  constructor(private http: HttpClient) { // , @Inject('SERVER_URL') serverUrl: string) {
  }

  public async AddAccount(acct: Account) {
    // this.http.post<Account>(this.url + 'Tester/AddAccountByAccount', acct).subscribe(result => {
    //   console.log("Written successfully!");
    // }, error => console.error(error));
    return await this.http.post<Account>(this.url + 'Tester/AddAccountByAccount', acct).toPromise();
  }

  public async GetAccounts() {
    // this.http.get<Account[]>(this.url + 'Tester/GetAccounts').subscribe(result => {
    //   this.accounts = result;
    // }, error => console.error(error));
    return await this.http.get<Account[]>(this.url + 'Tester/GetAccounts').toPromise();
  }

  public async GetTransactions() {
    return await this.http.get<Transaction[]>(this.url + 'Tester/GetTransactions').toPromise();
  }

  public async GetTransactionTypes() {
    return await this.http.get<TransactionType[]>(this.url + 'Tester/GetTransactionTypes').toPromise();
  }

  public async AddTransaction(tran: Transaction) {
    return await this.http.post<Transaction>(this.url + 'Tester/AddTransaction', tran).toPromise();
  }

  // public async GetTransactionsForAccountId(acctId: number) {
  //   return await this.http.get<Transaction[]>(this.url + 'Tester/GetTransactionForAccountId', ).toPromise();
  // }
}
