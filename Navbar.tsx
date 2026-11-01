import React, { useState, useEffect } from 'react';
import { Download, Menu, X, Zap, User as UserIcon, LogOut, ShieldCheck, LogIn } from 'lucide-react';
import { Profile, User } from '../types';

interface NavbarProps {
  profile: Profile;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  user,
  onOpenAuth,
  onLogout,
  onOpenAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'about', 'socials', 'resources', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Socials', href: '#socials', id: 'socials' },
    { label: 'Resources', href: '#resources', id: 'resources' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#040711]/90 backdrop-blur-md border-b border-[#00f0ff]/15 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand wordmark or custom header logo image */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          {profile.headerLogoUrl ? (
            <img
              src={profile.headerLogoUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#00f0ff]/50 shadow-electric group-hover:scale-105 transition-transform shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-blue-700 p-0.5 flex items-center justify-center shadow-electric group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#040711] rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#00f0ff]" />
              </div>
            </div>
          )}
          <span>
            {profile.name} <span className="text-[#00f0ff] text-xs font-mono tracking-widest uppercase ml-1 opacity-80">/ OFFICIAL</span>
          </span>
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors duration-200 whitespace-nowrap shrink-0 relative py-1 ${
                  isActive
                    ? 'text-[#00f0ff] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f0ff] to-cyan-400 rounded-full shadow-electric" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: User Auth & Action Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          
          {user ? (
            <div className="flex items-center gap-2 bg-[#081229] border border-[#00f0ff]/30 rounded-xl px-3 py-1.5">
              <UserIcon className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-xs font-semibold text-white max-w-[120px] truncate">{user.name}</span>
              <button
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-red-400 ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-[#091227] hover:bg-[#112046] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#00f0ff]" />
              Sign In
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-300 hover:text-[#00f0ff] bg-[#091227] hover:bg-[#112046] border border-slate-800 rounded-xl transition-all"
            title="Open Admin Control Panel"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
          </button>

          <a
            href="#resources"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#040711] bg-[#00f0ff] rounded-lg hover:bg-cyan-300 transition-all shadow-electric flex items-center gap-1.5 font-display"
          >
            <Download className="w-3.5 h-3.5" />
            Library
          </a>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-[#00f0ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff] rounded-lg border border-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b19]/95 backdrop-blur-xl border-b border-[#00f0ff]/20 px-4 pt-4 pb-6 space-y-3 mt-2 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30'
                    : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg text-xs">
                <span className="text-white font-semibold">Signed in as: {user.name}</span>
                <button onClick={onLogout} className="text-red-400 font-bold">Sign Out</button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 text-xs font-semibold text-[#00f0ff] bg-slate-900 border border-[#00f0ff]/30 rounded-lg"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="w-full py-2.5 text-xs font-semibold text-cyan-300 bg-[#081229] border border-cyan-800 rounded-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Control Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
