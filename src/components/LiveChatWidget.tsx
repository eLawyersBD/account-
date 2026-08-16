import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, PhoneCall, Calendar, CheckCheck, Minimize2 } from 'lucide-react';

interface LiveChatWidgetProps {
  onOpenConsultation: (note?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpenConsultation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello! Welcome to Accounticca Business Advisory. I’m David, Senior Advisory Consultant. How can we support your financial or strategic goals today?',
      timestamp: getCurrentTime(),
      quickActions: [
        { label: 'Book Advisory Call', action: () => onOpenConsultation('Chat Inquiry: Advisory Call') },
        { label: 'Financial Audit', action: () => handleSendPreset('I would like information on your Financial Health Audit.') },
        { label: 'E-Lawyers Synergy', action: () => handleSendPreset('Tell me about the legal & corporate structuring synergy with E-Lawyers.') },
        { label: 'Consulting Packages', action: () => handleSendPreset('What are your monthly consultancy package pricing plans?') },
      ],
    },
  ]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleSendPreset = (text: string) => {
    addUserMessage(text);
  };

  const addUserMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulated Consultant response logic
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Thank you for reaching out! Our advisory team can help tailor a solution for your specific business structure.";
      let actions: { label: string; action: () => void }[] | undefined = [
        { label: 'Schedule Consultation', action: () => onOpenConsultation(`Chat Inquiry: ${text.slice(0, 30)}...`) }
      ];

      const lower = text.toLowerCase();
      if (lower.includes('audit') || lower.includes('financial')) {
        replyText = "Our Financial & Accounting Audit reviews cash flow, tax optimization, and reporting accuracy. We can perform an initial diagnosis within 5 business days.";
      } else if (lower.includes('e-lawyers') || lower.includes('legal') || lower.includes('synergy')) {
        replyText = "Through our premier partnership with E-Lawyers, Accounticca provides seamless corporate governance, compliance protection, and financial management in one unified package.";
      } else if (lower.includes('package') || lower.includes('pricing') || lower.includes('cost')) {
        replyText = "We offer flexible retainer options: Growth Catalyst, Scale-Up Execution, and Enterprise Advisory. Would you like to schedule a 30-minute discovery session?";
      }

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: getCurrentTime(),
        quickActions: actions,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMessage(inputMessage);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      
      {/* Chat Box Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-scale-up origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400/40 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                  DA
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div>
                <h4 className="text-sm font-serif font-bold text-white flex items-center space-x-1.5">
                  <span>David Miller</span>
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase tracking-wider font-sans font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                    Advisor
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Online • Senior Consultant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={toggleChat}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Consultation Banner inside Chat */}
          <div className="bg-blue-50 border-b border-blue-100 p-2.5 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-blue-900 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Need direct executive strategy?</span>
            </div>
            <button
              onClick={() => onOpenConsultation('Live Chat Banner Direct')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold transition shrink-0 whitespace-nowrap shadow-sm"
            >
              Book Call
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Quick Action Chips if present */}
                {msg.quickActions && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                    {msg.quickActions.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={qa.action}
                        className="bg-white border border-blue-200 hover:border-blue-400 text-blue-700 hover:bg-blue-50 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs transition"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 w-20 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition shrink-0 shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="relative group">
        <button
          onClick={toggleChat}
          aria-label="Open Advisory Live Chat"
          className={`flex items-center space-x-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400/40 shadow-blue-600/30'
          }`}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 text-white" />
              <span className="text-xs font-semibold">Close Chat</span>
            </>
          ) : (
            <>
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-blue-600 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold tracking-wide">Live Advisory Chat</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
