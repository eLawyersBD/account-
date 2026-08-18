import React, { useState, useMemo, useEffect } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { UpcomingMeetingWidget } from './UpcomingMeetingWidget';
import { ActivityFeed } from './ActivityFeed';
import { useNotifications } from '../context/NotificationContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  Clock,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  HelpCircle,
  ArrowRight,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Plus,
  Target,
  Milestone,
  Calendar,
  Filter,
  Tag,
  Trash2,
  Award,
  Check,
  X,
  AlertTriangle,
  Video,
  ExternalLink,
  BellRing
} from 'lucide-react';

export interface StrategicMilestone {
  id: string;
  phase: string;
  title: string;
  timeline: string;
  category: string;
  description: string;
  deliverables: string[];
  status: 'completed' | 'in_progress' | 'upcoming';
  kpiImpact: string;
}

const INITIAL_MILESTONES: StrategicMilestone[] = [
  {
    id: 'm1',
    phase: 'Phase 1',
    title: 'Comprehensive 5-Day P&L & Balance Sheet Diagnostic',
    timeline: 'Month 1 (Days 1–15)',
    category: 'Financial Audit',
    description: 'Deep-dive audit of chart of accounts, vendor overhead leakage, tax drag points, and working capital cycle inefficiencies.',
    deliverables: ['3-Year Historical Trend Report', '18% Overhead Cost Reduction Blueprint', 'Tax Drag Risk Mitigation Summary'],
    status: 'completed',
    kpiImpact: '+12 Health Score Points'
  },
  {
    id: 'm2',
    phase: 'Phase 2',
    title: 'Legal Entity Tax Optimization & Runway Guardrails',
    timeline: 'Month 1–2',
    category: 'Tax Optimization',
    description: 'Establish tax-efficient corporate holding structures, deductibility frameworks, and automated 6-month cash reserve pools.',
    deliverables: ['Corporate Entity Restructuring Plan', 'Quarterly Tax Deductibility Matrix', 'Automated Treasury Reserve Protocol'],
    status: 'completed',
    kpiImpact: '8% Tax Expense Saved'
  },
  {
    id: 'm3',
    phase: 'Phase 3',
    title: 'ERP Systems & Accounts Pipeline Workflows Automation',
    timeline: 'Month 3–4',
    category: 'Systems & ERP',
    description: 'Integrate cloud accounting, automated accounts receivable reminders, and digital expense approvals to streamline operations.',
    deliverables: ['Cloud Accounting ERP Migration', 'Automated AR/AP Approval Pipeline', 'Real-Time Cash Runway Dashboard'],
    status: 'in_progress',
    kpiImpact: '-40 Admin Work Hours Saved/mo'
  },
  {
    id: 'm4',
    phase: 'Phase 4',
    title: 'Fractional CFO Governance & Board Pitch Preparation',
    timeline: 'Month 5–8',
    category: 'CFO Governance',
    description: 'Monthly executive board reviews, scenario sensitivity modeling, capital allocation benchmarks, and unit economics optimization.',
    deliverables: ['Executive Board Deck Templates', '3-Year DCF Financial Model', 'Capital Allocation Strategy Guide'],
    status: 'upcoming',
    kpiImpact: '+25% Profit Margin Uplift'
  },
  {
    id: 'm5',
    phase: 'Phase 5',
    title: 'Enterprise Valuation Expansion & Investor Data Room',
    timeline: 'Month 9–12',
    category: 'CFO Governance',
    description: 'Prepare audited financial statements and construct a secure virtual data room for prospective institutional investors or M&A buyers.',
    deliverables: ['Audited Financial Package', 'Investor Due Diligence Vault', 'Series A / Institutional Pitch Deck'],
    status: 'upcoming',
    kpiImpact: '2.5x Valuation Multiple Boost'
  }
];

interface BusinessHealthDashboardProps {
  onOpenConsultation?: (note?: string) => void;
  onOpenGoogleMeet?: () => void;
  onOpenWorkspaceSuite?: (tab?: 'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms') => void;
}

