import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Account } from './interfaces/account';
import { Transaction } from './interfaces/transaction';
import { TransactionType } from './interfaces/transactiontype';
import { DataSet, DataPoint } from './interfaces/graphdata';

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
    return await this.http.post<Account>(this.url + 'Account/AddAccountByAccount', acct).toPromise();
  }

  public async GetAccounts(isIncludeRelatedData: boolean = false) {
    // this.http.get<Account[]>(this.url + 'Tester/GetAccounts').subscribe(result => {
    //   this.accounts = result;
    // }, error => console.error(error));
    return await this.http.get<Account[]>(this.url + 'Account/GetAccounts',
                                    { params: new HttpParams().set('isIncludeRelatedData', isIncludeRelatedData.toString()) }).toPromise();
  }

  public async GetTransactions() {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactions').toPromise();
  }

  public async GetTransactionTypes() {
    return await this.http.get<TransactionType[]>(this.url + 'Transaction/GetTransactionTypes').toPromise();
  }

  public async AddTransaction(tran: Transaction) {
    return await this.http.post<Transaction>(this.url + 'Transaction/AddTransaction', tran).toPromise();
  }

  public async GetTransactionsForAccountId(acctId: number) {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactionForAccountId',
                                    { params: new HttpParams().set('acctId', acctId.toString()) }).toPromise();
  }

  public async GetAccount(acctId: string) {
    return await this.http.get<Account>(this.url + 'Account/GetAccount',
                                    { params: new HttpParams().set('acctId', acctId.toString()) }).toPromise();
  }

  public async GetTransactionDataByDay(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByDays',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise();
  }
  
  public async GetTransactionDataByWeek(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByWeeks',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise();
  }

  public async GetTransactionDataByMonth(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByMonths',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise();
  }
  public async GetAveragesForWeekDays(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetAveragesForWeekDays',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise();
  }

  public async GetTransactionTotals(startDate: Date, endDate: Date) {
    return await this.http.get<DataPoint[]>(this.url + 'Transaction/GetTransactionTotals',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise();
  }
}
