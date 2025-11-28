import React, { useState } from 'react';
import { ReconciliationItem, MatchStatus } from '../types';
import { Check, AlertCircle, X, ArrowRight, FileText } from 'lucide-react';

interface Props {
  items: ReconciliationItem[];
}

export const TransactionTable: React.FC<Props> = ({ items }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredItems = items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'MATCHED') return item.status === MatchStatus.MATCHED;
    if (filter === 'MISMATCH') return item.status === MatchStatus.AMOUNT_MISMATCH || item.status === MatchStatus.DATE_MISMATCH;
    if (filter === 'UNMATCHED') return item.status === MatchStatus.UNMATCHED_BANK || item.status === MatchStatus.UNMATCHED_BOOK;
    return true;
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.MATCHED:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> Matched</span>;
      case MatchStatus.AMOUNT_MISMATCH:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Amount Diff</span>;
      case MatchStatus.DATE_MISMATCH:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" /> Date Diff</span>;
      case MatchStatus.UNMATCHED_BANK:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><X className="w-3 h-3 mr-1" /> Only in Bank</span>;
      case MatchStatus.UNMATCHED_BOOK:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" /> Only in Book</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200 px-6 py-4 flex gap-4 overflow-x-auto">
        {['ALL', 'MATCHED', 'MISMATCH', 'UNMATCHED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f 
                ? 'bg-slate-900 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Bank (Source)</div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Book (GL)</div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                   No transactions found for this filter.
                 </td>
               </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  
                  {/* Bank Side */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.bankTx ? (
                      <div>
                        <div className="font-medium">INV: {item.bankTx.invoice_number}</div>
                        <div className="text-gray-500 text-xs">{item.bankTx.transaction_date}</div>
                        <div className="font-mono mt-1">{item.bankTx.amount.toLocaleString()}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Record</span>
                    )}
                  </td>

                  {/* Connector Arrow */}
                  <td className="px-2 py-4 text-center">
                    <ArrowRight className="w-4 h-4 text-gray-300 mx-auto" />
                  </td>

                  {/* Book Side */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.bookTx ? (
                      <div>
                        <div className="font-medium">DESC: {item.bookTx.description}</div>
                        <div className="text-gray-500 text-xs">{item.bookTx.posting_date}</div>
                        <div className={`font-mono mt-1 ${item.status === MatchStatus.AMOUNT_MISMATCH ? 'text-red-600 font-bold' : ''}`}>
                          {item.bookTx.amount.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Record</span>
                    )}
                  </td>

                  {/* Variance */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {item.diffAmount && Math.abs(item.diffAmount) > 0.001 ? (
                      <span className="text-red-600 font-bold font-mono">
                        {item.diffAmount > 0 ? '+' : ''}{item.diffAmount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                    {item.remarks && <div className="text-xs text-red-500 mt-1">{item.remarks}</div>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};