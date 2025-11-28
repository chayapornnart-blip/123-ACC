import React, { useState } from 'react';
import { ReconciliationItem, MatchStatus } from '../types';
import { Check, AlertCircle, X, ArrowRight, FileText, Filter } from 'lucide-react';

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
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border";
    switch (status) {
      case MatchStatus.MATCHED:
        return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100`}><Check className="w-3 h-3 mr-1.5" /> MATCHED</span>;
      case MatchStatus.AMOUNT_MISMATCH:
        return <span className={`${baseClasses} bg-rose-50 text-rose-700 border-rose-100`}><AlertCircle className="w-3 h-3 mr-1.5" /> AMT DIFF</span>;
      case MatchStatus.DATE_MISMATCH:
        return <span className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-100`}><AlertCircle className="w-3 h-3 mr-1.5" /> DATE DIFF</span>;
      case MatchStatus.UNMATCHED_BANK:
        return <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-100`}><X className="w-3 h-3 mr-1.5" /> BANK ONLY</span>;
      case MatchStatus.UNMATCHED_BOOK:
        return <span className={`${baseClasses} bg-gray-100 text-gray-600 border-gray-200`}><X className="w-3 h-3 mr-1.5" /> BOOK ONLY</span>;
      default:
        return null;
    }
  };

  const tabs = [
      { id: 'ALL', label: 'All Items' },
      { id: 'MATCHED', label: 'Matched' },
      { id: 'MISMATCH', label: 'Discrepancies' },
      { id: 'UNMATCHED', label: 'Unmatched' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
      {/* Header & Filter */}
      <div className="border-b border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Details
            <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                {filteredItems.length} rows
            </span>
        </h3>
        
        <div className="bg-gray-100/80 p-1 rounded-xl flex gap-1 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                filter === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-blue-600"><FileText className="w-3.5 h-3.5" /> BANK STATEMENT</div>
              </th>
              <th scope="col" className="px-2 py-4"></th>
              <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-indigo-600"><FileText className="w-3.5 h-3.5" /> BOOK RECORD</div>
              </th>
              <th scope="col" className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {filteredItems.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-16 text-center">
                   <div className="flex flex-col items-center justify-center text-gray-400">
                       <Filter className="w-10 h-10 mb-3 opacity-20" />
                       <p className="text-sm font-medium">No transactions found for this filter.</p>
                   </div>
                 </td>
               </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  
                  {/* Bank Side */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.bankTx ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">INV: {item.bankTx.invoice_number}</span>
                        <span className="text-gray-400 text-xs font-mono mt-0.5">{item.bankTx.transaction_date}</span>
                        <span className="font-mono text-gray-600 font-medium mt-1 text-xs">
                             {item.bankTx.amount.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs italic font-medium px-2 py-1 bg-gray-50 rounded">Missing</span>
                    )}
                  </td>

                  {/* Connector Arrow */}
                  <td className="px-2 py-4 text-center">
                    <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-300 transition-colors" />
                  </td>

                  {/* Book Side */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.bookTx ? (
                       <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 truncate max-w-[150px]" title={item.bookTx.description}>
                            {item.bookTx.description}
                        </span>
                        <span className="text-gray-400 text-xs font-mono mt-0.5">{item.bookTx.posting_date}</span>
                        <span className={`font-mono text-xs font-medium mt-1 ${item.status === MatchStatus.AMOUNT_MISMATCH ? 'text-rose-600 bg-rose-50 px-1 rounded w-fit' : 'text-gray-600'}`}>
                           {item.bookTx.amount.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs italic font-medium px-2 py-1 bg-gray-50 rounded">Missing</span>
                    )}
                  </td>

                  {/* Variance */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {item.diffAmount && Math.abs(item.diffAmount) > 0.001 ? (
                      <div className="flex flex-col items-end">
                          <span className="text-rose-600 font-bold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                            {item.diffAmount > 0 ? '+' : ''}{item.diffAmount.toFixed(2)}
                          </span>
                          {item.remarks && <span className="text-[10px] text-rose-500 mt-1 font-medium">{item.remarks}</span>}
                      </div>
                    ) : (
                      <span className="text-gray-300 font-mono">-</span>
                    )}
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