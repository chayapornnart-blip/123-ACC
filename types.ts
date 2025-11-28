export interface BankTransaction {
  id: string; // generated
  account_no: string;
  transaction_date: string; // DD/MM/YYYY
  time: string;
  invoice_number: string;
  amount: number; // Parsed from total_amount
  merchant_id: string;
  fuel_brand: string;
  raw: any;
}

export interface BookTransaction {
  id: string; // generated
  document_no: string;
  posting_date: string; // DD/MM/YYYY
  description: string; // Used for matching invoice
  amount: number;
  raw: any;
}

export enum MatchStatus {
  MATCHED = 'MATCHED',
  AMOUNT_MISMATCH = 'AMOUNT_MISMATCH',
  DATE_MISMATCH = 'DATE_MISMATCH',
  UNMATCHED_BANK = 'UNMATCHED_BANK',
  UNMATCHED_BOOK = 'UNMATCHED_BOOK',
}

export interface ReconciliationItem {
  id: string;
  status: MatchStatus;
  bankTx?: BankTransaction;
  bookTx?: BookTransaction;
  diffAmount?: number;
  dateDiff?: number; // in days
  remarks?: string;
}

export interface ReconciliationSummary {
  totalBank: number;
  totalBook: number;
  matchedCount: number;
  unmatchedBankCount: number;
  unmatchedBookCount: number;
  mismatchAmountCount: number;
  mismatchDateCount: number;
  totalDiff: number;
}