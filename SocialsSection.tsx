import React from 'react';
import { 
  Github, 
  Youtube, 
  Twitter, 
  MessageSquare, 
  Send, 
  Linkedin, 
  Mail, 
  Instagram,
  Facebook,
  Globe,
  Share2
} from 'lucide-react';
import { SocialLink } from '../types';

interface SocialsSectionProps {
  socials: SocialLink[];
}

export const SocialsSection: React.FC<SocialsSectionProps> = ({ socials }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github':
        return <Github className="w-6 h-6 text-[#00f0ff]" />;
      case 'youtube':
        return <Youtube className="w-6 h-6 text-red-400" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-6 h-6 text-cyan-400" />;
      case 'messagesquare':
      case 'discord':
        return <MessageSquare className="w-6 h-6 text-indigo-400" />;
      case 'send':
      case 'telegram':
        return <Send className="w-6 h-6 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6 text-blue-500" />;
      case 'mail':
      case 'email':
        return <Mail className="w-6 h-6 text-teal-400" />;
      case 'instagram':
        return <Instagram className="w-6 h-6 text-pink-400" />;
      case 'facebook':
        return <Facebook className="w-6 h-6 text-blue-600" />;
      default:
        return <Globe className="w-6 h-6 text-[#00f0ff]" />;
    }
  };

  return (
    <section id="socials" className="py-24 relative z-10 border-t border-slate-900/60 bg-[#040711]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081229] border border-[#00f0ff]/25 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-4">
            <Share2 className="w-3.5 h-3.5" />
            <span>Connect & Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Official Social & Community Channels
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Follow my latest project updates, open source release notes, and community channels.
          </p>
        </div>

        {/* Social Cards Grid / Empty State */}
        {socials.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800 max-w-md mx-auto">
            <Share2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1 font-display">No Social Links Configured</h3>
            <p className="text-xs text-slate-400">
              Add your official social media profiles in the Admin Control Panel to display them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between group relative overflow-hidden border border-[#00f0ff]/15"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f0ff]/5 rounded-full blur-2xl group-hover:bg-[#00f0ff]/15 transition-all pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#081126] border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-[#00f0ff]/40 transition-all duration-300 shadow-electric">
                    {renderIcon(social.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors font-display">
                      {social.platform}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {social.handle}
                    </p>
                    {social.followerCount && (
                      <div className="text-[11px] text-cyan-300/80 font-medium mt-1">
                        {social.followerCount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 group-hover:text-[#00f0ff] group-hover:border-[#00f0ff]/40 transition-all shrink-0">
                  <ArrowUpRightIcon className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
