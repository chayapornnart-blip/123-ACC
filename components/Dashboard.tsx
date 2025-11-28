import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReconciliationSummary } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, SearchX, TrendingUp } from 'lucide-react';

interface Props {
  summary: ReconciliationSummary;
}

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b']; // Emerald, Rose, Blue, Amber

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgGradient: string;
  textColor: string;
  subText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgGradient, textColor, subText }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${bgGradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    
    <div className="flex items-start justify-between mb-4 z-10">
      <div className={`p-3 rounded-xl ${bgGradient} bg-opacity-10 shadow-inner`}>
        {icon}
      </div>
    </div>
    
    <div className="z-10">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</h4>
      <div className="flex items-baseline gap-2">
         <span className={`text-3xl font-bold ${textColor} tracking-tight`}>{value.toLocaleString()}</span>
         {subText && <span className="text-xs text-gray-400 font-medium">{subText}</span>}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<Props> = ({ summary }) => {
  const data = [
    { name: 'Matched', value: summary.matchedCount },
    { name: 'Mismatches', value: summary.mismatchAmountCount + summary.mismatchDateCount },
    { name: 'Unmatched Bank', value: summary.unmatchedBankCount },
    { name: 'Unmatched Book', value: summary.unmatchedBookCount },
  ];

  const total = summary.totalBank + summary.totalBook; // Rough total for context
  const matchRate = total > 0 ? Math.round((summary.matchedCount * 2 / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart Section - Takes up 1 column on large screens */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 lg:col-span-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Overview</h3>
        <p className="text-sm text-gray-500 mb-6">Distribution of transaction statuses</p>
        <div className="flex-grow min-h-[250px] relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontWeight: 600, color: '#374151' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
             <div className="text-2xl font-bold text-gray-800">{matchRate}%</div>
             <div className="text-[10px] text-gray-400 uppercase font-semibold">Match Rate</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Takes up 2 columns */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <StatCard 
          title="Matched"
          value={summary.matchedCount}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          bgGradient="bg-emerald-500"
          textColor="text-emerald-700"
          subText="Transactions"
        />

        <StatCard 
          title="Mismatches"
          value={summary.mismatchAmountCount + summary.mismatchDateCount}
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />}
          bgGradient="bg-rose-500"
          textColor="text-rose-700"
          subText="Req. Attention"
        />

        <StatCard 
          title="Only in Bank"
          value={summary.unmatchedBankCount}
          icon={<SearchX className="w-6 h-6 text-blue-600" />}
          bgGradient="bg-blue-500"
          textColor="text-blue-700"
          subText="Missing in Book"
        />

        <StatCard 
          title="Only in Book"
          value={summary.unmatchedBookCount}
          icon={<XCircle className="w-6 h-6 text-amber-600" />}
          bgGradient="bg-amber-500"
          textColor="text-amber-700"
          subText="Missing in Bank"
        />
        
        {/* Total Variance Card - Full Width in the sub-grid */}
        <div className="sm:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
           <div>
             <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Total Variance</h4>
             <p className="text-3xl font-bold font-mono tracking-tighter">
                {summary.totalDiff.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
             </p>
           </div>
           <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-white" />
           </div>
        </div>
      </div>
    </div>
  );
};