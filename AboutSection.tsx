import React from 'react';
import { User, MapPin, Globe, Cpu, Award, Download, CheckCircle, Code, Server, Shield } from 'lucide-react';
import { Profile } from '../types';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="py-24 relative z-10 border-t border-slate-900/60 bg-[#040711]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081229] border border-[#00f0ff]/25 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-4">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Engineering Focus</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Architecting the Digital Frontier
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Learn more about my technical background, core skill matrix, and released software tools.
          </p>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-[#121b36] grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-[#00f0ff]/20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-20 h-20 rounded-xl object-cover ring-2 ring-[#00f0ff]/50 shadow-electric shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-[#00f0ff]">
                    {profile.username}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {profile.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed mb-6 pt-4 border-t border-slate-800">
                <p>{profile.bio}</p>
                <p>{profile.detailedBio}</p>
              </div>
            </div>

            {/* Quick Metadata Info List */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>Based in {profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>Primary Languages: TypeScript, Rust, GLSL, C++</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>Availability: Open for Technical Advisory & Collaborations</span>
              </div>
            </div>
          </div>

          {/* Right Column: Skills Matrix & Key Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            
            {/* 4-Stat Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/20 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00f0ff] font-display tabular-nums">
                  {profile.stats.totalDownloads}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1">Total Downloads</div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/20 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00f0ff] font-display tabular-nums">
                  {profile.stats.publishedTools}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1">Published Tools</div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/20 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00f0ff] font-display tabular-nums">
                  {profile.stats.githubStars}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1">GitHub Stars</div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/20 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00f0ff] font-display tabular-nums">
                  {profile.stats.uptime}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-1">Service Uptime</div>
              </div>
            </div>

            {/* Core Capabilities Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#00f0ff]/20 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
                  <Cpu className="w-5 h-5 text-[#00f0ff]" />
                  Core Competencies & Stack Matrix
                </h3>
                
                {/* Zero-Pill Clean Skill Listing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {profile.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#091124]/90 border border-slate-800 hover:border-[#00f0ff]/40 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-electric shrink-0" />
                      <span className="text-sm font-medium text-slate-200">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Resume / CV callout */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Looking for a full engineering breakdown or technical CV?
                </p>
                <a
                  href="#resources"
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-lg transition-all shadow-electric flex items-center gap-2 whitespace-nowrap shrink-0 font-display"
                >
                  <Download className="w-3.5 h-3.5" />
                  View Tech Manuals
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
