import React, { useEffect, useRef, useState } from 'react';
import { LightningCanvas } from './components/LightningCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SocialsSection } from './components/SocialsSection';
import { ResourceLibrary } from './components/ResourceLibrary';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { CommunityModal } from './components/CommunityModal';
import { fetchProfile, fetchSocials, fetchCategories, fetchCommunityPopup } from './services/api';
import { Profile, SocialLink, ResourceCategory, CommunityPopupConfig, User } from './types';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [communityConfig, setCommunityConfig] = useState<CommunityPopupConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Community Welcome Popup open state
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  // Visitor authentication state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aetheris_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal open states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>('download resources');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [backNotice, setBackNotice] = useState(false);
  const lastBackPressRef = useRef(0);

  const initData = async () => {
    try {
      const [profData, socData, catData, commData] = await Promise.all([
        fetchProfile(),
        fetchSocials(),
        fetchCategories(),
        fetchCommunityPopup()
      ]);
      setProfile(profData);
      setSocials(socData);
      setCategories(catData);
      setCommunityConfig(commData);

      // Trigger Welcome Community Popup on entrance if enabled
      if (commData && commData.enabled) {
        setCommunityModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // Prevent an accidental single Back press from immediately leaving the website.
  // First press shows a brief hint; a second press within 2.5 seconds exits normally.
  useEffect(() => {
    window.history.pushState({ aetherisBackGuard: true }, '', window.location.href);

    const handlePopState = () => {
      const now = Date.now();
      if (now - lastBackPressRef.current <= 2500) {
        lastBackPressRef.current = 0;
        setBackNotice(false);
        return;
      }

      lastBackPressRef.current = now;
      setBackNotice(true);
      window.history.pushState({ aetherisBackGuard: true }, '', window.location.href);
      window.setTimeout(() => setBackNotice(false), 2200);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUserAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('aetheris_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aetheris_user');
  };

  const handleRequireAuth = (actionName: string) => {
    setPendingAction(actionName);
    setAuthModalOpen(true);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#040711] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#081229] border border-[#00f0ff]/50 flex items-center justify-center animate-spin shadow-electric">
            <span className="text-[#00f0ff] font-extrabold text-xl font-display">⚡</span>
          </div>
          <p className="text-sm font-mono text-cyan-300 tracking-wider uppercase">
            Loading Website Systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#040711] text-slate-100 overflow-x-hidden">
      {backNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-xl border border-cyan-400/40 bg-[#081229]/95 px-5 py-3 text-sm font-semibold text-cyan-100 shadow-electric backdrop-blur-md">
          ওয়েবসাইট থেকে বের হতে আবার Back চাপুন
        </div>
      )}

      {/* Background Canvas */}
      <LightningCanvas />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Header Navigation Bar */}
      <Navbar
        profile={profile}
        user={user}
        onOpenAuth={() => { setPendingAction('access your account'); setAuthModalOpen(true); }}
        onLogout={handleLogout}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Sections */}
      <main className="relative z-10">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SocialsSection socials={socials} />
        <ResourceLibrary
          categories={categories}
          user={user}
          onRequireAuth={handleRequireAuth}
        />
        <ContactSection />
      </main>

      {/* Footer with Admin Access Button */}
      <Footer
        profile={profile}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 1st Visit Welcome Community Popup (Telegram & WhatsApp) */}
      {communityConfig && (
        <CommunityModal
          isOpen={communityModalOpen}
          onClose={() => setCommunityModalOpen(false)}
          config={communityConfig}
        />
      )}

      {/* Visitor Sign Up / Sign In Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleUserAuthSuccess}
        pendingActionName={pendingAction}
      />

      {/* Admin Panel Controls */}
      <AdminPanel
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        profile={profile}
        onProfileUpdated={initData}
      />
    </div>
  );
}
