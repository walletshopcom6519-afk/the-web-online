import React from 'react';
import { X, Send, ArrowRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { CommunityPopupConfig } from '../types';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CommunityPopupConfig;
}

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  if (!isOpen || !config.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain rounded-2xl p-4 sm:p-5 border border-[#00f0ff]/40 shadow-electric-lg relative">
        
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-30 p-2 text-white hover:text-white rounded-xl bg-slate-900 border border-slate-600 hover:border-[#00f0ff]/60 shadow-lg transition-colors cursor-pointer"
          aria-label="Close welcome modal"
          title="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081229] border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Community Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Join Our Official Channels
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
            Connect directly with RAMJAN AHMED and our developer community for real-time announcements, instant file updates, and source code access.
          </p>
        </div>

        {/* 2 Community Group Cards Side-By-Side / Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-5">
          
          {/* WhatsApp Group Card */}
          <div className="glass-panel rounded-xl p-4 sm:p-5 border border-emerald-500/30 bg-[#061812]/80 flex flex-col justify-between group hover:border-emerald-400 transition-all shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {config.whatsappTitle || 'WhatsApp Group'}
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Official Community</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {config.whatsappDescription || 'Join our official WhatsApp group for instant project announcements and direct help.'}
              </p>
            </div>

            <a
              href={config.whatsappLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 font-display"
            >
              <MessageCircle className="w-4 h-4" />
              Join WhatsApp Group
            </a>
          </div>

          {/* Telegram Channel Card */}
          <div className="glass-panel rounded-xl p-4 sm:p-5 border border-sky-500/30 bg-[#071728]/80 flex flex-col justify-between group hover:border-sky-400 transition-all shadow-lg">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-md">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {config.telegramTitle || 'Telegram Channel'}
                  </h3>
                  <span className="text-[11px] text-sky-400 font-mono">Direct Updates</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {config.telegramDescription || 'Subscribe to our official Telegram channel for direct file downloads and source code.'}
              </p>
            </div>

            <a
              href={config.telegramLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 font-display"
            >
              <Send className="w-4 h-4" />
              Join Telegram Channel
            </a>
          </div>

        </div>

        {/* Footer Close Action */}
        <div className="pt-3 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span>Official Community Links Managed by Admin</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 font-display"
          >
            <span>Continue to Website</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00f0ff]" />
          </button>
        </div>

      </div>
    </div>
  );
};
