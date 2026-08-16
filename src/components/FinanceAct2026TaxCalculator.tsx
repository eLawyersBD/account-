import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  FileSpreadsheet,
  HardDrive,
  Mail,
  Calendar as CalendarIcon,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Percent,
  Download,
  Printer,
  BarChart3,
  Scale,
  Table,
  ArrowLeftRight,
  Layers,
  Share2,
  Copy,
  Check,
  Link
} from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface FinanceAct2026TaxCalculatorProps {
  onOpenWorkspaceSuite?: (tab?: 'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms') => void;
  onOpenConsultation?: (note?: string) => void;
}

export type FilingTier = 'early' | 'regular' | 'late_tier1' | 'late_tier2';
export type TaxYearMode = '2026' | '2025' | 'compare';

export const FinanceAct2026TaxCalculator: React.FC<FinanceAct2026TaxCalculatorProps> = ({
  onOpenWorkspaceSuite,
  onOpenConsultation,
}) => {
  // Inputs & Mode State
  const [taxYearMode, setTaxYearMode] = useState<TaxYearMode>('compare');
  const [annualIncome, setAnnualIncome] = useState<number>(1000000); // 1,000,000 Taka
  const [investmentAmount, setInvestmentAmount] = useState<number>(150000); // 150,000 Taka
  const [selectedTier, setSelectedTier] = useState<FilingTier>('early');
  const [isNewTaxpayer, setIsNewTaxpayer] = useState<boolean>(false);
  const [isHolidayExtensionApplied, setIsHolidayExtensionApplied] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ annualIncome: string | null; investmentAmount: string | null }>({ annualIncome: null, investmentAmount: null });

  // Input Validation Logic
  const validateInputs = (income: number, investment: number) => {
    const newErrors = { annualIncome: null as string | null, investmentAmount: null as string | null };
    
    if (income < 0) {
      newErrors.annualIncome = "Income cannot be negative.";
    }
    
    if (investment < 0) {
      newErrors.investmentAmount = "Investment cannot be negative.";
    } else if (investment > income) {
      newErrors.investmentAmount = "Investment cannot exceed annual income.";
    }
    
    setErrors(newErrors);
  };

  const handleAnnualIncomeChange = (val: number) => {
    const income = Math.max(0, val);
    setAnnualIncome(income);
    validateInputs(income, investmentAmount);
  };

  const handleInvestmentAmountChange = (val: number) => {
    const investment = Math.max(0, val);
    setInvestmentAmount(investment);
    validateInputs(annualIncome, investment);
  };

  // Parse Deep-Link Query Parameters on Initial Mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      const incomeParam = params.get('income') || params.get('inc');
      if (incomeParam && !isNaN(Number(incomeParam))) {
        setAnnualIncome(Math.max(0, Number(incomeParam)));
      }

      const investParam = params.get('investment') || params.get('inv');
      if (investParam && !isNaN(Number(investParam))) {
        setInvestmentAmount(Math.max(0, Number(investParam)));
      }

      const tierParam = params.get('tier');
      if (tierParam && ['early', 'regular', 'late_tier1', 'late_tier2'].includes(tierParam)) {
        setSelectedTier(tierParam as FilingTier);
      }

      const modeParam = params.get('mode') || params.get('year');
      if (modeParam && ['2026', '2025', 'compare'].includes(modeParam)) {
        setTaxYearMode(modeParam as TaxYearMode);
      }

      const newTaxParam = params.get('new') || params.get('newTaxpayer');
      if (newTaxParam === 'true') {
        setIsNewTaxpayer(true);
      } else if (newTaxParam === 'false') {
        setIsNewTaxpayer(false);
      }

      const holidayParam = params.get('holiday') || params.get('ext');
      if (holidayParam === 'true') {
        setIsHolidayExtensionApplied(true);
      } else if (holidayParam === 'false') {
        setIsHolidayExtensionApplied(false);
      }
    } catch (err) {
      console.error('Error parsing share deep link parameters:', err);
    }
  }, []);

  // Quick Preset Handlers
  const applyPreset = (income: number, investment: number) => {
    setAnnualIncome(income);
    setInvestmentAmount(investment);
    validateInputs(income, investment);
  };

  // Detailed Slabs Tax Calculation (AY 2026-2027 - Finance Act 2026)
  const taxSlabBreakdown = useMemo(() => {
    let remaining = Math.max(0, annualIncome);
    let grossTax = 0;

    // Slab 1: First 3,75,000 @ 0%
    const slab1Income = Math.min(remaining, 375000);
    const slab1Tax = 0;
    remaining -= slab1Income;

    // Slab 2: Next 3,00,000 @ 10%
    const slab2Income = Math.min(remaining, 300000);
    const slab2Tax = slab2Income * 0.10;
    remaining -= slab2Income;

    // Slab 3: Next 4,00,000 @ 15%
    const slab3Income = Math.min(remaining, 400000);
    const slab3Tax = slab3Income * 0.15;
    remaining -= slab3Income;

    // Slab 4: Next 5,00,000 @ 20%
    const slab4Income = Math.min(remaining, 500000);
    const slab4Tax = slab4Income * 0.20;
    remaining -= slab4Income;

    // Slab 5: Remaining above 15,75,000 @ 25%
    const slab5Income = remaining;
    const slab5Tax = slab5Income * 0.25;

    grossTax = slab1Tax + slab2Tax + slab3Tax + slab4Tax + slab5Tax;

    return {
      slab1: { income: slab1Income, rate: '0%', tax: slab1Tax },
      slab2: { income: slab2Income, rate: '10%', tax: slab2Tax },
      slab3: { income: slab3Income, rate: '15%', tax: slab3Tax },
      slab4: { income: slab4Income, rate: '20%', tax: slab4Tax },
      slab5: { income: slab5Income, rate: '25%', tax: slab5Tax },
      grossTax,
    };
  }, [annualIncome]);

  // Detailed Slabs Tax Calculation (AY 2025-2026 - Finance Act 2025)
  const taxSlabBreakdown2025 = useMemo(() => {
    let remaining = Math.max(0, annualIncome);

    // Slab 1: First 3,50,000 @ 0%
    const slab1Income = Math.min(remaining, 350000);
    const slab1Tax = 0;
    remaining -= slab1Income;

    // Slab 2: Next 1,00,000 @ 5%
    const slab2Income = Math.min(remaining, 100000);
    const slab2Tax = slab2Income * 0.05;
    remaining -= slab2Income;

    // Slab 3: Next 3,00,000 @ 10%
    const slab3Income = Math.min(remaining, 300000);
    const slab3Tax = slab3Income * 0.10;
    remaining -= slab3Income;

    // Slab 4: Next 4,00,000 @ 15%
    const slab4Income = Math.min(remaining, 400000);
    const slab4Tax = slab4Income * 0.15;
    remaining -= slab4Income;

    // Slab 5: Next 5,00,000 @ 20%
    const slab5Income = Math.min(remaining, 500000);
    const slab5Tax = slab5Income * 0.20;
    remaining -= slab5Income;

    // Slab 6: Balance above 16,50,000 @ 25%
    const slab6Income = remaining;
    const slab6Tax = slab6Income * 0.25;

    const grossTax = slab1Tax + slab2Tax + slab3Tax + slab4Tax + slab5Tax + slab6Tax;

    return {
      slab1: { income: slab1Income, rate: '0%', tax: slab1Tax },
      slab2: { income: slab2Income, rate: '5%', tax: slab2Tax },
      slab3: { income: slab3Income, rate: '10%', tax: slab3Tax },
      slab4: { income: slab4Income, rate: '15%', tax: slab4Tax },
      slab5: { income: slab5Income, rate: '20%', tax: slab5Tax },
      slab6: { income: slab6Income, rate: '25%', tax: slab6Tax },
      grossTax,
    };
  }, [annualIncome]);

  // Investment Rebate Calculation for Finance Act 2026
  const rebateDetails = useMemo(() => {
    const rawRebate = Math.max(0, investmentAmount) * 0.10; // 10% of eligible investment
    const rebateCap = Math.max(0, annualIncome) * 0.075; // 7.5% of total income
    const actualRebate = Math.min(rawRebate, rebateCap, taxSlabBreakdown.grossTax);
    const netTaxBeforePenalty = Math.max(0, taxSlabBreakdown.grossTax - actualRebate);

    return {
      rawRebate,
      rebateCap,
      actualRebate,
      netTaxBeforePenalty,
    };
  }, [investmentAmount, annualIncome, taxSlabBreakdown.grossTax]);

  // Investment Rebate Calculation for Finance Act 2025 (15% rebate, capped at 3% of income)
  const rebateDetails2025 = useMemo(() => {
    const rawRebate = Math.max(0, investmentAmount) * 0.15;
    const rebateCap = Math.max(0, annualIncome) * 0.03;
    const actualRebate = Math.min(rawRebate, rebateCap, taxSlabBreakdown2025.grossTax, 1000000);
    const netTax2025 = Math.max(0, taxSlabBreakdown2025.grossTax - actualRebate);

    return {
      rawRebate,
      rebateCap,
      actualRebate,
      netTax2025,
    };
  }, [investmentAmount, annualIncome, taxSlabBreakdown2025.grossTax]);

  // Tiered Submission Schedule Calculations
  const filingScenarios = useMemo(() => {
    const base = rebateDetails.netTaxBeforePenalty;

    // 1. Early Filing (1 July to 30 September)
    const earlyIncentiveRaw = base * 0.05;
    const earlyIncentive = Math.min(earlyIncentiveRaw, 25000);
    const earlyNetTax = Math.max(0, base - earlyIncentive);

    // 2. Regular Filing (1 October to 31 December)
    const regularNetTax = base;

    // 3. Late Filing Tier 1 (1 January to 31 March)
    const late1PenaltyRaw = base * 0.02;
    const late1Penalty = isNewTaxpayer ? 0 : Math.max(late1PenaltyRaw, 3000);
    const late1NetTax = base + late1Penalty;

    // 4. Late Filing Tier 2 (1 April to 30 June)
    const late2PenaltyRaw = base * 0.05;
    const late2Penalty = isNewTaxpayer ? 0 : Math.max(late2PenaltyRaw, 5000);
    const late2NetTax = base + late2Penalty;

    return {
      early: {
        window: '1 July – 30 September',
        incentive: earlyIncentive,
        penalty: 0,
        finalNetTax: earlyNetTax,
        diffFromRegular: -earlyIncentive,
        label: 'Early Filing Incentive',
        tag: '5% Rebate Bonus (Up to 25,000 BDT)',
      },
      regular: {
        window: '1 October – 31 December',
        incentive: 0,
        penalty: 0,
        finalNetTax: regularNetTax,
        diffFromRegular: 0,
        label: 'Standard Return Window',
        tag: 'No Incentive / No Late Penalty',
      },
      late_tier1: {
        window: '1 January – 31 March',
        incentive: 0,
        penalty: late1Penalty,
        finalNetTax: late1NetTax,
        diffFromRegular: late1Penalty,
        label: 'Late Filing Tier 1',
        tag: isNewTaxpayer ? 'Exempt for First-time Taxpayers' : 'Higher of 2% Tax or 3,000 BDT',
      },
      late_tier2: {
        window: '1 April – 30 June',
        incentive: 0,
        penalty: late2Penalty,
        finalNetTax: late2NetTax,
        diffFromRegular: late2Penalty,
        label: 'Late Filing Tier 2',
        tag: isNewTaxpayer ? 'Exempt for First-time Taxpayers' : 'Higher of 5% Tax or 5,000 BDT',
      },
    };
  }, [rebateDetails.netTaxBeforePenalty, isNewTaxpayer]);

  const activeScenario = filingScenarios[selectedTier];

  // Derived key metrics for tax assessment summary
  const effectiveTaxRate = useMemo(() => {
    return annualIncome > 0 ? (activeScenario.finalNetTax / annualIncome) * 100 : 0;
  }, [annualIncome, activeScenario.finalNetTax]);

  const grossEffectiveTaxRate = useMemo(() => {
    return annualIncome > 0 ? (taxSlabBreakdown.grossTax / annualIncome) * 100 : 0;
  }, [annualIncome, taxSlabBreakdown.grossTax]);

  const marginalTaxRate = useMemo(() => {
    if (taxSlabBreakdown.slab5.income > 0) return 25;
    if (taxSlabBreakdown.slab4.income > 0) return 20;
    if (taxSlabBreakdown.slab3.income > 0) return 15;
    if (taxSlabBreakdown.slab2.income > 0) return 10;
    return 0;
  }, [taxSlabBreakdown]);

  const totalTaxSaved = useMemo(() => {
    return rebateDetails.actualRebate + activeScenario.incentive;
  }, [rebateDetails.actualRebate, activeScenario.incentive]);

  // Conditional color styling for Effective Tax Rate
  const effectiveRateStyle = useMemo(() => {
    if (effectiveTaxRate === 0) {
      return {
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-950/40',
        borderColor: 'border-emerald-500/40',
        progressColor: 'bg-emerald-500',
        label: '0% Exempt / Zero Tax Liability',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      };
    } else if (effectiveTaxRate <= 7.5) {
      return {
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-950/30',
        borderColor: 'border-emerald-500/30',
        progressColor: 'bg-emerald-500',
        label: 'Low Effective Burden (≤ 7.5%)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      };
    } else if (effectiveTaxRate <= 15) {
      return {
        textColor: 'text-blue-400',
        bgColor: 'bg-blue-950/30',
        borderColor: 'border-blue-500/30',
        progressColor: 'bg-blue-500',
        label: 'Moderate Rate (7.5%–15%)',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      };
    } else {
      return {
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-950/30',
        borderColor: 'border-amber-500/30',
        progressColor: 'bg-amber-500',
        label: 'High Effective Rate (> 15%)',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
      };
    }
  }, [effectiveTaxRate]);

  // Conditional color styling for Total Taxable Income
  const taxableIncomeStyle = useMemo(() => {
    if (annualIncome <= 375000) {
      return {
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-950/30',
        borderColor: 'border-emerald-500/30',
        label: 'Tax-Exempt Base Threshold (≤ 3.75L BDT)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      };
    } else if (annualIncome <= 1575000) {
      return {
        textColor: 'text-blue-400',
        bgColor: 'bg-blue-950/30',
        borderColor: 'border-blue-500/30',
        label: 'Standard Tax Bracket (3.75L–15.75L BDT)',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30'
      };
    } else {
      return {
        textColor: 'text-purple-400',
        bgColor: 'bg-purple-950/30',
        borderColor: 'border-purple-500/30',
        label: 'Upper Tier Tax Bracket (> 15.75L BDT)',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/30'
      };
    }
  }, [annualIncome]);

  // Year-over-Year Comparison Metrics (2025 vs 2026)
  const yearComparisonMetrics = useMemo(() => {
    const netTax2026 = activeScenario.finalNetTax;
    const netTax2025 = rebateDetails2025.netTax2025;
    const diffInTax = netTax2026 - netTax2025; // negative = tax reduction in 2026
    const absDiff = Math.abs(diffInTax);
    const percentChange = netTax2025 > 0 ? (diffInTax / netTax2025) * 100 : 0;

    const effectiveRate2025 = annualIncome > 0 ? (netTax2025 / annualIncome) * 100 : 0;
    const effectiveRate2026 = annualIncome > 0 ? (netTax2026 / annualIncome) * 100 : 0;
    const rateDiff = effectiveRate2026 - effectiveRate2025;

    return {
      netTax2025,
      netTax2026,
      diffInTax,
      absDiff,
      percentChange,
      effectiveRate2025,
      effectiveRate2026,
      rateDiff,
      exemption2025: 350000,
      exemption2026: 375000,
      grossTax2025: taxSlabBreakdown2025.grossTax,
      grossTax2026: taxSlabBreakdown.grossTax,
      rebate2025: rebateDetails2025.actualRebate,
      rebate2026: rebateDetails.actualRebate,
      earlyIncentive2026: activeScenario.incentive,
    };
  }, [activeScenario, rebateDetails2025, taxSlabBreakdown2025, taxSlabBreakdown, rebateDetails, annualIncome]);

  // Copy Shareable Deep Link using Clipboard API
  const handleCopyShareLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('income', String(annualIncome));
      url.searchParams.set('investment', String(investmentAmount));
      url.searchParams.set('tier', selectedTier);
      url.searchParams.set('mode', taxYearMode);
      if (isNewTaxpayer) {
        url.searchParams.set('new', 'true');
      } else {
        url.searchParams.delete('new');
      }
      if (isHolidayExtensionApplied) {
        url.searchParams.set('holiday', 'true');
      } else {
        url.searchParams.delete('holiday');
      }

      const shareUrl = url.toString();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);

      window.dispatchEvent(
        new CustomEvent('accounticca_log_activity', {
          detail: {
            type: 'share',
            title: 'Tax Calculation Deep Link Shared',
            description: `Generated share link for ${annualIncome.toLocaleString()} BDT income calculation (${taxYearMode} mode, ${selectedTier} tier).`,
            actor: 'Taxpayer / Tax Advisor',
            metadata: `Share URL: ${shareUrl}`
          }
        })
      );
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  // Trigger Browser Print Dialog with custom activity logging
  const handlePrint = () => {
    window.dispatchEvent(
      new CustomEvent('accounticca_log_activity', {
        detail: {
          type: 'report',
          title: 'Finance Act 2026 Tax Return Calculation Printed',
          description: `Printed tax assessment report for ${annualIncome.toLocaleString()} BDT income (${activeScenario.label}). Net Tax Due: ${activeScenario.finalNetTax.toLocaleString('en-US', { maximumFractionDigits: 2 })} BDT.`,
          actor: 'Taxpayer / Tax Advisor',
          metadata: `Submission Window: ${activeScenario.window}`
        }
      })
    );
    window.print();
  };

  return (
    <section id="finance-act-2026" className="py-20 sm:py-28 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Print-Only Official Assessment Header (Renders only during print dialog) */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-slate-900">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-serif text-slate-900 uppercase tracking-wide">ACCOUNTICCA ADVISORY SERVICES</h1>
              <p className="text-xs text-slate-600 font-semibold">Taxation, Audit & Strategic Business Advisory</p>
            </div>
            <div className="text-right text-xs text-slate-700 font-mono">
              <p className="font-bold text-slate-900">Finance Act 2026 Tax Return Calculation</p>
              <p>Report Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Assessment Year: 2026–2027 | Income Year: 2025–2026</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-300 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Award className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Finance Act 2026 Tax Return & Submission Schedule Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight text-white">
            Individual Tax Return & Tiered Submission Calculator
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate your exact net tax payable under Finance Act 2026 for assessment year 2026–2027 or compare with Finance Act 2025 to visualize tax variance.
          </p>
        </AnimatedSection>

        {/* Tax Year Mode Switcher */}
        <div className="flex items-center justify-center gap-2 mb-8 p-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl max-w-xl mx-auto shadow-xl">
          <button
            type="button"
            onClick={() => setTaxYearMode('2026')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              taxYearMode === '2026'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-300" />
            <span>2026 Act (AY 2026–27)</span>
          </button>

          <button
            type="button"
            onClick={() => setTaxYearMode('2025')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              taxYearMode === '2025'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>2025 Act (AY 2025–26)</span>
          </button>

          <button
            type="button"
            onClick={() => setTaxYearMode('compare')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              taxYearMode === 'compare'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-300" />
            <span>Compare Tax Years</span>
          </button>
        </div>

        {/* Toast Alert Banner for Copied Share Link */}
        <AnimatePresence>
          {isCopied && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="mb-8 p-3.5 bg-emerald-950/90 border border-emerald-500/80 rounded-2xl text-emerald-100 text-xs font-semibold flex items-center justify-between shadow-2xl max-w-2xl mx-auto ring-1 ring-emerald-500/30"
            >
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Deep link copied to clipboard! Share this URL so others can view your exact tax assessment state.
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold bg-emerald-900/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700/60 shrink-0">
                Copied
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preset Selector & Action Suite */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Quick Baseline Presets:</span>
          <button
            onClick={() => applyPreset(1000000, 150000)}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            10 Lakh BDT (Standard)
          </button>
          <button
            onClick={() => applyPreset(1500000, 200000)}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            15 Lakh BDT (Executive)
          </button>
          <button
            onClick={() => applyPreset(2500000, 300000)}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            25 Lakh BDT (Senior Partner)
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block mx-1" />

          {/* Copy Share Link Action */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20'
            }`}
            title="Copy shareable deep link containing current form values"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-100" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-100" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>

          {/* Print Calculation Action */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
            title="Print Tax Calculation Summary Report"
          >
            <Printer className="w-3.5 h-3.5 text-blue-100" />
            <span>Print Calculation</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs & Slabs (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-blue-400" />
                  <span>Tax Assessment Inputs</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`p-1.5 rounded-lg border text-xs transition flex items-center space-x-1 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 hover:text-white'
                    }`}
                    title="Copy share link for current values"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5 text-indigo-300" />
                    )}
                    <span className="text-[10px] font-semibold hidden sm:inline">
                      {isCopied ? 'Copied' : 'Share'}
                    </span>
                  </button>
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-900/50 border border-blue-700 px-2.5 py-0.5 rounded-full uppercase">
                    {taxYearMode === '2025' ? 'AY 2025-2026' : 'AY 2026-2027'}
                  </span>
                </div>
              </div>

              {/* Annual Income Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    Total Annual Taxable Income (BDT)
                    <div className="group relative">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-950 border border-slate-700 text-[10px] text-slate-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        Enter your total gross annual taxable income.
                      </div>
                    </div>
                  </label>
                  <span className="font-mono text-emerald-400 font-bold">{annualIncome.toLocaleString()} BDT</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="25000"
                  value={annualIncome}
                  onChange={(e) => handleAnnualIncomeChange(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 bg-slate-900 border ${errors.annualIncome ? 'border-rose-500' : 'border-slate-700'} rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono`}
                />
                {errors.annualIncome && <p className="text-[10px] text-rose-500 font-bold">{errors.annualIncome}</p>}
              </div>

              {/* Approved Investment Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    Eligible Investment Amount (BDT)
                    <div className="group relative">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-950 border border-slate-700 text-[10px] text-slate-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        Enter investment amounts eligible for tax rebate. Cannot exceed annual income.
                      </div>
                    </div>
                  </label>
                  <span className="font-mono text-amber-400 font-bold">{investmentAmount.toLocaleString()} BDT</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={investmentAmount}
                  onChange={(e) => handleInvestmentAmountChange(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 bg-slate-900 border ${errors.investmentAmount ? 'border-rose-500' : 'border-slate-700'} rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono`}
                />
                {errors.investmentAmount && <p className="text-[10px] text-rose-500 font-bold">{errors.investmentAmount}</p>}
                <p className="text-[11px] text-slate-400 leading-snug">
                  {taxYearMode === '2025'
                    ? 'Finance Act 2025 allowed 15% rebate on eligible investments (capped at 3% of total annual income).'
                    : 'Finance Act 2026 allows 10% rebate on eligible investments (capped at 7.5% of total annual income).'}
                </p>
              </div>

              {/* Special Toggles */}
              <div className="pt-3 border-t border-slate-700/80 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isNewTaxpayer}
                    onChange={(e) => setIsNewTaxpayer(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-200 group-hover:text-white transition">First-Time New Taxpayer Exemption</span>
                    <p className="text-[10px] text-slate-400">Permitted to submit first return by 30 June without late filing penalties.</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isHolidayExtensionApplied}
                    onChange={(e) => setIsHolidayExtensionApplied(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-200 group-hover:text-white transition">Government Holiday Extension Rule</span>
                    <p className="text-[10px] text-slate-400">If official deadline falls on a holiday, final submission shifts to next working day.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Tax Slabs Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>
                  {taxYearMode === '2025' ? 'Finance Act 2025 Slabs' : 'Finance Act 2026 Slabs'}
                </span>
                <span className="font-mono text-blue-400 font-bold">
                  Gross: {taxYearMode === '2025' ? taxSlabBreakdown2025.grossTax.toLocaleString() : taxSlabBreakdown.grossTax.toLocaleString()} BDT
                </span>
              </h4>

              {taxYearMode === '2025' ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">1. First 3,50,000 BDT (0%)</span>
                    <span className="text-slate-300 font-bold">0 BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">2. Next 1,00,000 BDT (5%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown2025.slab2.tax.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">3. Next 3,00,000 BDT (10%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown2025.slab3.tax.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">4. Next 4,00,000 BDT (15%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown2025.slab4.tax.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">5. Next 5,00,000 BDT (20%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown2025.slab5.tax.toLocaleString()} BDT</span>
                  </div>
                  {taxSlabBreakdown2025.slab6.tax > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400">6. Balance Above 16.5L (25%)</span>
                      <span className="text-amber-400 font-bold">{taxSlabBreakdown2025.slab6.tax.toLocaleString()} BDT</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">1. First 3,75,000 BDT (0%)</span>
                    <span className="text-slate-300 font-bold">0 BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">2. Next 3,00,000 BDT (10%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown.slab2.tax.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">3. Next 4,00,000 BDT (15%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown.slab3.tax.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400">4. Next 5,00,000 BDT (20%)</span>
                    <span className="text-amber-400 font-bold">{taxSlabBreakdown.slab4.tax.toLocaleString()} BDT</span>
                  </div>
                  {taxSlabBreakdown.slab5.tax > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-slate-400">5. Balance Above 15.75L (25%)</span>
                      <span className="text-amber-400 font-bold">{taxSlabBreakdown.slab5.tax.toLocaleString()} BDT</span>
                    </div>
                  )}
                </div>
              )}

              {/* Investment Rebate Deduction */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>
                    {taxYearMode === '2025'
                      ? 'Investment Rebate 2025 (15% Eligible, Cap 3% Income)'
                      : 'Investment Rebate 2026 (10% Eligible, Cap 7.5% Income)'}
                  </span>
                  <span className="font-mono">
                    - {taxYearMode === '2025' ? rebateDetails2025.actualRebate.toLocaleString() : rebateDetails.actualRebate.toLocaleString()} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-bold pt-1 border-t border-slate-800">
                  <span>Net Base Tax Payable:</span>
                  <span className="font-mono text-emerald-400 text-sm">
                    {taxYearMode === '2025' ? rebateDetails2025.netTax2025.toLocaleString() : rebateDetails.netTaxBeforePenalty.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Tiered Submission Schedule & Final Calculation (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Schedule Tiers Selector */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span>Tiered Return Submission Windows</span>
                  </h3>
                  <p className="text-xs text-slate-400">Select a submission timeline to inspect incentives or late filing penalties</p>
                </div>

                {isHolidayExtensionApplied && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold">
                    Holiday Extension Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. Early Filing */}
                <button
                  type="button"
                  onClick={() => setSelectedTier('early')}
                  className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                    selectedTier === 'early'
                      ? 'bg-emerald-950/60 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Early Filing</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                      SAVE 5%
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold text-white">1 July – 30 September</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Eligible for 5% incentive (or up to 25,000 BDT) off tax payable.
                  </p>
                </button>

                {/* 2. Regular Filing */}
                <button
                  type="button"
                  onClick={() => setSelectedTier('regular')}
                  className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                    selectedTier === 'regular'
                      ? 'bg-blue-950/60 border-blue-500/80 ring-2 ring-blue-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Regular Filing
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold font-mono">
                      STANDARD
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold text-white">1 October – 31 December</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Standard window. Neither incentive nor late penalty applies.
                  </p>
                </button>

                {/* 3. Late Filing Tier 1 */}
                <button
                  type="button"
                  onClick={() => setSelectedTier('late_tier1')}
                  className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                    selectedTier === 'late_tier1'
                      ? 'bg-amber-950/60 border-amber-500/80 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late Filing Tier 1</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                      +2% / 3K BDT
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold text-white">1 January – 31 March</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Additional late tax of 2% of tax payable or 3,000 BDT (higher applies).
                  </p>
                </button>

                {/* 4. Late Filing Tier 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedTier('late_tier2')}
                  className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                    selectedTier === 'late_tier2'
                      ? 'bg-rose-950/60 border-rose-500/80 ring-2 ring-rose-500/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Late Filing Tier 2</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold font-mono">
                      +5% / 5K BDT
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold text-white">1 April – 30 June</p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Final quarter penalty of 5% of tax payable or 5,000 BDT (higher applies).
                  </p>
                </button>

              </div>
            </div>

            {/* Selected Scenario Impact Banner */}
            <motion.div
              key={`impact-${selectedTier}-${annualIncome}-${investmentAmount}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition ${
                selectedTier === 'early'
                  ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/80 shadow-emerald-950/30'
                  : selectedTier === 'regular'
                  ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-blue-500/80 shadow-blue-950/30'
                  : selectedTier === 'late_tier1'
                  ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-amber-500/80 shadow-amber-950/30'
                  : 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-rose-500/80 shadow-rose-950/30'
              }`}
            >
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">
                    Selected Window Impact Assessment
                  </span>
                  <h4 className="text-xl font-serif font-bold text-white flex items-center space-x-2">
                    <span>{activeScenario.label} ({activeScenario.window})</span>
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Final Net Tax Due</span>
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    selectedTier === 'early' ? 'text-emerald-400' : selectedTier === 'regular' ? 'text-white' : 'text-rose-400'
                  }`}>
                    {activeScenario.finalNetTax.toLocaleString('en-US', { maximumFractionDigits: 2 })} BDT
                  </span>
                </div>
              </div>

              {/* Breakdown comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs font-mono">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Base Tax (Post Rebate)</span>
                  <span className="text-white font-bold">{rebateDetails.netTaxBeforePenalty.toLocaleString()} BDT</span>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Timing Adjustment</span>
                  {selectedTier === 'early' ? (
                    <span className="text-emerald-400 font-bold">- {activeScenario.incentive.toLocaleString()} BDT (Incentive)</span>
                  ) : activeScenario.penalty > 0 ? (
                    <span className="text-rose-400 font-bold">+ {activeScenario.penalty.toLocaleString()} BDT (Penalty)</span>
                  ) : (
                    <span className="text-slate-300 font-bold">0 BDT (Standard)</span>
                  )}
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase">Variance vs Regular</span>
                  {activeScenario.diffFromRegular < 0 ? (
                    <span className="text-emerald-400 font-bold">Save {Math.abs(activeScenario.diffFromRegular).toLocaleString()} BDT</span>
                  ) : activeScenario.diffFromRegular > 0 ? (
                    <span className="text-rose-400 font-bold">Extra +{activeScenario.diffFromRegular.toLocaleString()} BDT</span>
                  ) : (
                    <span className="text-slate-300 font-bold">Baseline Benchmark</span>
                  )}
                </div>
              </div>

              {/* Special Rule Note */}
              {isNewTaxpayer && (selectedTier === 'late_tier1' || selectedTier === 'late_tier2') && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>First-time taxpayer rule active: Late filing penalties are waived up to 30 June!</span>
                </div>
              )}

              {/* Google Workspace Action Suite Integration */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Workspace Direct Action Suite</span>
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {onOpenWorkspaceSuite && (
                    <>
                      <button
                        type="button"
                        onClick={() => onOpenWorkspaceSuite('sheets')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export to Google Sheets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenWorkspaceSuite('drive')}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Save to Google Drive</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenWorkspaceSuite('gmail')}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Assessment via Gmail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenWorkspaceSuite('calendar')}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Schedule Calendar Reminder</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-xs transition flex items-center space-x-1.5 shadow-md border border-slate-200 active:scale-95"
                    title="Print Official Tax Assessment Report"
                  >
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span>Print Calculation</span>
                  </button>

                  {onOpenConsultation && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenConsultation(
                          `Finance Act 2026 Tax Consultation for ${annualIncome.toLocaleString()} BDT Income (${selectedTier} filing plan)`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition flex items-center space-x-1.5 ml-auto"
                    >
                      <span>Book Tax Advisor</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

            </motion.div>

            {/* Tax Assessment Summary Chart & Table (Highlighting Effective Tax Rate & Total Taxable Income) */}
            <motion.div
              key={`summary-${annualIncome}-${investmentAmount}-${selectedTier}`}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-slate-800/90 border border-slate-700/90 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                <div>
                  <h4 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Tax Assessment Summary & Rate Analysis</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Comparative breakdown highlighting effective tax rate vs marginal slab rate & taxable income allocation
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${effectiveRateStyle.badgeClass}`}>
                    Effective Rate: {effectiveTaxRate.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 2 Prominent Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Total Taxable Income Highlight Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={`p-4 rounded-2xl border ${taxableIncomeStyle.bgColor} ${taxableIncomeStyle.borderColor} space-y-2 relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                      <Scale className="w-3.5 h-3.5 text-blue-400" />
                      <span>Total Taxable Income</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${taxableIncomeStyle.badgeClass}`}>
                      {taxableIncomeStyle.label}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${taxableIncomeStyle.textColor}`}>
                      {annualIncome.toLocaleString('en-US')} BDT
                    </span>
                  </div>

                  {/* Income Split Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                      <span>Exempt: {Math.min(annualIncome, 375000).toLocaleString()} BDT (0%)</span>
                      <span>Taxed: {Math.max(0, annualIncome - 375000).toLocaleString()} BDT</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${annualIncome > 0 ? Math.min(100, (Math.min(annualIncome, 375000) / annualIncome) * 100) : 0}%` }}
                        title="Tax-Free 3.75 Lakh BDT Base"
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${annualIncome > 0 ? Math.max(0, ((annualIncome - Math.min(annualIncome, 375000)) / annualIncome) * 100) : 0}%` }}
                        title="Taxable Balance"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* 2. Effective Tax Rate Highlight Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className={`p-4 rounded-2xl border ${effectiveRateStyle.bgColor} ${effectiveRateStyle.borderColor} space-y-2 relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      <span>Effective Tax Rate</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${effectiveRateStyle.badgeClass}`}>
                      {effectiveRateStyle.label}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${effectiveRateStyle.textColor}`}>
                      {effectiveTaxRate.toFixed(2)}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Gross: {grossEffectiveTaxRate.toFixed(2)}%)
                    </span>
                  </div>

                  {/* Rate Compression Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                      <span>Effective: {effectiveTaxRate.toFixed(1)}%</span>
                      <span>Top Marginal Slab: {marginalTaxRate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative">
                      <div
                        className={`h-full ${effectiveRateStyle.progressColor} transition-all duration-500`}
                        style={{ width: `${Math.min(100, (effectiveTaxRate / 25) * 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* Summary Comparison Table */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/90"
              >
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-700 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 px-4 font-semibold">Tax Metric</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Value (BDT / %)</th>
                      <th className="py-2.5 px-4 font-semibold">Classification & Status</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    
                    {/* Row 1: Total Annual Income */}
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Total Taxable Income</span>
                      </td>
                      <td className={`py-2.5 px-4 text-right font-bold ${taxableIncomeStyle.textColor}`}>
                        {annualIncome.toLocaleString()} BDT
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${taxableIncomeStyle.badgeClass}`}>
                          {taxableIncomeStyle.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-400">Gross Assessment Base</td>
                    </tr>

                    {/* Row 2: Tax Free Allowance */}
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Tax-Free Exemption Threshold</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                        {Math.min(annualIncome, 375000).toLocaleString()} BDT
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          0% Base Allowance
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-emerald-400">Exempt from Tax</td>
                    </tr>

                    {/* Row 3: Marginal Slab Rate */}
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Top Marginal Slab Rate</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-amber-400">
                        {marginalTaxRate}%
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Upper Bracket Applied
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-400">Max Statutory Rate</td>
                    </tr>

                    {/* Row 4: Effective Tax Rate */}
                    <tr className="hover:bg-slate-800/50 transition bg-slate-900/80">
                      <td className="py-2.5 px-4 font-bold text-white flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Effective Tax Rate (Post-Rebate)</span>
                      </td>
                      <td className={`py-2.5 px-4 text-right font-extrabold text-sm ${effectiveRateStyle.textColor}`}>
                        {effectiveTaxRate.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${effectiveRateStyle.badgeClass}`}>
                          {effectiveRateStyle.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                        {grossEffectiveTaxRate > effectiveTaxRate
                          ? `-${(grossEffectiveTaxRate - effectiveTaxRate).toFixed(2)}% Saved`
                          : 'Standard Rate'}
                      </td>
                    </tr>

                    {/* Row 5: Total Tax Savings */}
                    <tr className="hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Total Tax Savings (Rebate + Incentive)</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-400">
                        - {totalTaxSaved.toLocaleString()} BDT
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Rebate & Early Incentive
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-emerald-400">Direct Savings</td>
                    </tr>

                    {/* Row 6: Final Payable Net Tax */}
                    <tr className="hover:bg-slate-800/50 transition bg-slate-950/60 font-bold">
                      <td className="py-2.5 px-4 text-white flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>Final Payable Net Tax</span>
                      </td>
                      <td className={`py-2.5 px-4 text-right text-base font-extrabold ${effectiveRateStyle.textColor}`}>
                        {activeScenario.finalNetTax.toLocaleString('en-US', { maximumFractionDigits: 2 })} BDT
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {activeScenario.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-200">Final Liability</td>
                    </tr>

                  </tbody>
                </table>
              </motion.div>
            </motion.div>

          </div>

        </div>

        {/* Interactive Year-over-Year Tax Comparison Block (2025 vs 2026) */}
        <motion.div
          key={`yoy-comparison-${annualIncome}-${investmentAmount}-${selectedTier}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-12 bg-slate-800/90 border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-bold tracking-wider uppercase">
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Year-over-Year Tax Policy Comparison</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Finance Act 2025 vs. Finance Act 2026 Variance Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Direct comparative breakdown of tax liability, exemptions, rebates, and slab structure changes across assessment years.
              </p>
            </div>

            {/* Mode Indicator Badge */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-blue-300 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>AY 2025–26 vs AY 2026–27</span>
              </span>
            </div>
          </div>

          {/* YoY Impact Summary Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${
            yearComparisonMetrics.diffInTax < 0
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : yearComparisonMetrics.diffInTax > 0
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
              : 'bg-blue-950/60 border-blue-500/50 text-blue-200'
          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg`}>
            <div className="flex items-start space-x-3">
              {yearComparisonMetrics.diffInTax < 0 ? (
                <TrendingDown className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : yearComparisonMetrics.diffInTax > 0 ? (
                <TrendingUp className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-bold font-serif text-white">
                  {yearComparisonMetrics.diffInTax < 0
                    ? `Tax Savings of ${yearComparisonMetrics.absDiff.toLocaleString()} BDT under Finance Act 2026`
                    : yearComparisonMetrics.diffInTax > 0
                    ? `Tax Liability Increase of +${yearComparisonMetrics.absDiff.toLocaleString()} BDT under 2026 Act`
                    : 'Identical Net Tax Payable Across Both Years'}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {yearComparisonMetrics.diffInTax < 0
                    ? `Finance Act 2026 reduces your net tax burden by ${Math.abs(yearComparisonMetrics.percentChange).toFixed(1)}% due to expanded tax-free threshold (3.75L BDT) and early filing incentives.`
                    : yearComparisonMetrics.diffInTax > 0
                    ? `Higher tax liability under 2026 provisions primarily driven by late filing penalties or modified investment rebate percentages.`
                    : `Your income falls within equivalent net liability bands under both 2025 and 2026 tax provisions.`}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right font-mono bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700/80">
              <span className="text-[10px] text-slate-400 uppercase block">Net YoY Variance</span>
              <span className={`text-base font-extrabold ${
                yearComparisonMetrics.diffInTax < 0
                  ? 'text-emerald-400'
                  : yearComparisonMetrics.diffInTax > 0
                  ? 'text-amber-400'
                  : 'text-blue-300'
              }`}>
                {yearComparisonMetrics.diffInTax < 0 ? '-' : yearComparisonMetrics.diffInTax > 0 ? '+' : ''}
                {yearComparisonMetrics.absDiff.toLocaleString()} BDT
              </span>
            </div>
          </div>

          {/* 3 YoY Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. 2025 Act Card */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">Finance Act 2025</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">AY 2025–26</span>
              </div>
              <div className="pt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {yearComparisonMetrics.netTax2025.toLocaleString()} BDT
                </span>
                <p className="text-[11px] text-slate-400">Net Tax Payable (2025 Rules)</p>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax-Free Base:</span>
                  <span>3,50,000 BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Tax:</span>
                  <span>{yearComparisonMetrics.grossTax2025.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rebate (15%):</span>
                  <span className="text-emerald-400">-{yearComparisonMetrics.rebate2025.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Rate:</span>
                  <span>{yearComparisonMetrics.effectiveRate2025.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* 2. 2026 Act Card */}
            <div className="bg-slate-900/80 border border-blue-500/50 rounded-2xl p-4 space-y-2 ring-1 ring-blue-500/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-400 uppercase tracking-wider">Finance Act 2026</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">AY 2026–27</span>
              </div>
              <div className="pt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {yearComparisonMetrics.netTax2026.toLocaleString()} BDT
                </span>
                <p className="text-[11px] text-slate-400">Net Tax Payable (2026 Rules)</p>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax-Free Base:</span>
                  <span className="text-emerald-400">3,75,000 BDT (+25K)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Tax:</span>
                  <span>{yearComparisonMetrics.grossTax2026.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rebate (10%):</span>
                  <span className="text-emerald-400">-{yearComparisonMetrics.rebate2026.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Early Filing Incentive:</span>
                  <span className="text-emerald-400">-{yearComparisonMetrics.earlyIncentive2026.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Rate:</span>
                  <span>{yearComparisonMetrics.effectiveRate2026.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* 3. Variance Analysis Card */}
            <div className="bg-slate-900/80 border border-emerald-500/50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider">Net Variance</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">YoY Shift</span>
              </div>
              <div className="pt-1">
                <span className={`text-2xl font-bold font-mono ${yearComparisonMetrics.diffInTax <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {yearComparisonMetrics.diffInTax < 0 ? '-' : yearComparisonMetrics.diffInTax > 0 ? '+' : ''}
                  {yearComparisonMetrics.absDiff.toLocaleString()} BDT
                </span>
                <p className="text-[11px] text-slate-400">Variance in Net Tax Due</p>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Rate Shift:</span>
                  <span className={yearComparisonMetrics.rateDiff <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {yearComparisonMetrics.rateDiff <= 0 ? '' : '+'}{yearComparisonMetrics.rateDiff.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Exemption Delta:</span>
                  <span className="text-emerald-400">+25,000 BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slab Structure:</span>
                  <span className="text-blue-300">5% Slab Eliminated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Early Return Bonus:</span>
                  <span className="text-emerald-400">5% (Up to 25K BDT)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Detailed Breakdown Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-700 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-4 font-semibold">Tax Metric & Parameter</th>
                  <th className="py-3 px-4 font-semibold text-right text-amber-300">Finance Act 2025 (AY 2025-26)</th>
                  <th className="py-3 px-4 font-semibold text-right text-blue-300">Finance Act 2026 (AY 2026-27)</th>
                  <th className="py-3 px-4 font-semibold text-right text-emerald-300">YoY Delta / Key Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Tax-Free Exemption Threshold</td>
                  <td className="py-2.5 px-4 text-right">3,50,000 BDT</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-400">3,75,000 BDT</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">+25,000 BDT Tax-Free Base</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Lowest Taxable Bracket Rate</td>
                  <td className="py-2.5 px-4 text-right">5% (Next 1.00 Lakh BDT)</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-300">10% (5% Bracket Removed)</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">Simplified 4-Tier Progressive Slabs</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Gross Tax Before Rebates</td>
                  <td className="py-2.5 px-4 text-right">{yearComparisonMetrics.grossTax2025.toLocaleString()} BDT</td>
                  <td className="py-2.5 px-4 text-right">{yearComparisonMetrics.grossTax2026.toLocaleString()} BDT</td>
                  <td className="py-2.5 px-4 text-right text-slate-300">
                    {(yearComparisonMetrics.grossTax2026 - yearComparisonMetrics.grossTax2025).toLocaleString()} BDT
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Investment Rebate Rules</td>
                  <td className="py-2.5 px-4 text-right">15% Rebate (Cap: 3% Total Income)</td>
                  <td className="py-2.5 px-4 text-right font-bold text-amber-300">10% Rebate (Cap: 7.5% Total Income)</td>
                  <td className="py-2.5 px-4 text-right text-amber-300">Expanded Cap % for High Investors</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Actual Approved Investment Rebate</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">-{yearComparisonMetrics.rebate2025.toLocaleString()} BDT</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">-{yearComparisonMetrics.rebate2026.toLocaleString()} BDT</td>
                  <td className="py-2.5 px-4 text-right text-slate-300">
                    {(yearComparisonMetrics.rebate2026 - yearComparisonMetrics.rebate2025).toLocaleString()} BDT
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Early Return Submission Incentive</td>
                  <td className="py-2.5 px-4 text-right text-slate-500">N/A (None)</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400 font-bold">
                    -{yearComparisonMetrics.earlyIncentive2026.toLocaleString()} BDT (5% up to 25K)
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">New Early Filing Benefit</td>
                </tr>
                <tr className="bg-slate-950/80 font-bold">
                  <td className="py-3 px-4 text-white">Final Net Tax Payable</td>
                  <td className="py-3 px-4 text-right text-amber-300">{yearComparisonMetrics.netTax2025.toLocaleString()} BDT</td>
                  <td className="py-3 px-4 text-right text-blue-300 text-sm">{yearComparisonMetrics.netTax2026.toLocaleString()} BDT</td>
                  <td className={`py-3 px-4 text-right text-sm ${yearComparisonMetrics.diffInTax <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {yearComparisonMetrics.diffInTax < 0 ? '-' : yearComparisonMetrics.diffInTax > 0 ? '+' : ''}
                    {yearComparisonMetrics.absDiff.toLocaleString()} BDT
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-200">Effective Tax Rate</td>
                  <td className="py-2.5 px-4 text-right">{yearComparisonMetrics.effectiveRate2025.toFixed(2)}%</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-300">{yearComparisonMetrics.effectiveRate2026.toFixed(2)}%</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${yearComparisonMetrics.rateDiff <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {yearComparisonMetrics.rateDiff <= 0 ? '' : '+'}{yearComparisonMetrics.rateDiff.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
