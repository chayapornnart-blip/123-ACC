import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReconciliationSummary } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, SearchX } from 'lucide-react';

interface Props {
  summary: ReconciliationSummary;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

export const Dashboard: React.FC<Props> = ({ summary }) => {
  const data = [
    { name: 'Matched', value: summary.matchedCount },
    { name: 'Errors (Amount/Date)', value: summary.mismatchAmountCount + summary.mismatchDateCount },
    { name: 'Unmatched Bank', value: summary.unmatchedBankCount },
    { name: 'Unmatched Book', value: summary.unmatchedBookCount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Stats Cards */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-green-100 rounded-full">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Matched</p>
          <p className="text-2xl font-bold text-gray-800">{summary.matchedCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Mismatches</p>
          <p className="text-2xl font-bold text-gray-800">
            {summary.mismatchAmountCount + summary.mismatchDateCount}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <SearchX className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Unmatched (Bank)</p>
          <p className="text-2xl font-bold text-gray-800">{summary.unmatchedBankCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="p-3 bg-orange-100 rounded-full">
          <XCircle className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Unmatched (Book)</p>
          <p className="text-2xl font-bold text-gray-800">{summary.unmatchedBookCount}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Reconciliation Overview</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};