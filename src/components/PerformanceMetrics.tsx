import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Zap,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

interface PerformanceMetricsProps {
  onOpenConsultation?: (serviceOrNote?: string) => void;
}

type MetricViewMode = 'revenue' | 'efficiency' | 'runway' | 'composite';
type CohortType = 'all' | 'sme' | 'tech' | 'manufacturing' | 'services';

interface MetricPoint {
  month: string;
  revenueGrowthAccounticca: number; // %
  revenueGrowthBaseline: number; // %
  efficiencyAccounticca: number; // %
  efficiencyBaseline: number; // %
  cashRunwayMonths: number;
  ebitdaMarginAccounticca: number; // %
  ebitdaMarginBaseline: number; // %
}

// Comprehensive monthly progression data by cohort
const cohortData: Record<CohortType, MetricPoint[]> = {
  all: [
    { month: 'Month 1', revenueGrowthAccounticca: 4, revenueGrowthBaseline: 2, efficiencyAccounticca: 8, efficiencyBaseline: 3, cashRunwayMonths: 4.2, ebitdaMarginAccounticca: 8.5, ebitdaMarginBaseline: 8.0 },
    { month: 'Month 2', revenueGrowthAccounticca: 12, revenueGrowthBaseline: 4, efficiencyAccounticca: 18, efficiencyBaseline: 5, cashRunwayMonths: 4.8, ebitdaMarginAccounticca: 10.2, ebitdaMarginBaseline: 8.1 },
    { month: 'Month 3', revenueGrowthAccounticca: 25, revenueGrowthBaseline: 7, efficiencyAccounticca: 32, efficiencyBaseline: 8, cashRunwayMonths: 6.0, ebitdaMarginAccounticca: 12.8, ebitdaMarginBaseline: 8.3 },
    { month: 'Month 4', revenueGrowthAccounticca: 41, revenueGrowthBaseline: 10, efficiencyAccounticca: 44, efficiencyBaseline: 10, cashRunwayMonths: 7.5, ebitdaMarginAccounticca: 15.4, ebitdaMarginBaseline: 8.5 },
    { month: 'Month 5', revenueGrowthAccounticca: 58, revenueGrowthBaseline: 13, efficiencyAccounticca: 53, efficiencyBaseline: 12, cashRunwayMonths: 9.1, ebitdaMarginAccounticca: 17.6, ebitdaMarginBaseline: 8.6 },
    { month: 'Month 6', revenueGrowthAccounticca: 78, revenueGrowthBaseline: 15, efficiencyAccounticca: 61, efficiencyBaseline: 14, cashRunwayMonths: 10.8, ebitdaMarginAccounticca: 19.8, ebitdaMarginBaseline: 8.8 },
    { month: 'Month 8', revenueGrowthAccounticca: 104, revenueGrowthBaseline: 19, efficiencyAccounticca: 70, efficiencyBaseline: 16, cashRunwayMonths: 12.5, ebitdaMarginAccounticca: 22.3, ebitdaMarginBaseline: 9.0 },
    { month: 'Month 10', revenueGrowthAccounticca: 128, revenueGrowthBaseline: 22, efficiencyAccounticca: 76, efficiencyBaseline: 18, cashRunwayMonths: 14.0, ebitdaMarginAccounticca: 24.1, ebitdaMarginBaseline: 9.2 },
    { month: 'Month 12', revenueGrowthAccounticca: 152, revenueGrowthBaseline: 25, efficiencyAccounticca: 82, efficiencyBaseline: 20, cashRunwayMonths: 16.5, ebitdaMarginAccounticca: 26.5, ebitdaMarginBaseline: 9.4 },
  ],
  sme: [
    { month: 'Month 1', revenueGrowthAccounticca: 3, revenueGrowthBaseline: 1, efficiencyAccounticca: 10, efficiencyBaseline: 4, cashRunwayMonths: 3.8, ebitdaMarginAccounticca: 7.2, ebitdaMarginBaseline: 7.0 },
    { month: 'Month 2', revenueGrowthAccounticca: 10, revenueGrowthBaseline: 3, efficiencyAccounticca: 22, efficiencyBaseline: 6, cashRunwayMonths: 4.5, ebitdaMarginAccounticca: 9.1, ebitdaMarginBaseline: 7.2 },
    { month: 'Month 3', revenueGrowthAccounticca: 22, revenueGrowthBaseline: 5, efficiencyAccounticca: 38, efficiencyBaseline: 9, cashRunwayMonths: 5.8, ebitdaMarginAccounticca: 11.5, ebitdaMarginBaseline: 7.3 },
    { month: 'Month 4', revenueGrowthAccounticca: 38, revenueGrowthBaseline: 8, efficiencyAccounticca: 50, efficiencyBaseline: 11, cashRunwayMonths: 7.2, ebitdaMarginAccounticca: 14.2, ebitdaMarginBaseline: 7.5 },
    { month: 'Month 5', revenueGrowthAccounticca: 54, revenueGrowthBaseline: 11, efficiencyAccounticca: 59, efficiencyBaseline: 13, cashRunwayMonths: 8.8, ebitdaMarginAccounticca: 16.8, ebitdaMarginBaseline: 7.6 },
    { month: 'Month 6', revenueGrowthAccounticca: 72, revenueGrowthBaseline: 14, efficiencyAccounticca: 67, efficiencyBaseline: 15, cashRunwayMonths: 10.4, ebitdaMarginAccounticca: 19.1, ebitdaMarginBaseline: 7.8 },
    { month: 'Month 8', revenueGrowthAccounticca: 98, revenueGrowthBaseline: 17, efficiencyAccounticca: 75, efficiencyBaseline: 17, cashRunwayMonths: 12.0, ebitdaMarginAccounticca: 21.5, ebitdaMarginBaseline: 8.0 },
    { month: 'Month 10', revenueGrowthAccounticca: 122, revenueGrowthBaseline: 20, efficiencyAccounticca: 81, efficiencyBaseline: 19, cashRunwayMonths: 13.8, ebitdaMarginAccounticca: 23.4, ebitdaMarginBaseline: 8.1 },
    { month: 'Month 12', revenueGrowthAccounticca: 145, revenueGrowthBaseline: 23, efficiencyAccounticca: 88, efficiencyBaseline: 21, cashRunwayMonths: 15.6, ebitdaMarginAccounticca: 25.2, ebitdaMarginBaseline: 8.3 },
  ],
  tech: [
    { month: 'Month 1', revenueGrowthAccounticca: 6, revenueGrowthBaseline: 3, efficiencyAccounticca: 12, efficiencyBaseline: 5, cashRunwayMonths: 5.0, ebitdaMarginAccounticca: 10.0, ebitdaMarginBaseline: 9.5 },
    { month: 'Month 2', revenueGrowthAccounticca: 18, revenueGrowthBaseline: 6, efficiencyAccounticca: 26, efficiencyBaseline: 8, cashRunwayMonths: 6.2, ebitdaMarginAccounticca: 13.0, ebitdaMarginBaseline: 9.8 },
    { month: 'Month 3', revenueGrowthAccounticca: 34, revenueGrowthBaseline: 10, efficiencyAccounticca: 42, efficiencyBaseline: 12, cashRunwayMonths: 8.0, ebitdaMarginAccounticca: 16.5, ebitdaMarginBaseline: 10.1 },
    { month: 'Month 4', revenueGrowthAccounticca: 52, revenueGrowthBaseline: 14, efficiencyAccounticca: 56, efficiencyBaseline: 15, cashRunwayMonths: 10.1, ebitdaMarginAccounticca: 20.0, ebitdaMarginBaseline: 10.4 },
    { month: 'Month 5', revenueGrowthAccounticca: 74, revenueGrowthBaseline: 18, efficiencyAccounticca: 68, efficiencyBaseline: 17, cashRunwayMonths: 12.2, ebitdaMarginAccounticca: 23.5, ebitdaMarginBaseline: 10.6 },
    { month: 'Month 6', revenueGrowthAccounticca: 98, revenueGrowthBaseline: 22, efficiencyAccounticca: 78, efficiencyBaseline: 20, cashRunwayMonths: 14.5, ebitdaMarginAccounticca: 27.0, ebitdaMarginBaseline: 10.8 },
    { month: 'Month 8', revenueGrowthAccounticca: 132, revenueGrowthBaseline: 27, efficiencyAccounticca: 85, efficiencyBaseline: 22, cashRunwayMonths: 17.0, ebitdaMarginAccounticca: 30.5, ebitdaMarginBaseline: 11.2 },
    { month: 'Month 10', revenueGrowthAccounticca: 164, revenueGrowthBaseline: 31, efficiencyAccounticca: 90, efficiencyBaseline: 24, cashRunwayMonths: 19.2, ebitdaMarginAccounticca: 33.2, ebitdaMarginBaseline: 11.5 },
    { month: 'Month 12', revenueGrowthAccounticca: 192, revenueGrowthBaseline: 35, efficiencyAccounticca: 95, efficiencyBaseline: 26, cashRunwayMonths: 22.0, ebitdaMarginAccounticca: 36.0, ebitdaMarginBaseline: 11.8 },
  ],
  manufacturing: [
    { month: 'Month 1', revenueGrowthAccounticca: 2, revenueGrowthBaseline: 1, efficiencyAccounticca: 6, efficiencyBaseline: 2, cashRunwayMonths: 4.0, ebitdaMarginAccounticca: 6.5, ebitdaMarginBaseline: 6.2 },
    { month: 'Month 2', revenueGrowthAccounticca: 8, revenueGrowthBaseline: 2, efficiencyAccounticca: 15, efficiencyBaseline: 4, cashRunwayMonths: 4.6, ebitdaMarginAccounticca: 8.0, ebitdaMarginBaseline: 6.3 },
    { month: 'Month 3', revenueGrowthAccounticca: 18, revenueGrowthBaseline: 4, efficiencyAccounticca: 28, efficiencyBaseline: 6, cashRunwayMonths: 5.5, ebitdaMarginAccounticca: 10.2, ebitdaMarginBaseline: 6.5 },
    { month: 'Month 4', revenueGrowthAccounticca: 30, revenueGrowthBaseline: 6, efficiencyAccounticca: 40, efficiencyBaseline: 8, cashRunwayMonths: 6.8, ebitdaMarginAccounticca: 12.6, ebitdaMarginBaseline: 6.6 },
    { month: 'Month 5', revenueGrowthAccounticca: 44, revenueGrowthBaseline: 9, efficiencyAccounticca: 50, efficiencyBaseline: 10, cashRunwayMonths: 8.2, ebitdaMarginAccounticca: 15.0, ebitdaMarginBaseline: 6.8 },
    { month: 'Month 6', revenueGrowthAccounticca: 60, revenueGrowthBaseline: 11, efficiencyAccounticca: 58, efficiencyBaseline: 12, cashRunwayMonths: 9.8, ebitdaMarginAccounticca: 17.5, ebitdaMarginBaseline: 7.0 },
    { month: 'Month 8', revenueGrowthAccounticca: 82, revenueGrowthBaseline: 14, efficiencyAccounticca: 66, efficiencyBaseline: 14, cashRunwayMonths: 11.5, ebitdaMarginAccounticca: 20.0, ebitdaMarginBaseline: 7.2 },
    { month: 'Month 10', revenueGrowthAccounticca: 104, revenueGrowthBaseline: 17, efficiencyAccounticca: 73, efficiencyBaseline: 16, cashRunwayMonths: 13.0, ebitdaMarginAccounticca: 22.1, ebitdaMarginBaseline: 7.4 },
    { month: 'Month 12', revenueGrowthAccounticca: 126, revenueGrowthBaseline: 19, efficiencyAccounticca: 79, efficiencyBaseline: 18, cashRunwayMonths: 14.8, ebitdaMarginAccounticca: 24.0, ebitdaMarginBaseline: 7.5 },
  ],
  services: [
    { month: 'Month 1', revenueGrowthAccounticca: 5, revenueGrowthBaseline: 2, efficiencyAccounticca: 10, efficiencyBaseline: 3, cashRunwayMonths: 4.5, ebitdaMarginAccounticca: 9.0, ebitdaMarginBaseline: 8.8 },
    { month: 'Month 2', revenueGrowthAccounticca: 14, revenueGrowthBaseline: 4, efficiencyAccounticca: 20, efficiencyBaseline: 6, cashRunwayMonths: 5.2, ebitdaMarginAccounticca: 11.2, ebitdaMarginBaseline: 9.0 },
    { month: 'Month 3', revenueGrowthAccounticca: 28, revenueGrowthBaseline: 7, efficiencyAccounticca: 35, efficiencyBaseline: 9, cashRunwayMonths: 6.6, ebitdaMarginAccounticca: 14.0, ebitdaMarginBaseline: 9.2 },
    { month: 'Month 4', revenueGrowthAccounticca: 45, revenueGrowthBaseline: 10, efficiencyAccounticca: 48, efficiencyBaseline: 11, cashRunwayMonths: 8.2, ebitdaMarginAccounticca: 16.8, ebitdaMarginBaseline: 9.4 },
    { month: 'Month 5', revenueGrowthAccounticca: 63, revenueGrowthBaseline: 13, efficiencyAccounticca: 58, efficiencyBaseline: 13, cashRunwayMonths: 9.9, ebitdaMarginAccounticca: 19.5, ebitdaMarginBaseline: 9.6 },
    { month: 'Month 6', revenueGrowthAccounticca: 84, revenueGrowthBaseline: 16, efficiencyAccounticca: 68, efficiencyBaseline: 15, cashRunwayMonths: 11.8, ebitdaMarginAccounticca: 22.0, ebitdaMarginBaseline: 9.8 },
    { month: 'Month 8', revenueGrowthAccounticca: 112, revenueGrowthBaseline: 20, efficiencyAccounticca: 77, efficiencyBaseline: 17, cashRunwayMonths: 13.8, ebitdaMarginAccounticca: 25.2, ebitdaMarginBaseline: 10.0 },
    { month: 'Month 10', revenueGrowthAccounticca: 138, revenueGrowthBaseline: 23, efficiencyAccounticca: 84, efficiencyBaseline: 19, cashRunwayMonths: 15.6, ebitdaMarginAccounticca: 27.8, ebitdaMarginBaseline: 10.2 },
    { month: 'Month 12', revenueGrowthAccounticca: 162, revenueGrowthBaseline: 26, efficiencyAccounticca: 91, efficiencyBaseline: 21, cashRunwayMonths: 17.8, ebitdaMarginAccounticca: 30.2, ebitdaMarginBaseline: 10.4 },
  ],
};