export const BusinessHealthDashboard: React.FC<BusinessHealthDashboardProps> = ({ onOpenConsultation, onOpenGoogleMeet, onOpenWorkspaceSuite }) => {
  // Urgent Meeting Alert Logic (<1 hour)
  const { scheduledReminders } = useNotifications();
  const [now, setNow] = useState(Date.now());
  const [showAlertBanner, setShowAlertBanner] = useState(true);

  // Live timer tick every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute if a High Priority or Urgent meeting is within 1 hour
  const urgentMeetingAlert = useMemo(() => {
    const ONE_HOUR_MS = 60 * 60 * 1000;

    // Check scheduled reminders from notification context
    const urgentReminder = scheduledReminders.find((r) => {
      const isUrgent = r.priority === 'Urgent' || r.priority === 'High Priority' || r.title.toLowerCase().includes('urgent');
      const timeDiff = r.eventTimeMs - now;
      return isUrgent && timeDiff > -30 * 60 * 1000 && timeDiff <= ONE_HOUR_MS;
    });

    if (urgentReminder) {
      const diffMs = Math.max(0, urgentReminder.eventTimeMs - now);
      const minsLeft = Math.ceil(diffMs / (1000 * 60));
      return {
        title: urgentReminder.title,
        meetUri: urgentReminder.meetUri,
        formattedTime: urgentReminder.formattedTime,
        minsLeft,
        isCustom: true,
      };
    }

    // Default simulated high-priority meeting within 1 hour (42 mins)
    const fallbackTargetTime = now + 42 * 60 * 1000;
    const minsLeft = Math.ceil((fallbackTargetTime - now) / (1000 * 60));
    return {
      title: '🚨 Urgent Board Tax Audit & Compliance Review',
      meetUri: 'https://meet.google.com/acc-advisory-session',
      formattedTime: new Date(fallbackTargetTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      minsLeft,
      isCustom: false,
    };
  }, [scheduledReminders, now]);

  // Simulator Controls State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(100000); // $100k
  const [expenseRatio, setExpenseRatio] = useState<number>(75); // 75%
  const [timeHorizon, setTimeHorizon] = useState<number>(12); // 12 months
  const [scenarioMode, setScenarioMode] = useState<'conservative' | 'standard' | 'aggressive'>('standard');
  
  // Service toggle optimizations
  const [enableTaxOpt, setEnableTaxOpt] = useState<boolean>(true);
  const [enableCashRunway, setEnableCashRunway] = useState<boolean>(true);
  const [enableProcessAudit, setEnableProcessAudit] = useState<boolean>(true);

  // Growth Roadmap State
  const [milestones, setMilestones] = useState<StrategicMilestone[]>(INITIAL_MILESTONES);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>('m3');
  const [roadmapFilter, setRoadmapFilter] = useState<'all' | 'completed' | 'in_progress' | 'upcoming'>('all');
  
  // Modal State for adding custom objective
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState('Phase 6');
  const [newTimeline, setNewTimeline] = useState('Month 12+');
  const [newCategory, setNewCategory] = useState('CFO Governance');
  const [newDescription, setNewDescription] = useState('');
  const [newKpiImpact, setNewKpiImpact] = useState('');
  const [newDeliverables, setNewDeliverables] = useState('');

  // Milestone Progress Statistics
  const completedCount = useMemo(() => milestones.filter(m => m.status === 'completed').length, [milestones]);
  const inProgressCount = useMemo(() => milestones.filter(m => m.status === 'in_progress').length, [milestones]);
  const upcomingCount = useMemo(() => milestones.filter(m => m.status === 'upcoming').length, [milestones]);
  const progressPercent = useMemo(() => Math.round((completedCount / (milestones.length || 1)) * 100), [completedCount, milestones]);

  const handleToggleStatus = (id: string) => {
    let updatedTitle = '';
    let updatedStatusStr = '';

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus: Record<string, 'completed' | 'in_progress' | 'upcoming'> = {
          upcoming: 'in_progress',
          in_progress: 'completed',
          completed: 'upcoming',
        };
        const newStat = nextStatus[m.status];
        updatedTitle = m.title;
        updatedStatusStr = newStat.replace('_', ' ');
        return { ...m, status: newStat };
      })
    );

    window.dispatchEvent(
      new CustomEvent('accounticca_log_activity', {
        detail: {
          type: 'milestone',
          title: `Milestone Status Changed: ${updatedTitle || 'Roadmap Milestone'}`,
          description: `Updated strategic roadmap milestone progress to "${updatedStatusStr.toUpperCase()}".`,
          actor: 'Strategic Advisory User',
          metadata: `Roadmap Progress: ${progressPercent}%`
        }
      })
    );
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const deliverablesList = newDeliverables
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const newItem: StrategicMilestone = {
      id: `custom-${Date.now()}`,
      phase: newPhase || `Phase ${milestones.length + 1}`,
      title: newTitle.trim(),
      timeline: newTimeline || 'Custom Timeline',
      category: newCategory || 'Strategic Objective',
      description: newDescription.trim() || 'Custom strategic objective added to roadmap.',
      deliverables: deliverablesList.length > 0 ? deliverablesList : ['Defined Key Deliverables & Milestones'],
      status: 'upcoming',
      kpiImpact: newKpiImpact.trim() || 'Growth Impact Measured Upon Completion',
    };

    setMilestones((prev) => [...prev, newItem]);
    setExpandedMilestoneId(newItem.id);

    window.dispatchEvent(
      new CustomEvent('accounticca_log_activity', {
        detail: {
          type: 'milestone',
          title: `New Milestone Added: ${newItem.title}`,
          description: `Added custom strategic objective to ${newItem.phase} (${newItem.category}).`,
          actor: 'Managing Director',
          metadata: `Category: ${newItem.category}`
        }
      })
    );

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewKpiImpact('');
    setNewDeliverables('');
    setShowAddModal(false);
  };

  const handleDeleteMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Category badge color helper
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Financial Audit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tax Optimization':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Systems & ERP':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CFO Governance':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Derived calculations for 12 or 24 months simulation projection
  const { chartData, kpis, healthScoreBefore, healthScoreAfter } = useMemo(() => {
    // Growth multiplier per month based on scenario & enabled services
    let monthlyGrowthBaseline = 0.015; // 1.5% natural monthly growth
    let monthlyGrowthAccounticca = 0.015;

    // Service add-ons boost
    let taxSavingsPercent = enableTaxOpt ? 0.08 : 0; // 8% expense reduction
    let processEfficiencyBoost = enableProcessAudit ? 0.025 : 0; // 2.5% monthly compound boost
    let runwayBoostMonths = enableCashRunway ? 8 : 2;

    if (scenarioMode === 'conservative') {
      monthlyGrowthAccounticca += 0.02 + processEfficiencyBoost;
    } else if (scenarioMode === 'standard') {
      monthlyGrowthAccounticca += 0.038 + processEfficiencyBoost;
    } else {
      monthlyGrowthAccounticca += 0.055 + processEfficiencyBoost;
    }

    const data = [];
    let currentBaselineRev = monthlyRevenue;
    let currentAccounticcaRev = monthlyRevenue;

    let cumulativeProfitBaseline = 0;
    let cumulativeProfitAccounticca = 0;

    for (let month = 1; month <= timeHorizon; month++) {
      currentBaselineRev = currentBaselineRev * (1 + monthlyGrowthBaseline);
      currentAccounticcaRev = currentAccounticcaRev * (1 + monthlyGrowthAccounticca);

      const baselineExpense = currentBaselineRev * (expenseRatio / 100);
      const accounticcaExpense = currentAccounticcaRev * ((expenseRatio - (taxSavingsPercent * 100)) / 100);

      const baselineProfit = currentBaselineRev - baselineExpense;
      const accounticcaProfit = currentAccounticcaRev - accounticcaExpense;

      cumulativeProfitBaseline += baselineProfit;
      cumulativeProfitAccounticca += accounticcaProfit;

      data.push({
        month: `M${month}`,
        BaselineRevenue: Math.round(currentBaselineRev),
        AccounticcaRevenue: Math.round(currentAccounticcaRev),
        BaselineProfit: Math.round(baselineProfit),
        AccounticcaProfit: Math.round(accounticcaProfit),
        ExpensesSaved: Math.round(baselineExpense - accounticcaExpense)
      });
    }

    const profitUplift = cumulativeProfitAccounticca - cumulativeProfitBaseline;
    const avgMonthlyRetainer = 3500;
    const totalRetainerCost = avgMonthlyRetainer * timeHorizon;
    const roi = Math.max(1.8, Math.round((profitUplift / totalRetainerCost) * 10) / 10);

    const initialRunway = Math.max(3, Math.round((monthlyRevenue * (1 - expenseRatio / 100) * 4) / 10000));
    const finalRunway = initialRunway + runwayBoostMonths;

    // Health score index calculation
    const baseScore = Math.min(65, Math.max(35, 100 - expenseRatio + (monthlyRevenue > 150000 ? 15 : 5)));
    const postScore = Math.min(98, baseScore + (enableTaxOpt ? 12 : 0) + (enableProcessAudit ? 14 : 0) + (enableCashRunway ? 10 : 0));

    return {
      chartData: data,
      kpis: {
        cumulativeProfitBaseline,
        cumulativeProfitAccounticca,
        profitUplift,
        roi,
        initialRunway,
        finalRunway
      },
      healthScoreBefore: baseScore,
      healthScoreAfter: postScore
    };
  }, [monthlyRevenue, expenseRatio, timeHorizon, scenarioMode, enableTaxOpt, enableCashRunway, enableProcessAudit]);

  const handleExportPDF = () => {
    window.dispatchEvent(
      new CustomEvent('accounticca_log_activity', {
        detail: {
          type: 'report',
          title: 'Stakeholder Financial Health PDF Report Exported',
          description: `Exported financial summary for stakeholder review. Projected ROI: ${kpis.roi}x over ${timeHorizon} months.`,
          actor: 'Executive Dashboard User',
          metadata: `Health Index: ${healthScoreAfter}/100`
        }
      })
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the stakeholder PDF summary.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accounticca Business Health Summary & Financial Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .brand { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: -0.5px; }
            .title { font-size: 20px; font-weight: bold; margin-top: 5px; color: #0f172a; }
            .subtitle { color: #64748b; font-size: 13px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
            .metric-val { font-size: 32px; font-weight: bold; color: #2563eb; font-family: monospace; }
            .metric-label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; letter-spacing: 0.5px; margin-bottom: 8px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; font-size: 13px; }
            .table th { background: #f1f5f9; font-weight: bold; color: #334155; }
            .badge { background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; display: inline-block; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">ACCOUNTICCA ADVISORY</div>
              <div class="title">Stakeholder Financial Health & Executive Summary</div>
              <div class="subtitle">Prepared on ${todayStr} for Board Review & Strategy Alignment</div>
            </div>
            <div style="text-align: right;">
              <div class="badge">
                HEALTH SCORE: ${healthScoreAfter}/100
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="metric-label">Input Financial Baseline</div>
              <p style="margin: 4px 0;"><strong>Monthly Baseline Revenue:</strong> $${monthlyRevenue.toLocaleString()}</p>
              <p style="margin: 4px 0;"><strong>Operating Expense Ratio:</strong> ${expenseRatio}%</p>
              <p style="margin: 4px 0;"><strong>Strategy Intensity:</strong> ${scenarioMode.toUpperCase()}</p>
              <p style="margin: 4px 0;"><strong>Advisory Horizon:</strong> ${timeHorizon} Months</p>
            </div>
            <div class="card">
              <div class="metric-label">Projected Advisory ROI</div>
              <div class="metric-val">+$${kpis.profitUplift.toLocaleString()}</div>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569;">Cumulative Profit Uplift over ${timeHorizon} months</p>
              <p style="margin: 6px 0 0 0; font-size: 13px; font-weight: bold; color: #059669;">
                Estimated ROI: ${kpis.roi}x Multiple | Cash Runway: ${kpis.initialRunway} mo → ${kpis.finalRunway} mo
              </p>
            </div>
          </div>

          <h3 style="margin-top: 30px; font-size: 16px;">Strategic Recommendations & Execution Pillars</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Advisory Pillar</th>
                <th>Target Improvement Outcome</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tax & Deductible Optimization</strong></td>
                <td>Leverage legal corporate structures & tax savings (${enableTaxOpt ? 'Active' : 'Optional'})</td>
                <td>${enableTaxOpt ? 'Included' : 'Pending Review'}</td>
              </tr>
              <tr>
                <td><strong>Process Audit & Automation</strong></td>
                <td>Eliminate administrative bloat and reduce overhead by 15%</td>
                <td>${enableProcessAudit ? 'Included' : 'Pending Review'}</td>
              </tr>
              <tr>
                <td><strong>Cash Runway Extension</strong></td>
                <td>Optimized working capital cycle to reach ${kpis.finalRunway} months stability</td>
                <td>${enableCashRunway ? 'Included' : 'Pending Review'}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Confidential Stakeholder Document — Prepared by Accounticca Business Consulting Services.<br/>
            Contact: advisory@accounticca.com | https://accounticca.com
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${Math.round(val / 1000)}k`;
  };

  return (
    <section id="dashboard" className="py-24 bg-white text-slate-900 border-b border-slate-200 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
              <Activity className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Interactive Financial Growth Simulator</span>
            </div>

            {/* Pulsing Visual Alert Badge for High Priority Meeting within 1 Hour */}
            {urgentMeetingAlert && (
              <div
                className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/40 px-3.5 py-1.5 rounded-full text-rose-700 text-xs font-bold tracking-wide shadow-xs animate-pulse cursor-pointer hover:bg-rose-500/20 transition"
                onClick={() => setShowAlertBanner(true)}
                title="Click to expand high priority meeting alert"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                <span>URGENT TASK (&lt;1H): {urgentMeetingAlert.minsLeft}M LEFT</span>
              </div>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Simulate Your Business Financial Trajectory
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Adjust your current metrics below to model how Accounticca’s strategic advisory, cash runway optimization, and operational efficiency can transform your bottom line.
          </p>
        </AnimatedSection>

        {/* High Priority Meeting Visual Alert Banner (<1 hour) */}
        {urgentMeetingAlert && showAlertBanner && (
          <AnimatedSection animation="fade-up" className="mb-10">
            <div className="bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-md text-slate-900 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Pulse background ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start space-x-4 relative z-10">
                <div className="relative shrink-0 mt-0.5">
                  <span className="absolute -inset-1 rounded-2xl bg-rose-500 opacity-75 animate-ping" />
                  <div className="relative w-12 h-12 rounded-2xl bg-rose-600 border border-rose-400/80 flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                      <span>HIGH PRIORITY ALERT • WITHIN 1 HOUR</span>
                    </span>
                    <span className="text-xs font-semibold text-rose-700 font-mono">
                      Starts in {urgentMeetingAlert.minsLeft} mins ({urgentMeetingAlert.formattedTime})
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 leading-snug">
                    {urgentMeetingAlert.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    Executive team virtual consultation is starting shortly. Immediate visual cue active for urgent business tasks.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto relative z-10">
                <a
                  href={urgentMeetingAlert.meetUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/30 flex items-center justify-center space-x-2 group"
                >
                  <Video className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Join Urgent Session</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {onOpenGoogleMeet && (
                  <button
                    type="button"
                    onClick={onOpenGoogleMeet}
                    className="px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-300 transition flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span className="hidden sm:inline">Calendar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowAlertBanner(false)}
                  className="p-2 rounded-xl text-rose-600 hover:text-rose-900 hover:bg-rose-100 transition"
                  title="Dismiss Alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Controls */}
          <AnimatedSection animation="fade-up" delay={100} className="lg:col-span-4 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-lg">
                <Sliders className="w-5 h-5 text-blue-600" />
                <span>Simulation Parameters</span>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Slider 1: Monthly Revenue */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Current Monthly Revenue</label>
                <span className="font-bold text-blue-600 font-mono text-sm">
                  ${monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={500000}
                step={5000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$20k</span>
                <span>$250k</span>
                <span>$500k</span>
              </div>
            </div>

            {/* Slider 2: Expense Ratio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Operating Expense Ratio</label>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {expenseRatio}%
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={90}
                step={1}
                value={expenseRatio}
                onChange={(e) => setExpenseRatio(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40% (High Margin)</span>
                <span>90% (Lean Profit)</span>
              </div>
            </div>

            {/* Time Horizon Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Advisory Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {[6, 12, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimeHorizon(m)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      timeHorizon === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Growth Scenario Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Strategy Intensity</label>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {(['conservative', 'standard', 'aggressive'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setScenarioMode(mode)}
                    className={`py-2 rounded-xl border capitalize font-semibold transition ${
                      scenarioMode === mode
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Strategic Advisory Modules Enabled */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-800">
                Accounticca Advisory Modules Applied:
              </label>

              <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTaxOpt}
                  onChange={(e) => setEnableTaxOpt(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="font-medium">Tax Drag Mitigation (-8% leakage)</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableProcessAudit}
                  onChange={(e) => setEnableProcessAudit(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="font-medium">Process Bottleneck Removal (+2.5%/mo)</span>
              </label>

              <label className="flex items-center space-x-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCashRunway}
                  onChange={(e) => setEnableCashRunway(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="font-medium">Fractional CFO Runway Governance</span>
              </label>
            </div>

            {/* Health Score Comparison Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Business Health Rating Index</span>
                <span className="text-[10px] text-slate-400">Score out of 100</span>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1 bg-slate-100 p-2 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Baseline</p>
                  <p className="text-xl font-bold font-mono text-slate-600">{healthScoreBefore}</p>
                </div>
                
                <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />

                <div className="text-center flex-1 bg-blue-50 border border-blue-200 p-2 rounded-xl">
                  <p className="text-[10px] text-blue-700 uppercase font-semibold">Accounticca</p>
                  <p className="text-xl font-bold font-mono text-blue-600">{healthScoreAfter}</p>
                </div>
              </div>
            </div>

          </AnimatedSection>

          {/* Right Column: Dynamic KPI Display & Recharts Visualizations */}
          <AnimatedSection animation="fade-up" delay={200} className="lg:col-span-8 space-y-6">
            
            {/* Upcoming Google Meet Countdown Widget */}
            <UpcomingMeetingWidget onOpenGoogleMeet={onOpenGoogleMeet} />

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Cumulative Profit Uplift */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg space-y-1 relative overflow-hidden">
                <Sparkles className="absolute -bottom-2 -right-2 w-20 h-20 text-white/10 pointer-events-none" />
                <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                  Projected Profit Uplift
                </p>
                <p className="text-2xl sm:text-3xl font-serif font-bold font-mono">
                  +${kpis.profitUplift.toLocaleString()}
                </p>
                <p className="text-[11px] text-blue-200 pt-1">
                  Over {timeHorizon} months vs status quo
                </p>
              </div>

              {/* Card 2: Estimated ROI */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 text-slate-900 rounded-2xl p-5 shadow-xs space-y-1">
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Advisory ROI Multiple
                </p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 font-mono">
                  {kpis.roi}x ROI
                </p>
                <p className="text-[11px] text-slate-600 pt-1">
                  Estimated value per retainer dollar
                </p>
              </div>

              {/* Card 3: Cash Runway Expansion */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
                <div className="w-full h-24 bg-blue-50 rounded-xl mb-3 flex items-center justify-center text-blue-300">
                  <PieChartIcon className="w-10 h-10" />
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cash Runway Security
                </p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 font-mono">
                  {kpis.initialRunway} mo <span className="text-blue-600">→ {kpis.finalRunway} mo</span>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Extended operational runway buffer
                </p>
              </div>

            </div>

            {/* Main Recharts Area Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
                    <LineChartIcon className="w-5 h-5 text-blue-600" />
                    <span>Monthly Revenue & Net Profit Comparison</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparing default operational trajectory against Accounticca optimized performance.
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-xs flex-wrap gap-2">
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                    <span>Accounticca Revenue</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                    <span>Baseline Revenue</span>
                  </span>

                  <button
                    onClick={handleExportPDF}
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition flex items-center space-x-1.5 border border-blue-200 shrink-0 shadow-2xs"
                    title="Export summary as PDF document for stakeholders"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export Stakeholder PDF</span>
                  </button>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="w-full h-72 sm:h-80 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="accounticcaColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#93c5fd' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="AccounticcaRevenue"
                      name="Accounticca Trajectory"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#accounticcaColor)"
                    />
                    <Area
                      type="monotone"
                      dataKey="BaselineRevenue"
                      name="Baseline Trajectory"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#baselineColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Action Callout inside Simulator */}
              <div className="bg-slate-50 border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <p className="text-xs font-serif font-bold text-slate-900">
                    Want an exact financial audit tailored to your actual P&L?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Our senior advisors perform confidential 5-day financial health audits for SMEs.
                  </p>
                </div>

                <div className="flex items-center space-x-2 flex-wrap gap-2 shrink-0">
                  {onOpenWorkspaceSuite && (
                    <div className="flex items-center space-x-1 bg-slate-200/80 p-1 rounded-full">
                      <button
                        onClick={() => onOpenWorkspaceSuite('sheets')}
                        type="button"
                        className="px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs flex items-center space-x-1"
                        title="Export to Google Sheets"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>Google Sheets</span>
                      </button>
                      <button
                        onClick={() => onOpenWorkspaceSuite('drive')}
                        type="button"
                        className="px-2.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-2xs"
                        title="Save to Google Drive"
                      >
                        Drive
                      </button>
                      <button
                        onClick={() => onOpenWorkspaceSuite('gmail')}
                        type="button"
                        className="px-2.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-2xs"
                        title="Email via Gmail"
                      >
                        Gmail
                      </button>
                      <button
                        onClick={() => onOpenWorkspaceSuite('calendar')}
                        type="button"
                        className="px-2.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-2xs"
                        title="Book Calendar Event"
                      >
                        Calendar
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleExportPDF}
                    type="button"
                    className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap shrink-0"
                  >
                    <Printer className="w-4 h-4 text-blue-400" />
                    <span>Export PDF</span>
                  </button>

                  {onOpenConsultation && (
                    <button
                      onClick={() =>
                        onOpenConsultation(
                          `Simulated Scenario: Monthly Rev: $${monthlyRevenue.toLocaleString()}, Expense Ratio: ${expenseRatio}%, Horizon: ${timeHorizon} months`
                        )
                      }
                      className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-md shadow-blue-600/20 whitespace-nowrap shrink-0"
                    >
                      <span>Request Custom Audit</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </AnimatedSection>

        </div>

        {/* Interactive Strategic Growth Roadmap Section */}
        <AnimatedSection animation="fade-up" delay={300} className="mt-16 sm:mt-24 pt-12 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200/90 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-blue-100/80 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Milestone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Interactive Growth Roadmap</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Strategic Milestone Execution Roadmap
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Track completed advisory steps, active operational transformation stages, and target long-term enterprise valuation objectives. Click checkmarks to update milestone progress.
                </p>
              </div>

              {/* Roadmap Actions & Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <div className="bg-white border border-slate-200/90 p-4 rounded-2xl min-w-[220px] shadow-xs">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Roadmap Progress</span>
                    <span className="text-blue-700 font-bold font-mono">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span>{completedCount} Completed</span>
                    <span>{inProgressCount} Active</span>
                    <span>{upcomingCount} Upcoming</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Strategic Objective</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 pb-2">
              <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Filter Milestones:</span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {[
                  { key: 'all', label: `All Milestones (${milestones.length})` },
                  { key: 'completed', label: `Completed (${completedCount})` },
                  { key: 'in_progress', label: `In Progress (${inProgressCount})` },
                  { key: 'upcoming', label: `Upcoming (${upcomingCount})` }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setRoadmapFilter(filter.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      roadmapFilter === filter.key
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Timeline Container */}
            <div className="relative pt-6 pl-4 sm:pl-8">
              {/* Vertical Continuous Line */}
              <div className="absolute left-6 sm:left-10 top-10 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-300 to-slate-200" />

              <div className="space-y-8">
                {milestones
                  .filter((m) => (roadmapFilter === 'all' ? true : m.status === roadmapFilter))
                  .map((item) => {
                    const isExpanded = expandedMilestoneId === item.id;

                    return (
                      <div key={item.id} className="relative pl-8 sm:pl-12 group">
                        
                        {/* Interactive Timeline Node Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.id)}
                          title={`Click to update status (Current: ${item.status})`}
                          className={`absolute -left-3 sm:-left-1 top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 hover:scale-110 cursor-pointer ${
                            item.status === 'completed'
                              ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30'
                              : item.status === 'in_progress'
                              ? 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/20 animate-pulse'
                              : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                          }`}
                        >
                          {item.status === 'completed' ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : item.status === 'in_progress' ? (
                            <Zap className="w-4 h-4 text-blue-200 fill-blue-200" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Milestone Card */}
                        <div
                          className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 ${
                            isExpanded
                              ? 'bg-white border-blue-500/80 shadow-md ring-1 ring-blue-500/20'
                              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          {/* Card Top Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                            <div className="flex items-center space-x-2.5 flex-wrap gap-1.5">
                              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                                {item.phase}
                              </span>

                              <span className="text-[11px] font-semibold text-slate-600 flex items-center space-x-1 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span>{item.timeline}</span>
                              </span>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadge(item.category)}`}>
                                {item.category}
                              </span>
                            </div>

                            {/* Status Selector Badge */}
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item.id)}
                                className={`text-[11px] font-bold px-3 py-1 rounded-full border transition flex items-center space-x-1.5 cursor-pointer ${
                                  item.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : item.status === 'in_progress'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                }`}
                                title="Click to cycle status"
                              >
                                {item.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                {item.status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
                                {item.status === 'upcoming' && <Circle className="w-3.5 h-3.5 text-slate-500" />}
                                <span className="capitalize">{item.status.replace('_', ' ')}</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteMilestone(item.id, e)}
                                title="Delete Milestone"
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div className="space-y-1.5 cursor-pointer" onClick={() => setExpandedMilestoneId(isExpanded ? null : item.id)}>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center justify-between">
                              <span>{item.title}</span>
                              <span className="text-slate-400 text-xs ml-2">
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                              </span>
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* KPI Impact Callout */}
                          <div className="mt-3 inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-semibold text-indigo-800">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>Target KPI Impact: <strong className="text-indigo-950">{item.kpiImpact}</strong></span>
                          </div>

                          {/* Expandable Key Deliverables */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 animate-fadeIn">
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                                <Target className="w-3.5 h-3.5 text-blue-600" />
                                <span>Core Advisory Deliverables:</span>
                              </p>

                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                                {item.deliverables.map((deliv, dIdx) => (
                                  <li key={dIdx} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                    <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${item.status === 'completed' ? 'text-emerald-600' : 'text-blue-600'}`} />
                                    <span>{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}

                {milestones.filter((m) => (roadmapFilter === 'all' ? true : m.status === roadmapFilter)).length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No milestones match the current "{roadmapFilter}" filter.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Accounticca Advisory SLA: Guaranteed quarterly milestone validation with dedicated partner overview.</span>
              </div>

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={() => onOpenConsultation('Inquiry regarding Strategic Growth Roadmap Execution & Advisory Milestones.')}
                  className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 transition shrink-0 cursor-pointer"
                >
                  Discuss Roadmap Execution with Senior Partner &rarr;
                </button>
              )}
            </div>

          </div>
        </AnimatedSection>

        {/* Recent Engagement Activity Feed Section */}
        <AnimatedSection animation="fade-up" delay={400} className="mt-16 sm:mt-24 pt-12 border-t border-slate-200">
          <ActivityFeed
            onOpenConsultation={onOpenConsultation}
            onOpenGoogleMeet={onOpenGoogleMeet}
          />
        </AnimatedSection>

        {/* Modal: Add Custom Strategic Objective */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-900 shadow-2xl relative space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-2">
                  <Milestone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-serif font-bold text-slate-900">Add Custom Strategic Objective</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Objective Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Export Market Compliance & International Tax Audit"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phase Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Phase 6"
                      value={newPhase}
                      onChange={(e) => setNewPhase(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Timeline Target</label>
                    <input
                      type="text"
                      placeholder="e.g. Month 12-18"
                      value={newTimeline}
                      onChange={(e) => setNewTimeline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Financial Audit">Financial Audit</option>
                    <option value="Tax Optimization">Tax Optimization</option>
                    <option value="Systems & ERP">Systems & ERP</option>
                    <option value="CFO Governance">CFO Governance</option>
                    <option value="Custom Strategic">Custom Strategic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe the purpose and strategic outcome of this milestone..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target KPI Impact</label>
                  <input
                    type="text"
                    placeholder="e.g. +15% Operating Margin or $50k Overhead Saved"
                    value={newKpiImpact}
                    onChange={(e) => setNewKpiImpact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Deliverables (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tax Audit Dossier, Entity Filings, Operational SOPs"
                    value={newDeliverables}
                    onChange={(e) => setNewDeliverables(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    Save Objective
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
