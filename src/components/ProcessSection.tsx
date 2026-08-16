import React, { useState } from 'react';
import { Search, Compass, CheckCircle2, BarChart3, ArrowRight, CheckSquare, Square, Sparkles, RefreshCw } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface ProcessSectionProps {
  onOpenConsultation: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenConsultation }) => {
  const steps = [
    {
      id: 'step1',
      step: 'Step 1',
      title: 'Business Assessment',
      description: 'Understanding your current business situation, operational challenges, financial health, and long-term goals.',
      icon: <Search className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'step2',
      step: 'Step 2',
      title: 'Strategy Development',
      description: 'Creating customized recommendations, actionable business plans, financial models, and structured improvement roadmaps.',
      icon: <Compass className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'step3',
      step: 'Step 3',
      title: 'Implementation Support',
      description: 'Helping your team execute strategies effectively, set up systems, deploy automation, and train personnel.',
      icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'step4',
      step: 'Step 4',
      title: 'Performance Monitoring',
      description: 'Tracking progress against established KPIs, reviewing financial statements, and driving continuous improvement.',
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />
    }
  ];

  // Checklist state initialized with Step 1 checked by default
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  });

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  const resetChecklist = () => {
    setCompletedSteps({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
    });
  };

  const completeAllSteps = () => {
    setCompletedSteps({
      step1: true,
      step2: true,
      step3: true,
      step4: true,
    });
  };

  return (
    <section id="process" className="py-24 bg-white text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <span>How We Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Our Consulting Process
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            A structured, transparent 4-step methodology designed to deliver measurable results without disrupting your daily operations.
          </p>
        </AnimatedSection>

        {/* Interactive Advisory Journey Checklist Progress Indicator */}
        <AnimatedSection animation="fade-up" delay={100} className="mb-12">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Your Advisory Journey Progress</h3>
                  <p className="text-xs text-slate-400">Click steps to simulate your team's engagement roadmap status</p>
                </div>
              </div>

              {/* Progress Percentage Badge */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Advisory Completion</span>
                  <span className="text-xl font-bold font-mono text-blue-400">{progressPercentage}%</span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-blue-400 text-sm shadow-inner">
                  {completedCount}/{steps.length}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
                <span>Phase 1: Initial Discovery</span>
                <span>Phase 2: Strategy</span>
                <span>Phase 3: Execution</span>
                <span>Phase 4: Optimization</span>
              </div>
            </div>

            {/* Interactive Step Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {steps.map((item, idx) => {
                const isDone = completedSteps[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleStep(item.id)}
                    type="button"
                    className={`p-3.5 rounded-2xl border text-left transition duration-200 flex items-start space-x-3 ${
                      isDone
                        ? 'bg-blue-950/60 border-blue-500/50 text-white ring-1 ring-blue-500/30'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-blue-400' : 'text-slate-400'}`}>
                          {item.step}
                        </span>
                        {isDone && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-xs font-semibold">
                            Done
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-bold leading-snug truncate ${isDone ? 'text-white' : 'text-slate-200'}`}>
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Checklist Action Buttons */}
            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetChecklist}
                  type="button"
                  className="text-slate-400 hover:text-white transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={completeAllSteps}
                  type="button"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Mark All Complete
                </button>
              </div>

              <div className="text-slate-400 italic text-[11px] hidden sm:block">
                {progressPercentage === 100
                  ? '🎉 All consulting phases ready for deployment!'
                  : 'Complete each step with our expert advisors.'}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Process Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const isCompleted = completedSteps[item.id];
            return (
              <AnimatedSection
                key={idx}
                animation="fade-up"
                delay={idx * 120}
                duration={600}
              >
                <div
                  className={`bg-white border rounded-2xl p-6 relative flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-blue-500/5 group transition h-full ${
                    isCompleted ? 'border-blue-500/80 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-blue-500/50'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isCompleted ? 'bg-blue-600 text-white' : 'text-blue-700 bg-blue-50'
                      }`}>
                        {item.step} {isCompleted ? '✓' : ''}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                    <span>Phase {idx + 1} of 4</span>
                    <span className="text-blue-600 font-medium">
                      {isCompleted ? 'Phase Active' : 'Accounticca Standard'}
                    </span>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <AnimatedSection animation="zoom-in" delay={300} className="mt-12 text-center">
          <button
            onClick={onOpenConsultation}
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/20 inline-flex items-center space-x-2"
          >
            <span>Begin Your Business Assessment Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </AnimatedSection>

      </div>
    </section>
  );
};