// Custom Chart Tooltip
const CustomChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-xl shadow-xl text-slate-800 min-w-[210px] text-xs space-y-2">
        <p className="font-semibold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-xs font-medium">
            Advisory Progress
          </span>
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const isAccounticca = entry.name.toLowerCase().includes('accounticca') || entry.name.toLowerCase().includes('advisory');
            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between space-x-3">
                <span className="flex items-center space-x-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}:</span>
                </span>
                <span className={`font-mono font-bold ${isAccounticca ? 'text-blue-600' : 'text-slate-600'}`}>
                  {typeof entry.value === 'number'
                    ? entry.unit === '%'
                      ? `+${entry.value}%`
                      : entry.unit === 'mo'
                      ? `${entry.value} mo`
                      : `${entry.value}`
                    : entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ onOpenConsultation }) => {
  const [viewMode, setViewMode] = useState<MetricViewMode>('revenue');
  const [selectedCohort, setSelectedCohort] = useState<CohortType>('all');

  const currentData = cohortData[selectedCohort];
  const latestPoint = currentData[currentData.length - 1];

  // 6-Month Growth Trend Sparkline Data for Recharts
  const sparklineData = useMemo(() => {
    return currentData.slice(0, 6).map((pt, idx) => ({
      label: `M${idx + 1}`,
      revenue: pt.revenueGrowthAccounticca,
      efficiency: pt.efficiencyAccounticca,
      runway: pt.cashRunwayMonths,
      ebitda: pt.ebitdaMarginAccounticca,
    }));
  }, [currentData]);

  const cohortLabels: Record<CohortType, string> = {
    all: 'All Client Cohorts (Aggregate)',
    sme: 'SMEs & Growing Enterprises',
    tech: 'Tech & SaaS Companies',
    manufacturing: 'Manufacturing & Industrial',
    services: 'Professional & Corporate Services',
  };

  return (
    <section id="metrics" className="py-20 bg-slate-50 text-slate-800 relative overflow-hidden border-t border-slate-200">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-100/70 border border-blue-200 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Proven Advisory Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif tracking-tight leading-tight">
            Quantifiable Client Growth & Performance Metrics
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Realize measurable returns across revenue acceleration, operational bottleneck reduction, and cash runway expansion backed by Accounticca’s 4-Step Advisory Framework.
          </p>
        </div>

        {/* Top Highlight KPI Cards with 6-Month Sparkline Visualizations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden group flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue Growth Rate</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">+{latestPoint.revenueGrowthAccounticca}%</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  vs +{latestPoint.revenueGrowthBaseline}% baseline
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">Average 12-month cohort expansion after strategy deployment.</p>
            </div>

            {/* 6-Month Sparkline Recharts Chart */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>6-Month Trend</span>
                <span className="text-blue-600 font-mono font-bold">+78% @ Month 6</span>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sparkRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#sparkRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden group flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Process Efficiency</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">+{latestPoint.efficiencyAccounticca}%</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{latestPoint.efficiencyAccounticca - latestPoint.efficiencyBaseline}% net uplift
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">Workflow turnaround speed & administrative cost reduction.</p>
            </div>

            {/* 6-Month Sparkline Recharts Chart */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>6-Month Trend</span>
                <span className="text-amber-600 font-mono font-bold">+61% @ Month 6</span>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sparkEfficiency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="efficiency" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#sparkEfficiency)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden group flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cash Runway</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{latestPoint.cashRunwayMonths} mo</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +12.3 mo security
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">Rolling liquidity buffer & working capital optimization.</p>
            </div>

            {/* 6-Month Sparkline Recharts Chart */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>6-Month Trend</span>
                <span className="text-emerald-600 font-mono font-bold">10.8 mo @ Month 6</span>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sparkRunway" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="runway" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#sparkRunway)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md relative overflow-hidden group flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">EBITDA Margin Gain</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{latestPoint.ebitdaMarginAccounticca}%</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  vs {latestPoint.ebitdaMarginBaseline}% unassisted
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-1">Direct bottom-line margin expansion post-advisory.</p>
            </div>

            {/* 6-Month Sparkline Recharts Chart */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>6-Month Trend</span>
                <span className="text-indigo-600 font-mono font-bold">19.8% @ Month 6</span>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sparkEbitda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="ebitda" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#sparkEbitda)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Chart Dashboard Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
          
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            
            {/* Metric View Mode Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setViewMode('revenue')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  viewMode === 'revenue'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Revenue Growth Rate</span>
              </button>

              <button
                onClick={() => setViewMode('efficiency')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  viewMode === 'efficiency'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Operational Efficiency</span>
              </button>

              <button
                onClick={() => setViewMode('runway')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  viewMode === 'runway'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Cash Runway & EBITDA</span>
              </button>

              <button
                onClick={() => setViewMode('composite')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
                  viewMode === 'composite'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Combined Multi-Metric</span>
              </button>
            </div>

            {/* Cohort Filter Selector */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Cohort:</span>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value as CohortType)}
                className="bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs font-medium"
              >
                <option value="all">All Client Cohorts (Aggregate)</option>
                <option value="sme">SMEs & Growing Enterprises</option>
                <option value="tech">Tech & SaaS Companies</option>
                <option value="manufacturing">Manufacturing & Industrial</option>
                <option value="services">Professional & Corporate Services</option>
              </select>
            </div>
          </div>

          {/* Chart Header Subtitle */}
          <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Visualizing <strong className="text-slate-900 font-semibold">{cohortLabels[selectedCohort]}</strong> trajectory over 12 months.
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Updated with verified Accounticca cohort analytics</span>
          </div>

          {/* Recharts Chart Visualization */}
          <div className="h-[380px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'revenue' ? (
                <ComposedChart data={currentData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="colorAccRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                  <ReferenceLine y={100} label={{ value: '100% Growth Milestone', fill: '#d97706', fontSize: 10, position: 'insideTopRight' }} stroke="#d97706" strokeDasharray="4 4" />
                  
                  <Area
                    type="monotone"
                    dataKey="revenueGrowthAccounticca"
                    name="Accounticca Advisory Trajectory (%)"
                    unit="%"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#colorAccRev)"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenueGrowthBaseline"
                    name="Unassisted Industry Baseline (%)"
                    unit="%"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              ) : viewMode === 'efficiency' ? (
                <ComposedChart data={currentData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="colorAccEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />

                  <Bar
                    dataKey="efficiencyAccounticca"
                    name="Accounticca Process Efficiency Gain (%)"
                    unit="%"
                    fill="#d97706"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiencyBaseline"
                    name="Baseline Process Throughput (%)"
                    unit="%"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              ) : viewMode === 'runway' ? (
                <ComposedChart data={currentData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="colorAccEbitda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#059669" fontSize={12} unit=" mo" tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#2563eb" fontSize={12} unit="%" tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />

                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="cashRunwayMonths"
                    name="Cash Runway Buffer (Months)"
                    unit="mo"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#colorAccEbitda)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ebitdaMarginAccounticca"
                    name="EBITDA Profit Margin (%)"
                    unit="%"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              ) : (
                <ComposedChart data={currentData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} unit="%" tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />

                  <Line
                    type="monotone"
                    dataKey="revenueGrowthAccounticca"
                    name="Revenue Growth Rate (%)"
                    unit="%"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiencyAccounticca"
                    name="Operational Efficiency (%)"
                    unit="%"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ebitdaMarginAccounticca"
                    name="EBITDA Margin (%)"
                    unit="%"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Key Strategic Takeaways Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Financial Rigor & Runway</h4>
                <p className="text-slate-600 mt-0.5">Rolling cash forecast models prevent working capital traps and ensure uninterrupted capital for expansion.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">SOP & Operational Acceleration</h4>
                <p className="text-slate-600 mt-0.5">Streamlined workflows eliminate redundant steps, yielding immediate cycle time and margin improvements.</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">E-Lawyers Structural Synergy</h4>
                <p className="text-slate-600 mt-0.5">Synchronized governance with E-Lawyers protects capital while unlocking scalable growth avenues.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Ready to Accelerate Your Company's Performance?</h3>
            <p className="text-sm text-slate-600">Schedule a 1-on-1 strategy session with senior Accounticca partners to model your trajectory.</p>
          </div>
          <button
            onClick={() => onOpenConsultation && onOpenConsultation('Performance Metrics Optimization')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-98"
          >
            <span>Model Your Growth Strategy</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
