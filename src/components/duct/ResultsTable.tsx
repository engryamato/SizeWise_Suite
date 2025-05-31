import React from 'react';
import { ResultsTableProps } from '@/types/ductResults';
import { getStatusColor, getStatusIcon, exportToCsv } from '@/utils/ductResults';

const ResultsTable: React.FC<ResultsTableProps> = ({ results, summary, onExport, className = '' }) => {
  const handleExport = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      const csvContent = exportToCsv(results);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `duct-results-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (onExport) {
      onExport('pdf');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Duct Sizing Results</h2>
            <p className="text-sm text-gray-500">
              Generated on {new Date().toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export CSV
            </button>
            {onExport && (
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={`p-4 ${getStatusColor(summary.status)}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getStatusIcon(summary.status)}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">{summary.message}</h3>
            {summary.issues.length > 0 && (
              <div className="mt-2 text-sm">
                <ul className="list-disc pl-5 space-y-1">
                  {summary.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parameter
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Limit / Standard
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Advice / Warning
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((item, idx) => (
              <tr
                key={idx}
                className={
                  item.status === 'error'
                    ? 'bg-red-50'
                    : item.status === 'warning'
                    ? 'bg-yellow-50'
                    : item.status === 'success'
                    ? 'bg-green-50'
                    : ''
                }
                aria-label={item.parameter + ' result row'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.parameter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.limit || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    {item.reference}
                    {item.description && (
                      <span className="ml-1" tabIndex={0} role="img" aria-label="Info" title={item.description}>
                        <svg className="w-4 h-4 text-blue-400 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 10-2 0v-4a1 1 0 112 0v4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.advice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with notes */}
      <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-200">
        <p>For full compliance, verify all results against the latest SMACNA Duct Construction Standards and local codes.</p>
      </div>
    </div>
  );
};

export default ResultsTable;
