import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { ClientProject } from '../../types';
import { BarChart3 } from 'lucide-react';

interface PerformanceMetricsTabProps {
  project: ClientProject;
}

export const PerformanceMetricsTab: React.FC<PerformanceMetricsTabProps> = ({ project }) => {
  const kpis = project.kpis || [];

  if (kpis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
        <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-bold text-slate-700">No KPI metrics available</p>
        <p className="text-sm">Data will appear once project metrics are configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold font-serif text-slate-900">Performance Metrics</h3>
          <p className="text-xs text-slate-500">Business KPI impact of completed milestones</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={kpis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="value" name="Current Value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" name="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-900">{kpi.name}</h4>
            <p className="text-xs text-slate-600">{kpi.description}</p>
            <div className="flex justify-between items-end pt-2">
              <span className="text-2xl font-bold text-blue-600">{kpi.value} <span className="text-sm font-normal text-slate-500">{kpi.unit}</span></span>
              <span className="text-xs text-slate-400">Target: {kpi.target} {kpi.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
