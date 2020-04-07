import { Account } from './account';
import { TransactionType } from './transactiontype';

export interface Transaction {
  Id: number;
  Date: Date;
  AccountId: number;
  Account: Account;
  Amount: number;
  NewTotal: number;
  TransactionTypeId: number;
  TransactionType: TransactionType;
  TransactionDistributions: TransactionDistribution[];
}

export interface RevenueCode {
  Id: number;
  Name: string;
  Description: string;
}

export enum RevenueCode_TypeDef {
  RESALE_ID = 1,
  RETURN_ID = 2,
}

export interface TransactionDistribution {
  Id: number;
  AccountId: number;
  Account: Account;
  Amount: number;
  NewAccountRevenueTotal: number;
  TransactionId: number;
  Transaction: Transaction;
  RevenueCodeId: number;
  RevenueCode: RevenueCode;
}