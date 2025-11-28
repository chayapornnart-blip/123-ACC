import { BankTransaction, BookTransaction, ReconciliationItem, MatchStatus, ReconciliationSummary } from '../types';

// Helper to parse DD/MM/YYYY to Date object
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('/');
  // Assume DD/MM/YYYY
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
};

export const reconcileData = (
  bankData: BankTransaction[],
  bookData: BookTransaction[]
): { items: ReconciliationItem[], summary: ReconciliationSummary } => {
  const results: ReconciliationItem[] = [];
  const bookUsedIndices = new Set<number>();

  // 1. Iterate through Bank Data (Source of Truth)
  bankData.forEach((bankTx) => {
    // Find matching invoice in Book Data
    // We prioritize Exact Invoice Match
    let bestMatchIndex = -1;
    let matchType = MatchStatus.UNMATCHED_BANK;

    // Search for the invoice number in the description
    const potentialMatchIndex = bookData.findIndex((bookTx, index) => 
      !bookUsedIndices.has(index) && 
      bookTx.description === bankTx.invoice_number
    );

    if (potentialMatchIndex !== -1) {
      bestMatchIndex = potentialMatchIndex;
      const bookTx = bookData[potentialMatchIndex];
      
      const amountDiff = Math.abs(bankTx.amount - bookTx.amount);
      const bankDate = parseDate(bankTx.transaction_date);
      const bookDate = parseDate(bookTx.posting_date);
      const dateDiffTime = Math.abs(bankDate.getTime() - bookDate.getTime());
      const dateDiffDays = Math.ceil(dateDiffTime / (1000 * 60 * 60 * 24)); 

      if (amountDiff < 0.01 && dateDiffDays === 0) {
        matchType = MatchStatus.MATCHED;
      } else if (amountDiff >= 0.01) {
        matchType = MatchStatus.AMOUNT_MISMATCH;
      } else if (dateDiffDays > 0) {
        matchType = MatchStatus.DATE_MISMATCH;
      }
    }

    if (bestMatchIndex !== -1) {
      bookUsedIndices.add(bestMatchIndex);
      const bookTx = bookData[bestMatchIndex];
      const diff = bankTx.amount - bookTx.amount;
      
      results.push({
        id: `rec-${bankTx.id}`,
        status: matchType,
        bankTx,
        bookTx,
        diffAmount: diff,
        remarks: generateRemarks(matchType, diff),
      });
    } else {
      results.push({
        id: `rec-${bankTx.id}`,
        status: MatchStatus.UNMATCHED_BANK,
        bankTx,
      });
    }
  });

  // 2. Find leftover Book items (Unmatched Book)
  bookData.forEach((bookTx, index) => {
    if (!bookUsedIndices.has(index)) {
      results.push({
        id: `rec-orphan-${bookTx.id}`,
        status: MatchStatus.UNMATCHED_BOOK,
        bookTx,
      });
    }
  });

  // 3. Generate Summary
  const summary: ReconciliationSummary = {
    totalBank: bankData.length,
    totalBook: bookData.length,
    matchedCount: results.filter(r => r.status === MatchStatus.MATCHED).length,
    unmatchedBankCount: results.filter(r => r.status === MatchStatus.UNMATCHED_BANK).length,
    unmatchedBookCount: results.filter(r => r.status === MatchStatus.UNMATCHED_BOOK).length,
    mismatchAmountCount: results.filter(r => r.status === MatchStatus.AMOUNT_MISMATCH).length,
    mismatchDateCount: results.filter(r => r.status === MatchStatus.DATE_MISMATCH).length,
    totalDiff: results.reduce((acc, curr) => acc + (curr.diffAmount || 0), 0)
  };

  return { items: results, summary };
};

const generateRemarks = (status: MatchStatus, diff: number): string => {
  switch (status) {
    case MatchStatus.AMOUNT_MISMATCH:
      return `Amount differs by ${diff.toFixed(2)}`;
    case MatchStatus.DATE_MISMATCH:
      return `Date mismatch`;
    case MatchStatus.MATCHED:
      return `Perfect match`;
    default:
      return '';
  }
};