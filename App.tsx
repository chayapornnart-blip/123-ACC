import React, { useState, useEffect } from 'react';
import { parseBankCSV, parseBookCSV, sampleBankCSV, sampleBookCSV } from './utils/csvParser';
import { reconcileData } from './utils/reconcileLogic';
import { BankTransaction, BookTransaction, ReconciliationItem, ReconciliationSummary } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionTable } from './components/TransactionTable';
import { FileUpload } from './components/FileUpload';
import { ArrowRightLeft, Database, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [bankData, setBankData] = useState<BankTransaction[]>([]);
  const [bookData, setBookData] = useState<BookTransaction[]>([]);
  const [results, setResults] = useState<ReconciliationItem[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  
  const [bankFileName, setBankFileName] = useState<string>('');
  const [bookFileName, setBookFileName] = useState<string>('');

  // Example of using Environment Variables in Vite
  // Safe access using optional chaining (?.) to prevent crash if import.meta.env is undefined
  const appName = import.meta.env?.VITE_APP_NAME || 'Smart Reconcile Pro';
  const appVersion = import.meta.env?.VITE_APP_VERSION || 'v1.0.0';

  const processReconciliation = (bank: BankTransaction[], book: BookTransaction[]) => {
    const { items, summary } = reconcileData(bank, book);
    setResults(items);
    setSummary(summary);
  };

  useEffect(() => {
    if (bankData.length > 0 && bookData.length > 0) {
      processReconciliation(bankData, bookData);
    }
  }, [bankData, bookData]);

  const handleBankUpload = (content: string) => {
    const data = parseBankCSV(content);
    setBankData(data);
    setBankFileName('Uploaded Bank Data.csv');
  };

  const handleBookUpload = (content: string) => {
    const data = parseBookCSV(content);
    setBookData(data);
    setBookFileName('Uploaded Book Data.csv');
  };

  const loadSampleData = () => {
    const bData = parseBankCSV(sampleBankCSV);
    const bkData = parseBookCSV(sampleBookCSV);
    setBankData(bData);
    setBookData(bkData);
    setBankFileName('Sample_Bank_Data.csv');
    setBookFileName('Sample_Book_Data.csv');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{appName}</h1>
              <p className="text-xs text-slate-400">Automated Financial Matching System ({appVersion})</p>
            </div>
          </div>
          <button 
            onClick={loadSampleData}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all border border-slate-700"
          >
            <Database className="w-4 h-4" />
            <span>Load Sample Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upload Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-800">Data Sources</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <FileUpload 
                label="1. Upload Bank Statement (CSV)" 
                onUpload={handleBankUpload} 
                fileName={bankFileName}
                color="blue"
              />
              <p className="text-xs text-slate-500 pl-1">Target columns: account_no, transaction_date, invoice_number, total_amount</p>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="p-3 bg-slate-100 rounded-full">
                <RefreshCcw className="w-6 h-6 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4">
              <FileUpload 
                label="2. Upload Book/GL Record (CSV)" 
                onUpload={handleBookUpload} 
                fileName={bookFileName}
                color="indigo"
              />
              <p className="text-xs text-slate-500 pl-1">Target columns: document_no, posting_date, description, amount</p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {summary && (
          <div className="space-y-8 animate-fade-in-up">
             <div className="flex items-center space-x-2">
              <div className="h-8 w-1 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Reconciliation Analysis</h2>
            </div>
            
            <Dashboard summary={summary} />
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-slate-700">Detailed Transactions</h3>
              <TransactionTable items={results} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!summary && (
          <div className="text-center py-20 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
            <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600">No Data Processed Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2">
              Upload your CSV files above or use the "Load Sample Data" button to see the magic happen.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;