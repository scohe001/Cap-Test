import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Account } from '../interfaces/account';
import { Transaction } from '../interfaces/transaction';
import { TransactionType } from '../interfaces/transactiontype';
import { DataSet, DataPoint } from '../interfaces/graphdata';
import { HttpStatusCodeResponse, CommonService } from './common.service';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionmanagerService {
  constructor(
    private http: HttpClient,
    private commonManager: CommonService,
    @Inject('BASE_URL') private url: string,
  ) { }

  public async GetTransactions() {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactions').toPromise().catch(reason => null);
  }

  public async GetTransactionTypes() {
    return await this.http.get<TransactionType[]>(this.url + 'Transaction/GetTransactionTypes').toPromise().catch(reason => null);
  }

  public async AddTransaction(tran: Transaction) {
    return await this.http.post<HttpStatusCodeResponse>(this.url + 'Transaction/AddTransaction', tran)
      .toPromise()
      .catch((err: HttpErrorResponse) => {
        return {StatusCode: err.status, StatusDescription: err.error};
      });
  }

  public async GetTransactionsForAccountId(acctId: number) {
    return await this.http.get<Transaction[]>(this.url + 'Transaction/GetTransactionForAccountId',
                                    { params: new HttpParams().set('acctId', acctId.toString()) }).toPromise().catch(reason => null);
  }

  //#region Get Analytics Data

  public async GetTransactionDataByDay(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByDays',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise().catch(reason => null);
  }
  
  public async GetTransactionDataByWeek(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByWeeks',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise().catch(reason => null);
  }

  public async GetTransactionDataByMonth(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetTransactionDataByMonths',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise().catch(reason => null);
  }
  public async GetAveragesForWeekDays(startDate: Date, endDate: Date) {
    return await this.http.get<DataSet[]>(this.url + 'Transaction/GetAveragesForWeekDays',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise().catch(reason => null);
  }

  public async GetTransactionTotals(startDate: Date, endDate: Date) {
    return await this.http.get<DataPoint[]>(this.url + 'Transaction/GetTransactionTotals',
                                    { 
                                      params: new HttpParams()
                                                .set('startDate', startDate.toUTCString())
                                                .set('endDate', endDate.toUTCString())
                                    }).toPromise().catch(reason => null);
  }

  //#endregion
}
