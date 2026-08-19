import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  Sliders,
  Award,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Info,
  Activity,
  Eye,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Trash2,
  RotateCcw,
  Plus,
  FolderPlus,
  Check,
  Split,
  Cloud,
  CloudCheck,
  Database,
  LogIn,
  UserCheck,
  RefreshCw,
  Lock
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  subscribeToUserScenarios,
  saveScenarioToFirestore,
  deleteScenarioFromFirestore,
  syncLocalScenariosToFirestore
} from '../lib/scenarioService';
import { SavedGrowthScenario } from '../types';
import { AnimatedSection } from './AnimatedSection';

export interface GrowthROICalculatorProps {
  onOpenConsultation?: (scenarioText?: string) => void;
  onOpenMeeting?: () => void;
  onOpenWorkspaceSuite?: (tool: string) => void;
  onOpenClientPortal?: () => void;
}

export const GrowthROICalculator: React.FC<GrowthROICalculatorProps> = ({
  onOpenConsultation,
  onOpenMeeting,
  onOpenWorkspaceSuite,
  onOpenClientPortal
}) => {
  // Authentication & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'local' | 'error'>('local');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Calculator Core Inputs
  const [currentRevenue, setCurrentRevenue] = useState<number>(750000);
  const [targetGrowthPercent, setTargetGrowthPercent] = useState<number>(35);
  const [grossMarginPercent, setGrossMarginPercent] = useState<number>(50);
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(3);
  const [timeframeView, setTimeframeView] = useState<'12_months' | 'multi_year'>('12_months');
  const [chartViewMode, setChartViewMode] = useState<'revenue' | 'profit' | 'valuation'>('revenue');

  // Trend Line Overlay Controls
  const [showTrendLineOverlay, setShowTrendLineOverlay] = useState<boolean>(true);
  const [showBaselineTrendOverlay, setShowBaselineTrendOverlay] = useState<boolean>(true);
  const [showLinearBenchmark, setShowLinearBenchmark] = useState<boolean>(false);
  const [activeMonthHighlight, setActiveMonthHighlight] = useState<number | null>(null);

  // Strategy Levers Enabled
  const [enablePricingOptimization, setEnablePricingOptimization] = useState<boolean>(true);
  const [enableWorkingCapitalRelease, setEnableWorkingCapitalRelease] = useState<boolean>(true);
  const [enableTaxAndOpexMitigation, setEnableTaxAndOpexMitigation] = useState<boolean>(true);
  const [enableSalesVelocityAudit, setEnableSalesVelocityAudit] = useState<boolean>(true);

  // Saved Scenarios State (Max 3, persisted in Firestore when authenticated or localStorage when offline)
  const [savedScenarios, setSavedScenarios] = useState<SavedGrowthScenario[]>(() => {
    try {
      const local = localStorage.getItem('accounticca_saved_growth_scenarios');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed.slice(0, 3);
      }
    } catch (e) {
      console.error('Failed to load saved scenarios from localStorage', e);
    }
    return [];
  });

  const [isAddingScenario, setIsAddingScenario] = useState<boolean>(false);
  const [scenarioCustomName, setScenarioCustomName] = useState<string>('');
  const [loadedScenarioId, setLoadedScenarioId] = useState<string | null>(null);

  // Helper to show transient notifications
  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 4000);
  };

  // Auth Listener and Cloud Synchronization Engine
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setSyncStatus('saving');
        // Check for local scenarios and sync them to Firestore
        try {
          const local = localStorage.getItem('accounticca_saved_growth_scenarios');
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              syncLocalScenariosToFirestore(user.uid, parsed);
            }
          }
        } catch (e) {
          console.warn('Local scenario migration notice:', e);
        }

        // Subscribe to real-time updates from Firestore
        const unsubscribeScenarios = subscribeToUserScenarios(
          user.uid,
          (cloudScenarios) => {
            setSavedScenarios(cloudScenarios);
            setSyncStatus('synced');
          },
          (err) => {
            console.error('Scenario sync error:', err);
            setSyncStatus('error');
          }
        );

        return () => {
          unsubscribeScenarios();
        };
      } else {
        // Fallback to local storage for guest / unauthenticated users
        setSyncStatus('local');
        try {
          const local = localStorage.getItem('accounticca_saved_growth_scenarios');
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) setSavedScenarios(parsed.slice(0, 3));
          }
        } catch (e) {
          console.error('Local scenario load error:', e);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Quick preset buttons
  const PRESET_SCENARIOS = [
    { label: 'Early-Stage Startup', revenue: 250000, targetGrowth: 60, margin: 45 },
    { label: 'Growing SME', revenue: 750000, targetGrowth: 35, margin: 50 },
    { label: 'Scaling Enterprise', revenue: 2500000, targetGrowth: 25, margin: 55 },
    { label: 'Mature Mid-Market', revenue: 6000000, targetGrowth: 18, margin: 60 }
  ];

  // Mathematical Modeling & Computations
  const calculations = useMemo(() => {
    // Advisory Alpha multipliers based on toggled levers
    let advisoryGrowthLift = 0;
    let marginExpansionLift = 0;
    let costLeakageReduction = 0;

    if (enableSalesVelocityAudit) advisoryGrowthLift += 14; // +14% faster growth
    if (enablePricingOptimization) marginExpansionLift += 5.5; // +5.5% gross margin boost
    if (enableWorkingCapitalRelease) advisoryGrowthLift += 6; // +6% reinvestment capacity
    if (enableTaxAndOpexMitigation) costLeakageReduction += 4.5; // +4.5% bottom line savings

    const effectiveTargetGrowth = targetGrowthPercent / 100;
    const effectiveAdvisoryGrowth = (targetGrowthPercent + advisoryGrowthLift) / 100;
    const baseMargin = grossMarginPercent / 100;
    const optimizedMargin = (grossMarginPercent + marginExpansionLift) / 100;

    // 12-Month Month-by-Month Projected Trajectory Engine
    const monthlyStartingRev = Math.round(currentRevenue / 12);
    const monthlyBaseCompoundRate = Math.pow(1 + effectiveTargetGrowth, 1 / 12) - 1;
    const monthlyAdvCompoundRate = Math.pow(1 + effectiveAdvisoryGrowth, 1 / 12) - 1;

    const monthlyMilestones = [
      { name: 'Strategic Diagnostic', desc: 'Audit unit economics, financial leakage & reporting infrastructure.' },
      { name: 'Financial Restructure', desc: 'Implement cash-flow forecasting and chart-of-accounts governance.' },
      { name: 'Pricing Matrix Launch', desc: 'Deploy tiered value-based pricing and margin protections.' },
      { name: 'Margin Recapture', desc: 'Eliminate unprofitable SKU/client drag and vendor inefficiencies.' },
      { name: 'Sales Velocity Engine', desc: 'Optimize sales funnel conversion rates and shortening deal cycles.' },
      { name: 'Mid-Year Review', desc: 'Rebalance OPEX budget allocations and reinvest surplus capital.' },
      { name: 'Process Automation', desc: 'Automate repetitive workflows, billing cycles, and reconciliations.' },
      { name: 'Working Capital Release', desc: 'Compress AR collection cycles (DSO) to expand cash runway.' },
      { name: 'Pipeline Scaling', desc: 'Scale acquisition channels with verified unit economics.' },
      { name: 'Tax Mitigation Shield', desc: 'Deploy Finance Act 2026 deductions and strategic credits.' },
      { name: 'Market Acceleration', desc: 'Double down on highest-margin services and client retention.' },
      { name: 'Target Exit Velocity', desc: 'Achieve optimized run-rate and institutional valuation readiness.' }
    ];

    const monthlyProjectionData = [];
    let cumBaseMonthlyRev = 0;
    let cumAdvMonthlyRev = 0;
    let cumBaseMonthlyProfit = 0;
    let cumAdvMonthlyProfit = 0;

    // Calculate exit targets for linear benchmark
    const endTargetMonthlyRev = Math.round(monthlyStartingRev * (1 + effectiveAdvisoryGrowth));

    for (let m = 1; m <= 12; m++) {
      const adoptionRamp = Math.min(1, 0.45 + (m / 12) * 0.55);
      const activeMonthlyRate = monthlyBaseCompoundRate + (monthlyAdvCompoundRate - monthlyBaseCompoundRate) * adoptionRamp;

      const baselineMonthRev = Math.round(monthlyStartingRev * Math.pow(1 + monthlyBaseCompoundRate, m));
      const advisoryMonthRev = Math.round(monthlyStartingRev * Math.pow(1 + activeMonthlyRate, m));

      const linearBenchmark = Math.round(monthlyStartingRev + ((endTargetMonthlyRev - monthlyStartingRev) * (m / 12)));

      const baselineMonthProfit = Math.round(baselineMonthRev * baseMargin * 0.35);
      const advisoryMonthProfit = Math.round(
        advisoryMonthRev * (optimizedMargin * 0.35 + costLeakageReduction / 100)
      );

      const incrementalMonthRev = advisoryMonthRev - baselineMonthRev;
      const incrementalMonthProfit = advisoryMonthProfit - baselineMonthProfit;

      cumBaseMonthlyRev += baselineMonthRev;
      cumAdvMonthlyRev += advisoryMonthRev;
      cumBaseMonthlyProfit += baselineMonthProfit;
      cumAdvMonthlyProfit += advisoryMonthProfit;

      monthlyProjectionData.push({
        month: `M${m < 10 ? '0' + m : m}`,
        monthNum: m,
        title: `Month ${m}`,
        milestone: monthlyMilestones[m - 1].name,
        milestoneDesc: monthlyMilestones[m - 1].desc,
        baselineRevenue: baselineMonthRev,
        advisoryRevenue: advisoryMonthRev,
        growthTrendLine: advisoryMonthRev,
        baselineTrendLine: baselineMonthRev,
        linearBenchmark: linearBenchmark,
        incrementalRevenue: incrementalMonthRev,
        baselineProfit: baselineMonthProfit,
        advisoryProfit: advisoryMonthProfit,
        incrementalProfit: incrementalMonthProfit,
        cumulativeBaseRev: cumBaseMonthlyRev,
        cumulativeAdvRev: cumAdvMonthlyRev,
        cumulativeIncrementalRev: cumAdvMonthlyRev - cumBaseMonthlyRev,
        cumulativeIncrementalProfit: cumAdvMonthlyProfit - cumBaseMonthlyProfit
      });
    }

    // 12-Month Aggregates
    const month12Data = monthlyProjectionData[11];
    const month12ExitRunRate = month12Data.advisoryRevenue;
    const month12BaselineExitRunRate = month12Data.baselineRevenue;
    const total12MonthIncrementalRev = cumAdvMonthlyRev - cumBaseMonthlyRev;
    const total12MonthIncrementalProfit = cumAdvMonthlyProfit - cumBaseMonthlyProfit;

    // Year-by-Year Multi-Horizon Projections (Years 1 to 3)
    const yearsData = [];
    let cumulativeBaselineRevenue = 0;
    let cumulativeAdvisoryRevenue = 0;
    let cumulativeBaselineProfit = 0;
    let cumulativeAdvisoryProfit = 0;

    let prevBaselineRev = currentRevenue;
    let prevAdvisoryRev = currentRevenue;

    for (let yr = 1; yr <= 3; yr++) {
      const decayFactor = yr === 1 ? 1 : yr === 2 ? 0.9 : 0.82;
      const yrBaseGrowth = effectiveTargetGrowth * decayFactor;
      const yrAdvGrowth = effectiveAdvisoryGrowth * decayFactor;

      const baselineRev = Math.round(prevBaselineRev * (1 + yrBaseGrowth));
      const advisoryRev = Math.round(prevAdvisoryRev * (1 + yrAdvGrowth));

      const baselineProfit = Math.round(baselineRev * baseMargin * 0.35);
      const advisoryProfit = Math.round(
        advisoryRev * (optimizedMargin * 0.35 + costLeakageReduction / 100)
      );

      const incrementalRevenue = advisoryRev - baselineRev;
      const incrementalProfit = advisoryProfit - baselineProfit;

      cumulativeBaselineRevenue += baselineRev;
      cumulativeAdvisoryRevenue += advisoryRev;
      cumulativeBaselineProfit += baselineProfit;
      cumulativeAdvisoryProfit += advisoryProfit;

      const baselineValuation = Math.round(baselineProfit * 4.5);
      const advisoryValuation = Math.round(advisoryProfit * 5.2);

      yearsData.push({
        year: `Year ${yr}`,
        yearNum: yr,
        baselineRevenue: baselineRev,
        advisoryRevenue: advisoryRev,
        growthTrendLine: advisoryRev,
        baselineTrendLine: baselineRev,
        incrementalRevenue: incrementalRevenue,
        baselineProfit: baselineProfit,
        advisoryProfit: advisoryProfit,
        incrementalProfit: incrementalProfit,
        baselineValuation: baselineValuation,
        advisoryValuation: advisoryValuation,
        valuationUplift: advisoryValuation - baselineValuation
      });

      prevBaselineRev = baselineRev;
      prevAdvisoryRev = advisoryRev;
    }

    // Cumulative stats for the selected multi-year horizon
    const activeHorizonData = yearsData.slice(0, timeHorizonYears);
    const totalBaselineRev = activeHorizonData.reduce((acc, curr) => acc + curr.baselineRevenue, 0);
    const totalAdvisoryRev = activeHorizonData.reduce((acc, curr) => acc + curr.advisoryRevenue, 0);
    const totalIncrementalRev = totalAdvisoryRev - totalBaselineRev;

    const totalBaselineProfit = activeHorizonData.reduce((acc, curr) => acc + curr.baselineProfit, 0);
    const totalAdvisoryProfit = activeHorizonData.reduce((acc, curr) => acc + curr.advisoryProfit, 0);
    const totalIncrementalProfit = totalAdvisoryProfit - totalBaselineProfit;

    // Advisory Retainer Model Estimate
    const annualRetainerCost = Math.min(
      Math.max(Math.round(currentRevenue * 0.035), 30000),
      96000
    );
    const totalRetainerCost = annualRetainerCost * (timeframeView === '12_months' ? 1 : timeHorizonYears);
    
    const activeProfitForRoi = timeframeView === '12_months' ? total12MonthIncrementalProfit : totalIncrementalProfit;
    const roiMultiple = Number((activeProfitForRoi / totalRetainerCost).toFixed(1));
    const netAdvisoryROI = Math.max(
      Number(((activeProfitForRoi - totalRetainerCost) / totalRetainerCost).toFixed(1)),
      2.5
    );

    const finalYearData = activeHorizonData[activeHorizonData.length - 1];
    const enterpriseValuationGain = finalYearData.valuationUplift;

    return {
      monthlyProjectionData,
      monthlyStartingRev,
      month12ExitRunRate,
      month12BaselineExitRunRate,
      total12MonthIncrementalRev,
      total12MonthIncrementalProfit,
      yearsData,
      activeHorizonData,
      totalIncrementalRev,
      totalIncrementalProfit,
      totalAdvisoryRev,
      totalBaselineRev,
      totalRetainerCost,
      netAdvisoryROI,
      roiMultiple,
      enterpriseValuationGain,
      advisoryGrowthLift,
      marginExpansionLift,
      effectiveAdvisoryGrowth: Math.round(effectiveAdvisoryGrowth * 100)
    };
  }, [
    currentRevenue,
    targetGrowthPercent,
    grossMarginPercent,
    timeHorizonYears,
    timeframeView,
    enablePricingOptimization,
    enableWorkingCapitalRelease,
    enableTaxAndOpexMitigation,
    enableSalesVelocityAudit
  ]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}k`;
    }
    return `$${val}`;
  };

  // Scenario Management Handlers (Persisted to Firestore for logged in users)
  const handleSaveScenario = async (nameToUse?: string) => {
    if (savedScenarios.length >= 3) {
      showToast('Maximum of 3 scenarios reached. Delete one to save a new scenario.');
      return;
    }

    const defaultName = `Scenario ${savedScenarios.length + 1}: ${
      timeframeView === '12_months' ? '12M' : `${timeHorizonYears}Y`
    } @ +${targetGrowthPercent}% ($${(currentRevenue / 1000).toFixed(0)}k)`;

    const finalName = nameToUse?.trim() || scenarioCustomName.trim() || defaultName;
    const is12Mo = timeframeView === '12_months';

    const newScenario: SavedGrowthScenario = {
      id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.uid,
      name: finalName,
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      currentRevenue,
      targetGrowthPercent,
      grossMarginPercent,
      timeframeView,
      timeHorizonYears,
      levers: {
        salesVelocity: enableSalesVelocityAudit,
        pricing: enablePricingOptimization,
        taxOpex: enableTaxAndOpexMitigation,
        workingCapital: enableWorkingCapitalRelease
      },
      metrics: {
        revenueLift: is12Mo ? calculations.total12MonthIncrementalRev : calculations.totalIncrementalRev,
        month12ExitOrProfit: is12Mo ? calculations.month12ExitRunRate : calculations.totalIncrementalProfit,
        roiMultiple: calculations.roiMultiple,
        effectiveGrowth: calculations.effectiveAdvisoryGrowth,
        timeframeLabel: is12Mo ? '12-Month Ramp' : `${timeHorizonYears}-Year Horizon`
      }
    };

    if (currentUser) {
      // Save directly to Firestore for authenticated Client Portal users
      try {
        setSyncStatus('saving');
        await saveScenarioToFirestore(currentUser.uid, newScenario);
        setSyncStatus('synced');
        showToast('Scenario securely synced to your Firestore Client Portal account.');
      } catch (err) {
        console.error('Failed to save to Firestore:', err);
        setSyncStatus('error');
        // Fallback to local state
        const updated = [...savedScenarios, newScenario];
        setSavedScenarios(updated);
        showToast('Saved locally (Cloud connection retrying).');
      }
    } else {
      // Save locally in browser
      const updated = [...savedScenarios, newScenario];
      setSavedScenarios(updated);
      try {
        localStorage.setItem('accounticca_saved_growth_scenarios', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage write error', e);
      }
      showToast('Scenario saved in local storage. Log in to sync to cloud.');
    }

    setScenarioCustomName('');
    setIsAddingScenario(false);
    setLoadedScenarioId(newScenario.id);
  };

  const handleLoadScenario = (scenario: SavedGrowthScenario) => {
    setCurrentRevenue(scenario.currentRevenue);
    setTargetGrowthPercent(scenario.targetGrowthPercent);
    setGrossMarginPercent(scenario.grossMarginPercent);
    setTimeframeView(scenario.timeframeView);
    setTimeHorizonYears(scenario.timeHorizonYears);
    setEnableSalesVelocityAudit(scenario.levers.salesVelocity);
    setEnablePricingOptimization(scenario.levers.pricing);
    setEnableTaxAndOpexMitigation(scenario.levers.taxOpex);
    setEnableWorkingCapitalRelease(scenario.levers.workingCapital);
    setLoadedScenarioId(scenario.id);
    showToast(`Loaded "${scenario.name}" into active controls.`);
  };

  const handleDeleteScenario = async (id: string) => {
    if (currentUser) {
      try {
        setSyncStatus('saving');
        await deleteScenarioFromFirestore(id);
        setSyncStatus('synced');
        showToast('Scenario removed from cloud database.');
      } catch (err) {
        console.error('Failed to delete scenario from Firestore:', err);
        const updated = savedScenarios.filter((s) => s.id !== id);
        setSavedScenarios(updated);
      }
    } else {
      const updated = savedScenarios.filter((s) => s.id !== id);
      setSavedScenarios(updated);
      try {
        localStorage.setItem('accounticca_saved_growth_scenarios', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage update error', e);
      }
      showToast('Scenario deleted.');
    }

    if (loadedScenarioId === id) setLoadedScenarioId(null);
  };

  const handlePrintBrief = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate your Growth ROI Stakeholder Brief.');
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Accounticca - Growth ROI & 12-Month Trend Advisory Brief</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .subtitle { font-size: 13px; color: #64748b; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
            .card-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 8px; }
            .card-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            th { background: #f1f5f9; font-weight: bold; color: #334155; }
            .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">ACCOUNTICCA STRATEGIC ADVISORY</div>
              <div class="subtitle">Growth ROI & 12-Month Projected Trajectory Report</div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">
              Generated on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <h3>Executive Parameters & Inputs</h3>
            <p style="font-size: 13px; color: #475569;">
              Baseline Annual Revenue: <strong>$${currentRevenue.toLocaleString()}</strong> | 
              Starting Monthly Run-Rate: <strong>$${calculations.monthlyStartingRev.toLocaleString()}/mo</strong> | 
              Organic Target: <strong>+${targetGrowthPercent}%/yr</strong> | 
              Accounticca Accelerated Target: <strong>+${calculations.effectiveAdvisoryGrowth}%/yr</strong> | 
              Gross Margin: <strong>${grossMarginPercent}%</strong>
            </p>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">12-Month Accelerated Revenue Lift</div>
              <div class="card-value">+$${calculations.total12MonthIncrementalRev.toLocaleString()}</div>
            </div>
            <div class="card">
              <div class="card-title">Month 12 Exit Monthly Run-Rate</div>
              <div class="card-value" style="color: #059669;">$${calculations.month12ExitRunRate.toLocaleString()}/mo</div>
            </div>
            <div class="card">
              <div class="card-title">Advisory ROI Multiple</div>
              <div class="card-value" style="color: #4f46e5;">${calculations.roiMultiple}x ROI</div>
            </div>
          </div>

          <h3>12-Month Month-by-Month Growth Trend Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Strategic Transformation Milestone</th>
                <th>Baseline Run-Rate</th>
                <th>Accelerated Projected Trend</th>
                <th>Monthly Delta</th>
                <th>Cumulative Lift</th>
              </tr>
            </thead>
            <tbody>
              ${calculations.monthlyProjectionData
                .map(
                  (d) => `
                <tr>
                  <td><strong>${d.month}</strong></td>
                  <td>${d.milestone}</td>
                  <td>$${d.baselineRevenue.toLocaleString()}</td>
                  <td style="color: #2563eb; font-weight: bold;">$${d.advisoryRevenue.toLocaleString()}</td>
                  <td style="color: #059669;">+$${d.incrementalRevenue.toLocaleString()}</td>
                  <td style="color: #1e3a8a; font-weight: bold;">+$${d.cumulativeIncrementalRev.toLocaleString()}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          ${
            savedScenarios.length > 0
              ? `
            <h3 style="margin-top: 30px;">Saved Comparison Scenarios (Firestore Synchronized)</h3>
            <table>
              <thead>
                <tr>
                  <th>Scenario Name</th>
                  <th>Revenue</th>
                  <th>Growth Goal</th>
                  <th>Revenue Lift</th>
                  <th>Exit/Profit Metric</th>
                  <th>ROI Multiple</th>
                </tr>
              </thead>
              <tbody>
                ${savedScenarios
                  .map(
                    (s) => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>$${s.currentRevenue.toLocaleString()}</td>
                    <td>+${s.targetGrowthPercent}%</td>
                    <td style="color: #2563eb; font-weight: bold;">+$${s.metrics.revenueLift.toLocaleString()}</td>
                    <td>$${s.metrics.month12ExitOrProfit.toLocaleString()}</td>
                    <td style="color: #059669; font-weight: bold;">${s.metrics.roiMultiple}x ROI</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
              : ''
          }

          <div class="footer">
            Confidential & Proprietary • Accounticca Strategic Business Consultancy • www.accounticca.com
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Status Toast */}
      {statusToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white border border-blue-500/30 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Widget Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full text-blue-700 text-xs font-bold tracking-wider uppercase shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive 12-Month Trend & ROI Engine</span>
            </div>

            {/* Cloud Sync Status Badge */}
            {currentUser ? (
              <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 text-[11px] font-semibold">
                <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[160px] sm:max-w-[220px]">
                  Cloud Synced: {currentUser.email}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-slate-600 text-[11px]">
                <Database className="w-3 h-3 text-slate-500" />
                <span>Local Mode</span>
                {onOpenClientPortal && (
                  <button
                    type="button"
                    onClick={onOpenClientPortal}
                    className="text-blue-600 font-bold hover:underline ml-1 cursor-pointer flex items-center space-x-0.5"
                  >
                    <span>Sign In to Sync</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Growth ROI & 12-Month Projected Trajectory
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Configure your company metrics to view your <strong>12-Month Projected Growth Trend Line</strong>.
            Save up to 3 customized scenarios persisted across sessions via <strong>Firestore Client Portal</strong>.
          </p>
        </div>

        {/* View Mode & Print Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Timeframe View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setTimeframeView('12_months')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                timeframeView === '12_months'
                  ? 'bg-white text-blue-700 shadow-xs border border-blue-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>12-Month Trend Line</span>
            </button>
            <button
              type="button"
              onClick={() => setTimeframeView('multi_year')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                timeframeView === 'multi_year'
                  ? 'bg-white text-blue-700 shadow-xs border border-blue-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Multi-Year Horizon</span>
            </button>
          </div>

          {timeframeView === 'multi_year' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[1, 2, 3].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTimeHorizonYears(yr)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    timeHorizonYears === yr
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr}Y
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handlePrintBrief}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Print ROI Brief</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 relative z-10">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center space-x-1">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick Scale Presets:</span>
        </span>
        {PRESET_SCENARIOS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setCurrentRevenue(preset.revenue);
              setTargetGrowthPercent(preset.targetGrowth);
              setGrossMarginPercent(preset.margin);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
              currentRevenue === preset.revenue
                ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {preset.label} (${(preset.revenue / 1000).toFixed(0)}k)
          </button>
        ))}
      </div>

      {/* Main Calculator Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Interactive Sliders & Levers (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-sm font-bold font-serif text-slate-900 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span>Financial Baseline Inputs</span>
            </span>
            <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-md">
              Real-Time Dynamic
            </span>
          </div>

          {/* Input 1: Current Annual Revenue */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <label className="font-semibold text-slate-700 block">Current Annual Revenue</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Starting Run-Rate: ${calculations.monthlyStartingRev.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center space-x-1 font-mono font-bold text-blue-700 bg-white px-2 py-1 rounded-lg border border-slate-200 text-sm shadow-2xs">
                <span>$</span>
                <input
                  type="number"
                  min={50000}
                  max={20000000}
                  step={25000}
                  value={currentRevenue}
                  onChange={(e) => setCurrentRevenue(Math.max(10000, Number(e.target.value)))}
                  className="w-24 bg-transparent outline-none text-right font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={currentRevenue}
              onChange={(e) => setCurrentRevenue(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$100k</span>
              <span>$5M</span>
              <span>$10M+</span>
            </div>
          </div>

          {/* Input 2: Target Annual Growth (%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <label className="font-semibold text-slate-700 block">Target Organic Growth Rate</label>
                <span className="text-[11px] text-blue-600 font-medium">
                  Accelerated Target: +{calculations.effectiveAdvisoryGrowth}%/yr
                </span>
              </div>
              <span className="font-bold text-slate-900 font-mono text-sm bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                +{targetGrowthPercent}% / yr
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={targetGrowthPercent}
              onChange={(e) => setTargetGrowthPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Steady)</span>
              <span>50% (Fast Growth)</span>
              <span>120% (Hyper Scale)</span>
            </div>
          </div>

          {/* Input 3: Gross Profit Margin (%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Current Gross Margin</label>
              <span className="font-bold text-slate-900 font-mono text-sm bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {grossMarginPercent}%
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={85}
              step={5}
              value={grossMarginPercent}
              onChange={(e) => setGrossMarginPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>25% (Thin)</span>
              <span>55% (Healthy)</span>
              <span>85% (Software/Service)</span>
            </div>
          </div>

          {/* Advisory Transformation Levers */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Accounticca Advisory Value Levers:</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Click to toggle</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition cursor-pointer text-xs shadow-2xs">
                <input
                  type="checkbox"
                  checked={enableSalesVelocityAudit}
                  onChange={(e) => setEnableSalesVelocityAudit(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500 shrink-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Sales & Pipeline Velocity Acceleration (+14%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Audits deals, eliminates lead friction & shortens sales cycle.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition cursor-pointer text-xs shadow-2xs">
                <input
                  type="checkbox"
                  checked={enablePricingOptimization}
                  onChange={(e) => setEnablePricingOptimization(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500 shrink-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Pricing Power & Margin Expansion (+5.5%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Restructures tier packaging and pricing power to expand margins.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition cursor-pointer text-xs shadow-2xs">
                <input
                  type="checkbox"
                  checked={enableTaxAndOpexMitigation}
                  onChange={(e) => setEnableTaxAndOpexMitigation(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500 shrink-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Tax Drag & OPEX Leakage Elimination (+4.5%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Eliminates operational bloat and optimizes tax shield reserves.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition cursor-pointer text-xs shadow-2xs">
                <input
                  type="checkbox"
                  checked={enableWorkingCapitalRelease}
                  onChange={(e) => setEnableWorkingCapitalRelease(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 focus:ring-blue-500 shrink-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Working Capital Optimization & AR Pipeline (+6%)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Accelerates accounts receivable velocity to self-fund growth.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic KPI Display & Recharts Visualizations (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top 3 Impact Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: 12-Month / Multi-Year Revenue Lift */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md relative overflow-hidden space-y-1">
              <Sparkles className="absolute -bottom-2 -right-2 w-16 h-16 text-white/10 pointer-events-none" />
              <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
                {timeframeView === '12_months' ? '12-Month Revenue Lift' : 'Accelerated Revenue Lift'}
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold font-mono">
                +${(timeframeView === '12_months' ? calculations.total12MonthIncrementalRev : calculations.totalIncrementalRev).toLocaleString()}
              </p>
              <p className="text-[11px] text-blue-200 pt-1">
                {timeframeView === '12_months'
                  ? 'Cumulative 12-month delta vs baseline organic'
                  : `Over ${timeHorizonYears} ${timeHorizonYears === 1 ? 'Year' : 'Years'} vs organic target`}
              </p>
            </div>

            {/* Card 2: Month 12 Exit Run-Rate / Bottom-Line Profit */}
            <div className="bg-emerald-50 border border-emerald-200 text-slate-900 rounded-2xl p-5 shadow-xs space-y-1">
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                {timeframeView === '12_months' ? 'Month 12 Exit Run-Rate' : 'Bottom-Line Profit Alpha'}
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 font-mono">
                {timeframeView === '12_months'
                  ? `$${calculations.month12ExitRunRate.toLocaleString()}/mo`
                  : `+$${calculations.totalIncrementalProfit.toLocaleString()}`}
              </p>
              <p className="text-[11px] text-slate-600 pt-1">
                {timeframeView === '12_months'
                  ? `Exits at +$${(calculations.month12ExitRunRate - calculations.month12BaselineExitRunRate).toLocaleString()}/mo above baseline`
                  : 'Net EBITDA created after advisory fees'}
              </p>
            </div>

            {/* Card 3: Advisory ROI Return */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Advisory ROI Multiple
              </p>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-blue-600 font-mono">
                {calculations.roiMultiple}x ROI
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Estimated ${calculations.roiMultiple} net value per $1 invested
              </p>
            </div>
          </div>

          {/* Interactive Recharts Graph Panel with Trend Line Overlay */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>
                    {timeframeView === '12_months'
                      ? '12-Month Projected Growth Trajectory & Trend Line Overlay'
                      : chartViewMode === 'revenue'
                      ? 'Revenue Acceleration Comparison'
                      : chartViewMode === 'profit'
                      ? 'Bottom-Line Net Profit Alpha'
                      : 'Enterprise Valuation Multiplier Impact'}
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  {timeframeView === '12_months'
                    ? 'Month-by-month compounding ramp showing baseline vs Accounticca accelerated trend line overlay.'
                    : chartViewMode === 'revenue'
                    ? 'Comparing baseline target trajectory against Accounticca optimized velocity.'
                    : chartViewMode === 'profit'
                    ? 'Visualizing incremental EBITDA and operating cash flows recaptured.'
                    : 'Projected business enterprise valuation uplift (4.5x - 5.2x multiple).'}
                </p>
              </div>

              {/* Chart Controls */}
              {timeframeView === 'multi_year' ? (
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-xs">
                  <button
                    type="button"
                    onClick={() => setChartViewMode('revenue')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      chartViewMode === 'revenue'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewMode('profit')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      chartViewMode === 'profit'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Profit
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewMode('valuation')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      chartViewMode === 'valuation'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Valuation
                  </button>
                </div>
              ) : (
                /* Trend Line Overlay Toggles */
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowTrendLineOverlay(!showTrendLineOverlay)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center space-x-1.5 border cursor-pointer ${
                      showTrendLineOverlay
                        ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Accelerated Trend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBaselineTrendOverlay(!showBaselineTrendOverlay)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center space-x-1.5 border cursor-pointer ${
                      showBaselineTrendOverlay
                        ? 'bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="w-2.5 h-0.5 bg-slate-500" />
                    <span>Baseline Trend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLinearBenchmark(!showLinearBenchmark)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center space-x-1.5 border cursor-pointer ${
                      showLinearBenchmark
                        ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-500" />
                    <span>Linear Benchmark</span>
                  </button>
                </div>
              )}
            </div>

            {/* Recharts Chart Rendering */}
            <div className="w-full h-72 sm:h-84 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {timeframeView === '12_months' ? (
                  /* 12-Month Month-by-Month Trajectory with Trend Line Overlay */
                  <ComposedChart
                    data={calculations.monthlyProjectionData}
                    margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                    onMouseMove={(state: any) => {
                      if (state && state.activeTooltipIndex !== undefined) {
                        setActiveMonthHighlight(state.activeTooltipIndex + 1);
                      }
                    }}
                    onMouseLeave={() => setActiveMonthHighlight(null)}
                  >
                    <defs>
                      <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      dy={5}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                    />
                    
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-xs space-y-2 backdrop-blur-md min-w-[220px]">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                <span className="font-bold text-blue-400 font-mono">{data.title}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{data.milestone}</span>
                              </div>
                              <div className="space-y-1 font-mono">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Baseline Organic:</span>
                                  <span className="font-bold">${data.baselineRevenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-blue-300">
                                  <span>Accelerated Run-Rate:</span>
                                  <span className="font-bold">${data.advisoryRevenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
                                  <span>Monthly Alpha Lift:</span>
                                  <span className="font-bold">+${data.incrementalRevenue.toLocaleString()}/mo</span>
                                </div>
                                <div className="flex justify-between text-amber-300">
                                  <span>Cumulative Lift:</span>
                                  <span className="font-bold">+${data.cumulativeIncrementalRev.toLocaleString()}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 pt-1 leading-snug border-t border-slate-800/80">
                                {data.milestoneDesc}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => {
                        if (value === 'advisoryRevenue') return 'Accounticca Monthly Run-Rate';
                        if (value === 'baselineRevenue') return 'Baseline Target Run-Rate';
                        if (value === 'growthTrendLine') return '12-Month Accelerated Trend Line';
                        if (value === 'baselineTrendLine') return 'Baseline Organic Trend';
                        if (value === 'linearBenchmark') return 'Linear Trajectory Overlay';
                        return value;
                      }}
                    />

                    {/* Gradient Area under accelerated trajectory */}
                    <Area
                      type="monotone"
                      dataKey="advisoryRevenue"
                      stroke="none"
                      fill="url(#growthAreaGradient)"
                      legendType="none"
                    />

                    {/* Monthly Comparative Bars */}
                    <Bar
                      dataKey="baselineRevenue"
                      name="baselineRevenue"
                      fill="#cbd5e1"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                      opacity={0.65}
                    />
                    <Bar
                      dataKey="advisoryRevenue"
                      name="advisoryRevenue"
                      fill="#93c5fd"
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                      opacity={0.75}
                    />

                    {/* 12-Month Accelerated Trend Line Overlay */}
                    {showTrendLineOverlay && (
                      <Line
                        type="monotone"
                        dataKey="growthTrendLine"
                        name="growthTrendLine"
                        stroke="#1d4ed8"
                        strokeWidth={3.5}
                        dot={{ r: 4, fill: '#1d4ed8', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 7, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    )}

                    {/* Baseline Organic Trend Line Overlay */}
                    {showBaselineTrendOverlay && (
                      <Line
                        type="monotone"
                        dataKey="baselineTrendLine"
                        name="baselineTrendLine"
                        stroke="#64748b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3, fill: '#64748b' }}
                      />
                    )}

                    {/* Linear Benchmark Overlay */}
                    {showLinearBenchmark && (
                      <Line
                        type="linear"
                        dataKey="linearBenchmark"
                        name="linearBenchmark"
                        stroke="#d97706"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                ) : chartViewMode === 'revenue' ? (
                  /* Multi-Year Revenue Horizon */
                  <ComposedChart
                    data={calculations.activeHorizonData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name === 'advisoryRevenue'
                          ? 'Accounticca Accelerated'
                          : name === 'baselineRevenue'
                          ? 'Baseline Organic'
                          : 'Incremental Lift'
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#93c5fd' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      formatter={(value) =>
                        value === 'advisoryRevenue'
                          ? 'Accounticca Accelerated Revenue'
                          : value === 'baselineRevenue'
                          ? 'Baseline Target Revenue'
                          : 'Incremental Alpha'
                      }
                    />
                    <Bar
                      dataKey="baselineRevenue"
                      name="baselineRevenue"
                      fill="#cbd5e1"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                    <Bar
                      dataKey="advisoryRevenue"
                      name="advisoryRevenue"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                    <Line
                      type="monotone"
                      dataKey="advisoryRevenue"
                      stroke="#1d4ed8"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#1d4ed8' }}
                    />
                  </ComposedChart>
                ) : chartViewMode === 'profit' ? (
                  /* Multi-Year Net Profit */
                  <ComposedChart
                    data={calculations.activeHorizonData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name === 'advisoryProfit'
                          ? 'Optimized Net Profit'
                          : name === 'baselineProfit'
                          ? 'Baseline Profit'
                          : 'Incremental Profit'
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#86efac' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      formatter={(value) =>
                        value === 'advisoryProfit'
                          ? 'Accounticca Optimized Net Profit'
                          : 'Baseline Profit Trajectory'
                      }
                    />
                    <Bar
                      dataKey="baselineProfit"
                      name="baselineProfit"
                      fill="#e2e8f0"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                    <Bar
                      dataKey="advisoryProfit"
                      name="advisoryProfit"
                      fill="#059669"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </ComposedChart>
                ) : (
                  /* Multi-Year Valuation */
                  <ComposedChart
                    data={calculations.activeHorizonData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name === 'advisoryValuation'
                          ? 'Advisory Enterprise Valuation'
                          : 'Baseline Valuation'
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#c7d2fe' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                      formatter={(value) =>
                        value === 'advisoryValuation'
                          ? 'Accounticca Enterprise Valuation'
                          : 'Baseline Valuation'
                      }
                    />
                    <Bar
                      dataKey="baselineValuation"
                      name="baselineValuation"
                      fill="#cbd5e1"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                    <Bar
                      dataKey="advisoryValuation"
                      name="advisoryValuation"
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* 12-Month Milestone Highlights Ribbon (when in 12-month view) */}
            {timeframeView === '12_months' && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Key 12-Month Transformation Milestones</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Hover graph points for details
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className={`p-2.5 rounded-xl border transition ${
                    activeMonthHighlight && activeMonthHighlight <= 3
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">Q1: Months 1-3</span>
                    <span className="font-semibold text-slate-900 text-[11px] block truncate">Pricing & Discovery</span>
                    <span className="text-[10px] text-slate-500 block truncate">Audit + margin recalibration</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border transition ${
                    activeMonthHighlight && activeMonthHighlight >= 4 && activeMonthHighlight <= 6
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">Q2: Months 4-6</span>
                    <span className="font-semibold text-slate-900 text-[11px] block truncate">Velocity & Funnel</span>
                    <span className="text-[10px] text-slate-500 block truncate">Deal cycle acceleration</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border transition ${
                    activeMonthHighlight && activeMonthHighlight >= 7 && activeMonthHighlight <= 9
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">Q3: Months 7-9</span>
                    <span className="font-semibold text-slate-900 text-[11px] block truncate">Automation & Working Cap</span>
                    <span className="text-[10px] text-slate-500 block truncate">DSO compression & runway</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border transition ${
                    activeMonthHighlight && activeMonthHighlight >= 10
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <span className="font-mono text-[10px] text-blue-600 font-bold block">Q4: Months 10-12</span>
                    <span className="font-semibold text-slate-900 text-[11px] block truncate">Tax Shield & Target Velocity</span>
                    <span className="text-[10px] text-slate-500 block truncate">Exiting at ${calculations.month12ExitRunRate.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Insight Callout */}
            <div className="bg-slate-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-serif font-bold text-slate-900 flex items-center space-x-1.5 justify-center sm:justify-start">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Strategic Executive Summary</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  {timeframeView === '12_months' ? (
                    <>
                      By executing this 12-month transformation, your business expands monthly run-rate from{' '}
                      <strong className="text-slate-800 font-mono">${calculations.monthlyStartingRev.toLocaleString()}/mo</strong> to{' '}
                      <strong className="text-blue-700 font-mono">${calculations.month12ExitRunRate.toLocaleString()}/mo</strong>, producing{' '}
                      <strong className="text-emerald-700 font-mono">+${calculations.total12MonthIncrementalRev.toLocaleString()}</strong> in net new top-line revenue.
                    </>
                  ) : (
                    <>
                      By executing this plan with Accounticca, your business creates an estimated{' '}
                      <strong className="text-blue-700 font-mono">
                        +${calculations.totalIncrementalRev.toLocaleString()}
                      </strong>{' '}
                      in accelerated revenue and expands valuation by{' '}
                      <strong className="text-emerald-700 font-mono">
                        +${calculations.enterpriseValuationGain.toLocaleString()}
                      </strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-2">
                {onOpenWorkspaceSuite && (
                  <button
                    type="button"
                    onClick={() => onOpenWorkspaceSuite('sheets')}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Sheets Export</span>
                  </button>
                )}

                {onOpenConsultation && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenConsultation(
                        `Growth ROI Plan: Rev: $${currentRevenue.toLocaleString()}, Target Growth: ${targetGrowthPercent}%, 12-Mo Exit: $${calculations.month12ExitRunRate.toLocaleString()}/mo, Projected 12-Mo Lift: +$${calculations.total12MonthIncrementalRev.toLocaleString()}`
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <span>Execute 12-Month Plan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SAVED SCENARIOS COMPARISON TABLE (Firestore Cloud Persisted)              */}
          {/* ========================================================================= */}
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-serif font-bold text-slate-900">
                    Saved Comparison Scenarios ({savedScenarios.length}/3)
                  </h4>
                  {currentUser ? (
                    <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <CloudCheck className="w-3 h-3 text-emerald-600" />
                      <span>Firestore Synced</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Database className="w-3 h-3 text-slate-500" />
                      <span>Local Storage</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {currentUser ? (
                    <span>Scenarios automatically sync across devices with your Client Portal login.</span>
                  ) : (
                    <span>
                      Saved locally in this browser. Log in via{' '}
                      {onOpenClientPortal ? (
                        <button
                          type="button"
                          onClick={onOpenClientPortal}
                          className="text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          Client Portal
                        </button>
                      ) : (
                        'Client Portal'
                      )}{' '}
                      to sync across devices.
                    </span>
                  )}
                </p>
              </div>

              {/* Save Scenario Button / Inline Form */}
              {!isAddingScenario ? (
                <button
                  type="button"
                  disabled={savedScenarios.length >= 3}
                  onClick={() => {
                    const defaultName = `Scenario ${savedScenarios.length + 1}: ${
                      timeframeView === '12_months' ? '12M' : `${timeHorizonYears}Y`
                    } @ +${targetGrowthPercent}% ($${(currentRevenue / 1000).toFixed(0)}k)`;
                    setScenarioCustomName(defaultName);
                    setIsAddingScenario(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs ${
                    savedScenarios.length >= 3
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Current Configuration</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={scenarioCustomName}
                    onChange={(e) => setScenarioCustomName(e.target.value)}
                    placeholder="Scenario label (e.g. Aggressive Scale)"
                    className="bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium w-full sm:w-56"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveScenario(scenarioCustomName);
                      if (e.key === 'Escape') setIsAddingScenario(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveScenario(scenarioCustomName)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shrink-0 shadow-2xs"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingScenario(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition cursor-pointer shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Scenarios Table Content */}
            {savedScenarios.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <Bookmark className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-medium text-slate-700">No comparison scenarios saved yet.</p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Adjust your annual revenue and target growth sliders above, then click <strong>"Save Current Configuration"</strong> to benchmark up to 3 alternate financial trajectories in your cloud account.
                </p>
                <button
                  type="button"
                  onClick={() => handleSaveScenario()}
                  className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Save Current State as Scenario 1</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3.5 font-serif">Scenario & Inputs</th>
                      <th className="py-2.5 px-3">Timeline</th>
                      <th className="py-2.5 px-3">Accelerated Lift</th>
                      <th className="py-2.5 px-3">Exit / Profit</th>
                      <th className="py-2.5 px-3">ROI</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {savedScenarios.map((scenario) => {
                      const isActive = loadedScenarioId === scenario.id;
                      const activeLeversCount = Object.values(scenario.levers).filter(Boolean).length;

                      return (
                        <tr
                          key={scenario.id}
                          className={`transition ${
                            isActive ? 'bg-blue-50/70' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3 px-3.5">
                            <div className="flex items-center space-x-2">
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Active on controls" />
                              )}
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-bold text-slate-900 block truncate max-w-[150px] sm:max-w-[190px]">
                                    {scenario.name}
                                  </span>
                                  {scenario.userId && (
                                    <Cloud className="w-2.5 h-2.5 text-emerald-600 shrink-0" title="Saved in Firestore" />
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono block">
                                  ${formatCurrency(scenario.currentRevenue)} • +{scenario.targetGrowthPercent}% target • {activeLeversCount} levers
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {scenario.metrics.timeframeLabel}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-blue-700 font-mono text-xs">
                              +${scenario.metrics.revenueLift.toLocaleString()}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-emerald-700 font-mono text-xs">
                              ${scenario.metrics.month12ExitOrProfit.toLocaleString()}
                              {scenario.timeframeView === '12_months' ? '/mo' : ''}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {scenario.metrics.roiMultiple}x
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleLoadScenario(scenario)}
                                title="Apply these parameters to the calculator"
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer ${
                                  isActive
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw className="w-3 h-3 text-blue-600" />
                                    <span>Load</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteScenario(scenario.id)}
                                title="Delete saved scenario"
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
