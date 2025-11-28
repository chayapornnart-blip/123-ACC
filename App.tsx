import React, { useState, useEffect } from 'react';
import { parseBankCSV, parseBookCSV, sampleBankCSV, sampleBookCSV } from './utils/csvParser';
import { reconcileData } from './utils/reconcileLogic';
import { BankTransaction, BookTransaction, ReconciliationItem, ReconciliationSummary } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionTable } from './components/TransactionTable';
import { FileUpload } from './components/FileUpload';
import { ArrowRightLeft, Database, Sparkles, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [bankData, setBankData] = useState<BankTransaction[]>([]);
  const [bookData, setBookData] = useState<BookTransaction[]>([]);
  const [results, setResults] = useState<ReconciliationItem[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  
  const [bankFileName, setBankFileName] = useState<string>('');
  const [bookFileName, setBookFileName] = useState<string>('');

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
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
      {/* Modern Header with Gradient */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-200">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">{appName}</h1>
              <span className="text-[10px] font-semibold tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                {appVersion}
              </span>
            </div>
          </div>
          <button 
            onClick={loadSampleData}
            className="group flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Database className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            <span>Load Sample Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero / Upload Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Data Sources</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
              
              {/* Bank Upload */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                  <span className="text-sm font-semibold text-gray-700">Bank Statement</span>
                </div>
                <FileUpload 
                  label="Upload CSV" 
                  onUpload={handleBankUpload} 
                  fileName={bankFileName}
                  color="blue"
                  icon="bank"
                />
              </div>
              
              {/* Connector */}
              <div className="hidden md:flex flex-col items-center justify-center gap-2 opacity-50">
                <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                <div className="p-2 bg-white border border-gray-200 rounded-full shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Book Upload */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">2</span>
                  <span className="text-sm font-semibold text-gray-700">Book / GL Record</span>
                </div>
                <FileUpload 
                  label="Upload CSV" 
                  onUpload={handleBookUpload} 
                  fileName={bookFileName}
                  color="indigo"
                  icon="book"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {summary && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Reconciliation Analysis</h2>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Processed {summary.totalBank + summary.totalBook} transactions</span>
                </div>
            </div>
            
            <Dashboard summary={summary} />
            
            <div className="space-y-4">
              <TransactionTable items={results} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!summary && (
          <div className="mt-12 text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Database className="relative w-16 h-16 text-slate-300 mx-auto mb-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Reconcile</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Upload your financial records above to instantly match transactions and identify discrepancies.
            </p>
          </div>
        )}
      </main>

       <footer className="mt-20 border-t border-gray-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Smart Reconcile Pro. Secure Client-Side Processing.
          </div>
       </footer>
    </div>
  );
};

export default App;