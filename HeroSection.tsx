import React, { useEffect, useState } from 'react';
import { ArrowDown, Download, Sparkles, Zap, ExternalLink, ShieldCheck, Github, Twitter, Youtube, MessageSquare } from 'lucide-react';
import { Profile } from '../types';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0);

  const textOptions = [
    'Architecting Next-Gen Mesh Systems',
    'Crafting WebGL Shaders & 3D UI',
    'Publishing High-Performance Dev Tools',
    'Engineering Zero-Trust Cyber Networks'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingTextIndex((prev) => (prev + 1) % textOptions.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [textOptions.length]);

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden z-10">
      
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Profile Avatar Frame with Electric Blue Glowing Ring */}
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00f0ff] via-blue-600 to-cyan-400 rounded-full blur-md animate-pulse opacity-80" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-[#040711] ring-2 ring-[#00f0ff]/40 shadow-electric-lg overflow-hidden mx-auto">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Status Indicator Chip */}
          <div className="absolute bottom-1 right-2 sm:bottom-2 sm:right-4 bg-[#091124] border border-[#00f0ff]/40 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-[11px] font-medium text-cyan-200 whitespace-nowrap">{profile.status || 'Active Online'}</span>
          </div>
        </div>

        {/* Name & Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-3 font-display">
          {profile.name}
        </h1>
        
        <p className="text-lg sm:text-xl font-medium text-[#00f0ff] mb-4 tracking-wide font-display">
          {profile.title}
        </p>

        {/* Animated Rotating Text Headline */}
        <div className="h-8 mb-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#09132b]/80 border border-[#00f0ff]/20 text-xs sm:text-sm font-medium text-slate-300 backdrop-blur-md">
            <Zap className="w-4 h-4 text-[#00f0ff] shrink-0" />
            <span className="text-[#00f0ff] font-semibold transition-all duration-300">
              {textOptions[rotatingTextIndex]}
            </span>
          </span>
        </div>

        {/* Bio summary paragraph */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
          {profile.headline}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#resources"
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all duration-200 shadow-electric hover:shadow-electric-lg flex items-center justify-center gap-2.5 font-display"
          >
            <Download className="w-4 h-4" />
            Explore Resource Library
          </a>

          <a
            href="#about"
            className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-slate-200 bg-[#0a1226]/80 hover:bg-[#111e3f] border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 rounded-xl transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            Learn More About Me
          </a>
        </div>

        {/* Quick Social Buttons Strip */}
        <div className="flex items-center justify-center flex-wrap gap-3 max-w-xl mx-auto pt-4 border-t border-slate-800/80">
          <a
            href="https://github.com/alexmercer-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#091228] hover:bg-[#112046] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-lg text-slate-300 hover:text-[#00f0ff] transition-all duration-200"
            title="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#091228] hover:bg-[#112046] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-lg text-slate-300 hover:text-[#00f0ff] transition-all duration-200"
            title="X / Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#091228] hover:bg-[#112046] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-lg text-slate-300 hover:text-[#00f0ff] transition-all duration-200"
            title="YouTube Channel"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#091228] hover:bg-[#112046] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-lg text-slate-300 hover:text-[#00f0ff] transition-all duration-200"
            title="Discord Community"
          >
            <MessageSquare className="w-5 h-5" />
          </a>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Key Stat Badge */}
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span>{profile.stats.totalDownloads} Total Downloads</span>
          </div>
        </div>

        {/* Scroll Indicator Down */}
        <div className="mt-16 flex justify-center">
          <a
            href="#about"
            className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-[#00f0ff] transition-colors duration-200 group"
            aria-label="Scroll down to About section"
          >
            <span className="text-[11px] uppercase tracking-widest font-mono">Scroll Down</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#00f0ff]" />
          </a>
        </div>

      </div>
    </section>
  );
};
