import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Linkedin, Facebook, Twitter, Link2, Check, Award, GraduationCap, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  subtitle?: string;
  url?: string;
  type?: 'course' | 'certification' | 'article';
  badgeTitle?: string;
  compact?: boolean;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  title,
  subtitle,
  url,
  type = 'course',
  badgeTitle,
  compact = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [shareMode, setShareMode] = useState<'enrollment' | 'certification'>('certification');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Generate public canonical share URL
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://accounticca-advisory.com');
  const encodedUrl = encodeURIComponent(currentUrl);

  // Custom pre-formatted professional sharing messages
  const shareTextMap = {
    certification: `🎓 Honored to announce that I've completed the "${title}" certification program with Accounticca Executive Academy! Excited to apply these advanced corporate strategy & governance frameworks. #ExecutiveEducation #Accounticca #ProfessionalDevelopment #${title.replace(/\s+/g, '')}`,
    enrollment: `📚 Just enrolled in the "${title}" masterclass at Accounticca Executive Academy! Looking forward to mastering ${subtitle || 'advanced business strategy'}. #Upskilling #Leadership #Accounticca`,
    article: `💡 Insightful executive breakdown: "${title}" by Accounticca Advisory. Essential reading for business leaders & founders.`,
  };

  const activeShareText = shareTextMap[type === 'article' ? 'article' : shareMode];
  const encodedText = encodeURIComponent(activeShareText);

  // Social Share URLs
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: activeShareText,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Certification / Enrollment Toggle (if course or certification type) */}
      {type !== 'article' && !compact && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Share Credential & Social Proof</span>
            </span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setShareMode('certification')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  shareMode === 'certification'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Certification
              </button>
              <button
                type="button"
                onClick={() => setShareMode('enrollment')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  shareMode === 'enrollment'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Enrollment
              </button>
            </div>
          </div>

          {/* Badge Preview Box */}
          <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shrink-0 shadow-md">
              {shareMode === 'certification' ? <Award className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div className="space-y-0.5 text-xs">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {shareMode === 'certification' ? 'Verified Credential' : 'Active Student Status'}
              </span>
              <p className="font-bold text-white line-clamp-1">
                {badgeTitle || title}
              </p>
              <p className="text-[11px] text-slate-400">Issued by Accounticca Executive Academy</p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Social Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* LinkedIn Button */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs transition shadow-md shadow-[#0A66C2]/20 flex items-center justify-center space-x-2 group"
          title="Share to LinkedIn Network"
        >
          <Linkedin className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span>LinkedIn</span>
        </a>

        {/* Facebook Button */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0d65d9] text-white font-bold text-xs transition shadow-md shadow-[#1877F2]/20 flex items-center justify-center space-x-2 group"
          title="Share to Facebook"
        >
          <Facebook className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span>Facebook</span>
        </a>

        {/* Twitter / X Button */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          title="Share on X / Twitter"
        >
          <Twitter className="w-4 h-4 text-sky-400 fill-current" />
          <span className="hidden sm:inline">X / Twitter</span>
        </a>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center space-x-1.5"
          title="Copy shareable URL"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Custom Post Copy Helper Trigger */}
        <button
          type="button"
          onClick={() => setShowShareModal(true)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-semibold transition"
          title="View & Copy Professional Caption"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Copy Pre-Formatted Caption Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100 relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-blue-400" />
                  <h4 className="font-serif font-bold text-white text-base">
                    Professional Network Share Text
                  </h4>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Copy this pre-formatted caption to paste into your LinkedIn or Facebook post along with your credential link:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed relative group">
                <p>{activeShareText}</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-sans font-medium break-all">
                  URL: {currentUrl}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${activeShareText}\n\n${currentUrl}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Caption & Link Copied!' : 'Copy Full Post & Link'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
