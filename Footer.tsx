import React from 'react';
import { Zap, ArrowUp, ShieldCheck } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-slate-900 bg-[#03050e] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff] p-0.5 flex items-center justify-center shadow-electric">
              <div className="w-full h-full bg-[#040711] rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#00f0ff]" />
              </div>
            </div>
            <span className="text-white font-extrabold tracking-tight font-display text-lg">
              {profile.name} <span className="text-[#00f0ff] text-xs font-mono">/ OFFICIAL</span>
            </span>
          </div>

          {/* Quick Footer Navigation Links */}
          <nav className="flex items-center gap-6 text-xs font-medium flex-wrap justify-center">
            <a href="#hero" className="hover:text-[#00f0ff] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#00f0ff] transition-colors">About</a>
            <a href="#socials" className="hover:text-[#00f0ff] transition-colors">Socials</a>
            <a href="#resources" className="hover:text-[#00f0ff] transition-colors">Resources</a>
            <a href="#contact" className="hover:text-[#00f0ff] transition-colors">Contact</a>
            
            {/* Admin Control Trigger at bottom of site */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1 bg-[#081229] hover:bg-[#0e1d42] border border-[#00f0ff]/30 rounded-lg text-[#00f0ff] hover:text-cyan-200 transition-all font-mono text-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Control Panel (এডমিন প্যানেল)</span>
            </button>
          </nav>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-[#081126] border border-slate-800 hover:border-[#00f0ff]/40 text-slate-300 hover:text-[#00f0ff] transition-colors flex items-center gap-1 text-xs"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00f0ff]" />
          </button>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name} ({profile.username}). All rights reserved.</p>
          <p>Official Web Platform & Resource Hub</p>
        </div>

      </div>
    </footer>
  );
};
