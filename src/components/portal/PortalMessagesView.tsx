import React, { useState, useEffect, useRef } from 'react';
import { PortalMessage, ClientProfile } from '../../types';
import { sendPortalMessage } from '../../lib/portalService';
import { 
  Send, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  CheckCheck, 
  Sparkles,
  Paperclip,
  Clock
} from 'lucide-react';

interface PortalMessagesViewProps {
  messages: PortalMessage[];
  userProfile: ClientProfile | null;
  userId: string;
  projectId?: string;
}

export const PortalMessagesView: React.FC<PortalMessagesViewProps> = ({
  messages,
  userProfile,
  userId,
  projectId
}) => {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageContent = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendPortalMessage({
        userId,
        projectId: projectId || 'proj_01',
        senderName: userProfile?.displayName || 'Client Executive',
        senderRole: userProfile?.role || 'Executive Client',
        senderType: 'client',
        message: messageContent,
        read: false
      });
    } catch (err) {
      console.error('Failed to send portal message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
      
      {/* Top Advisory Thread Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80"
              alt="Lead Strategist"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900">Sarah Jenkins, FCA</h4>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                Senior Partner
              </span>
            </div>
            <p className="text-xs text-slate-500">Accounticca Lead Advisory Engagement Channel</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">End-to-End Encrypted Advisory Line</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p>No messages yet. Send a query to your lead consultant below.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isClient = msg.senderType === 'client';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-baseline space-x-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-700">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-400">({msg.senderRole})</span>
                </div>

                <div
                  className={`max-w-md sm:max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isClient
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.message}</p>
                </div>

                <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-400 px-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Just now</span>
                  {isClient && <CheckCheck className="w-3 h-3 text-blue-500 ml-1" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center space-x-3 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a strategic question, request a financial model update, or reply to Sarah..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 disabled:opacity-50 active:scale-95"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
