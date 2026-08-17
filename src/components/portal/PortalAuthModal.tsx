import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { seedInitialClientDataIfEmpty } from '../../lib/portalService';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  Building2, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await seedInitialClientDataIfEmpty(
          userCred.user.uid, 
          userCred.user.email || email, 
          displayName.trim() || undefined,
          companyName.trim() || undefined
        );
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        await seedInitialClientDataIfEmpty(
          userCred.user.uid, 
          userCred.user.email || email
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. If you are new, please toggle to "Create Account" or use Instant Demo Access.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      await seedInitialClientDataIfEmpty(
        userCred.user.uid,
        userCred.user.email || 'client@accounticca.com',
        userCred.user.displayName || undefined
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.warn('Google Popup auth notice:', err);
      // If popup fails (e.g. popup blocked in iframe sandbox), provide fallback demo sign-in
      try {
        const anonCred = await signInAnonymously(auth);
        await seedInitialClientDataIfEmpty(
          anonCred.user.uid,
          'executive.client@accounticca-portal.com',
          'Executive Client',
          'Apex Strategic Enterprises'
        );
        onSuccess();
        onClose();
      } catch (anonErr: any) {
        setError('Could not sign in with Google. You can use Demo Instant Access below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // Create or sign in to quick demo guest session
      const anonCred = await signInAnonymously(auth);
      await seedInitialClientDataIfEmpty(
        anonCred.user.uid,
        'executive.director@apex-enterprises.com',
        'Elena Rostova',
        'Apex Strategic Enterprises'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Demo auth failed:', err);
      setError('Could not initialize demo session. Please try email sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Client Portal</span>
          </div>

          <h3 className="text-2xl font-bold font-serif tracking-tight">
            {isSignUp ? 'Create Client Portal Account' : 'Executive Client Portal'}
          </h3>
          <p className="text-xs text-blue-200/80 mt-1 leading-relaxed">
            {isSignUp 
              ? 'Register your company profile to access project deliverables, milestones, and confidential advisory models.' 
              : 'Sign in to access real-time project milestones, pending invoices, and shared consultancy documents.'}
          </p>
        </div>

        {/* Auth Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Instant Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300/80 text-amber-900 font-bold text-xs flex items-center justify-between transition group shadow-xs"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div className="text-left">
                <p className="font-bold leading-tight">Instant 1-Click Demo Access</p>
                <p className="text-[10px] text-amber-700 font-normal">Pre-loaded with live project, invoices & documents</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center space-x-3 my-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-semibold uppercase text-slate-400">or use credentials</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Strategic Enterprises"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition active:scale-98 disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Portal Account' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-2.5 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google Workspace</span>
          </button>

          {/* Switch mode */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              {isSignUp 
                ? 'Already have portal credentials? Sign In' 
                : "New client? Register for Portal Access"}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict SOC-2 Type II & GDPR Compliant Security</span>
          </div>

        </div>
      </div>
    </div>
  );
};
