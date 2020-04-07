export interface TransactionType {
  Id: number;
  Name: string;
  IsSystemType: boolean;
}

export enum TranType_TypeDef {
  RESALE_ID = 1,
  RETURN_ID = 2,
  PURCHASE_ID = 3,
  CASHOUT_ID = 4,
  CASHOUT_DEDUCTION_ID = 5,
  CREDIT_EXPIRATION_ID = 6,
}