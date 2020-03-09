import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountmanagerService {
  public accounts: Account[];
  private url: string = 'https://localhost:5001/';

  constructor(private http: HttpClient) { // , @Inject('SERVER_URL') serverUrl: string) {
  }

  public async AddAccount(acct: Account) {
    //this.http.post<Account>(this.url + 'Tester/AddAccountByAccount', acct).subscribe(result => {
    //  console.log("Written successfully!");
    //}, error => console.error(error));
    return await this.http.post<Account>(this.url + 'Tester/AddAccountByAccount', acct).toPromise();
  }

  public async GetAccounts() {
    //this.http.get<Account[]>(this.url + 'Tester/GetAccounts').subscribe(result => {
    //  this.accounts = result;
    //}, error => console.error(error));
    return await this.http.get<Account[]>(this.url + 'Tester/GetAccounts').toPromise();
  }
}

export interface Account {
  Id: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Notes: string;
}