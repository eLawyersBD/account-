import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, Award, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface HealthAssessmentModalProps {
  onClose: () => void;
  onOpenConsultationWithNote: (note: string) => void;
}

export const HealthAssessmentModal: React.FC<HealthAssessmentModalProps> = ({ onClose, onOpenConsultationWithNote }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      question: '1. How well is your financial recordkeeping and cash flow tracking organized?',
      options: [
        { label: 'Ad-hoc (Manual spreadsheets, mixed personal/business expenses)', score: 1 },
        { label: 'Basic (Monthly bookkeeping, but lack real-time cash flow forecasting)', score: 2 },
        { label: 'Strong (Automated accounting software, monthly management accounts)', score: 3 }
      ]
    },
    {
      question: '2. Do you operate with a documented annual business plan and growth strategy?',
      options: [
        { label: 'No formal plan; we operate day-to-day reactively', score: 1 },
        { label: 'We have general goals in mind but lack detailed KPI milestones', score: 2 },
        { label: 'Yes, comprehensive strategic plan with tracked milestones & KPIs', score: 3 }
      ]
    },
    {
      question: '3. How standardized are your operational workflows and Standard Operating Procedures (SOPs)?',
      options: [
        { label: 'Everything depends entirely on the founder or key individuals', score: 1 },
        { label: 'Some informal processes exist, but lack full documentation', score: 2 },
        { label: 'Fully documented SOPs; operations run smoothly without founder bottleneck', score: 3 }
      ]
    },
    {
      question: '4. What is the state of your business automation and digital tools (ERP, CRM, Billing)?',
      options: [
        { label: 'Mostly manual paperwork and disjointed standalone tools', score: 1 },
        { label: 'Basic tools in use, but lacking integration or workflow automation', score: 2 },
        { label: 'Integrated digital ecosystem (Cloud accounting, CRM, automated invoicing)', score: 3 }
      ]
    },
    {
      question: '5. How would you rate your team organization and HR performance structure?',
      options: [
        { label: 'High turnover or unclear job descriptions and role definitions', score: 1 },
        { label: 'Decent team, but lacking structured performance reviews or KPIs', score: 2 },
        { label: 'Strong organizational structure with clear KPIs and employee retention systems', score: 3 }
      ]
    }
  ];

  const handleSelectOption = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      const percentage = Math.round((sum / (questions.length * 3)) * 100);

      window.dispatchEvent(
        new CustomEvent('accounticca_log_activity', {
          detail: {
            type: 'assessment',
            title: '5-Minute Business Health Diagnostic Completed',
            description: `Assessment finished with a Business Health Index score of ${percentage}/100 (${sum}/${questions.length * 3} points).`,
            actor: 'Client Executive',
            metadata: `Health Index: ${percentage}%`
          }
        })
      );
    }
  };

  const calculateTotalScore = () => {
    const sum = answers.reduce((a, b) => a + b, 0);
    // max score is 15
    const percentage = Math.round((sum / (questions.length * 3)) * 100);
    return { sum, percentage };
  };

  const getScoreFeedback = (percentage: number) => {
    if (percentage >= 80) {
      return {
        title: 'Strong Operational Maturity',
        description: 'Your business has robust foundations. Focus on enterprise expansion, advanced automation, and market positioning advisory.',
        badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Moderate Growth Potential',
        description: 'You have a viable business model with key operational and financial bottlenecks holding back scalability. Process optimization and financial control will unlock rapid growth.',
        badgeColor: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    } else {
      return {
        title: 'Critical Foundation Needed',
        description: 'Your business requires urgent attention in financial recordkeeping, process documentation, and strategic planning to prevent cash burn and founder burnout.',
        badgeColor: 'text-rose-800 bg-rose-50 border-rose-200'
      };
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-900">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Free Interactive Tool</span>
                <h3 className="text-xl font-serif font-bold text-slate-900">Business Health Assessment Scorecard</h3>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-lg font-serif font-semibold text-slate-900">
                {questions[currentStep].question}
              </h4>

              <div className="space-y-3 pt-2">
                {questions[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.score)}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500/50 hover:bg-white transition flex items-center justify-between group shadow-xs"
                  >
                    <span className="text-sm text-slate-800 group-hover:text-slate-900 font-medium">{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-3 transition" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="space-y-6 text-center py-4 animate-fade-in-scale relative overflow-hidden">
            
            {/* Animated Celebration Particle Accents */}
            <div className="absolute -top-2 left-1/4 w-3 h-3 rounded-full bg-blue-400 animate-confetti pointer-events-none" style={{ animationDelay: '100ms' }} />
            <div className="absolute top-4 right-1/4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-confetti pointer-events-none" style={{ animationDelay: '250ms' }} />

            {(() => {
              const { sum, percentage } = calculateTotalScore();
              const feedback = getScoreFeedback(percentage);
              return (
                <div className="space-y-6">
                  
                  {/* Pop badge */}
                  <div className="relative inline-block mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/25 animate-success-pop animate-ring-pulse">
                      <TrendingUp className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Assessment Complete</span>
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 pt-2">
                      Your Health Score: <span className="text-blue-600">{percentage}%</span>
                    </h3>
                  </div>

                  <div className={`max-w-md mx-auto p-4 rounded-xl border ${feedback.badgeColor} text-left space-y-2 shadow-xs`}>
                    <h4 className="text-base font-bold flex items-center space-x-2">
                      <Award className="w-5 h-5 shrink-0" />
                      <span>{feedback.title}</span>
                    </h4>
                    <p className="text-xs leading-relaxed opacity-95">{feedback.description}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md mx-auto text-xs text-slate-700 text-left space-y-1">
                    <span className="font-semibold text-blue-600">Accounticca Advisory Recommendation: </span>
                    <p className="pt-0.5 text-slate-600">
                      Based on your score of {percentage}%, we recommend scheduling a complimentary 30-minute consultation with our senior strategic team to review your growth roadmap.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Assessment</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenConsultationWithNote(`Completed Business Health Assessment Score: ${percentage}% (${feedback.title})`);
                      }}
                      className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                    >
                      <span>Discuss Results with Consultant</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
