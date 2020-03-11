import { Account } from './account';
import { TransactionType } from './transactiontype';

export interface Transaction {
  Id: number;
  Date: Date;
  AccountId: number;
  Account: Account;
  Amount: number;
  TransactionTypeId: number;
  TransactionType: TransactionType;
}