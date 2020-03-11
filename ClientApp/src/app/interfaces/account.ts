import { Transaction } from './transaction';

export interface Account {
  Id: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Notes: string;
  Transactions: Transaction[]
}