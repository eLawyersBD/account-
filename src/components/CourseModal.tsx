import React, { useState } from 'react';
import { CourseItem } from '../types';
import { SocialShareBar } from './SocialShareBar';
import { X, GraduationCap, Clock, BookOpen, Users, Star, Award, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CourseModalProps {
  course: CourseItem;
  onClose: () => void;
  onOpenConsultation: (note?: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onOpenConsultation }) => {
  const [studentStatus, setStudentStatus] = useState<'enrolled' | 'completed' | 'none'>('enrolled');
  const [enrollSuccess, setEnrollSuccess] = useState<boolean>(false);

  const handleEnroll = () => {
    setStudentStatus('enrolled');
    setEnrollSuccess(true);
    setTimeout(() => setEnrollSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-8 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition z-10"
          aria-label="Close Course Detail Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Course Header */}
        <div className="space-y-4 border-b border-slate-800 pb-6 pr-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>{course.level} Level</span>
            </span>
            <span className="text-slate-400 flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.duration}</span>
            </span>
            <span className="text-slate-400 flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.modulesCount} Modules</span>
            </span>
            <span className="text-amber-400 flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating} / 5.0</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
            {course.title}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-blue-300">
                {course.instructor.charAt(0)}
              </div>
              <span>Lead Director: <strong className="text-white">{course.instructor}</strong></span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Users className="w-4 h-4" />
              <span>{course.enrolledStudents.toLocaleString()} Executives Enrolled</span>
            </div>
          </div>
        </div>

        {/* Enrollment Toast Banner */}
        {enrollSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 p-4 rounded-2xl flex items-center space-x-3 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white text-sm">Enrollment Confirmed!</p>
              <p>You are officially registered for this course. Share your enrollment status with your network on LinkedIn or Facebook below!</p>
            </div>
          </div>
        )}

        {/* Course Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            About This Certification Masterclass
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            {course.description}
          </p>
        </div>

        {/* Social Media Sharing Section (Primary User Intent) */}
        <div className="bg-slate-950 border border-blue-500/40 rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base">
                  Share Your Enrollment or Certification
                </h4>
                <p className="text-xs text-slate-400">
                  Broadcast your professional credential directly to LinkedIn or Facebook
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full font-semibold">
                Badge: {course.badge}
              </span>
            </div>
          </div>

          {/* Social Share Bar */}
          <SocialShareBar
            title={course.title}
            subtitle={course.subtitle}
            type="course"
            badgeTitle={course.certificationTitle}
          />
        </div>

        {/* Curriculum & Key Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Syllabus */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Curriculum Syllabus ({course.modulesCount} Modules)</span>
            </h3>
            <ul className="space-y-2">
              {course.curriculum.map((mod, idx) => (
                <li key={idx} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{mod}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Learned */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Executive Competencies Mastery</span>
            </h3>
            <div className="space-y-2">
              {course.skillsLearned.map((skill, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{skill}</span>
                </div>
              ))}
            </div>

            {/* Credential Issuance Notice */}
            <div className="mt-4 p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-blue-300 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Digital Certificate Included</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Issued upon completion with a unique verification URL for LinkedIn credential embedding.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleEnroll}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Confirm Student Enrollment</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsultation(`Course Inquiry: ${course.title}`);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <span>Speak with Course Director</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
