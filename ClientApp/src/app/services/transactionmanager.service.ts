import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { DataSet, DataPoint } from '../interfaces/graphdata';
import { HttpStatusCodeResponse } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionmanagerService {
  private url: string = 'https://localhost:5001/';

  constructor(private http: HttpClient) { }// , @Inject('SERVER_URL') serverUrl: string) {

  public async GetTransactions() {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactions').toPromise();
  }

  public async GetTransactionTypes() {
    return await this.http.get<TransactionType[]>(this.url + 'Transaction/GetTransactionTypes').toPromise();
  }

  public async AddTransaction(tran: Transaction) {
    return await this.http.post<HttpStatusCodeResponse>(this.url + 'Transaction/AddTransaction', tran).toPromise();
  }

  public async GetTransactionsForAccountId(acctId: number) {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactionForAccountId',
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
