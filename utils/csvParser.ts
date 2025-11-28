import Papa from 'papaparse';
import { BankTransaction, BookTransaction } from '../types';

// Helper to clean currency string "1,234.56" -> 1234.56
const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, ''));
};

export const parseBankCSV = (csvString: string): BankTransaction[] => {
  const results = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  return results.data.map((row: any, index: number) => ({
    id: `bank-${index}`,
    account_no: row['account_no'],
    transaction_date: row['transaction_date'],
    time: row['time'],
    invoice_number: row['invoice_number']?.trim(),
    amount: parseCurrency(row['total_amount']),
    merchant_id: row['merchant_id'],
    fuel_brand: row['fuel_brand'],
    raw: row,
  })).filter(item => item.invoice_number); // Filter out invalid rows
};

export const parseBookCSV = (csvString: string): BookTransaction[] => {
  const results = Papa.parse(csvString, { header: true, skipEmptyLines: true });
  return results.data.map((row: any, index: number) => ({
    id: `book-${index}`,
    document_no: row['document_no'],
    posting_date: row['posting_date'],
    description: row['description']?.trim(),
    amount: parseCurrency(row['amount']),
    raw: row,
  })).filter(item => item.description);
};

export const sampleBankCSV = `account_no,settlement_date,transaction_date,time,invoice_number,product,liter,price,amount_before_vat,vat,total_amount,wht_1_percent,total_amount_after_wd,merchant_id,fuel_brand
123456789,1/9/2025,1/9/2025,19:21:15,395443,DIESEL (PTT),65,32,"1,943.93",136.07,"2,080.00",19.44,"2,060.56",1235001074,PTT
123456789,1/9/2025,1/9/2025,15:01:09,934785,DIESEL (PTT),50,32.12,"1,500.93",105.07,"1,606.00",15.01,"1,590.99",1024261188,PTT
123456789,2/9/2025,2/9/2025,14:28:08,965451,DIESEL (PTT),27,32.03,808.22,56.58,864.8,8.08,856.72,1000020346,PTT
123456789,12/9/2025,12/9/2025,12:34:13,961851,HI DIESEL S (BCP),50.37,32.16,"1,514.11",105.99,"1,620.10",15.14,"1,604.96",1024500988,BCP
123456789,26/9/2025,26/9/2025,06:55:36,669397,HI DIESEL S (BCP),175.15,32.03,"5,243.08",367.02,"5,610.10",52.43,"5,557.67",1219090472,BCP`;

export const sampleBookCSV = `document_no,posting_date,description,amount
1,1/9/2025,395443,"2,080.00"
2,1/9/2025,934785,"1,600.00"
11,2/9/2025,965451,864.80
105,12/9/2025,961851,"1,620.10"
224,28/9/2025,669397,"5,610.10"`;