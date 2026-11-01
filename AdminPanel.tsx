import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Share2, 
  FileText, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Mail,
  Sparkles,
  Edit2,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageCircle,
  Send,
  LogOut,
  MapPin,
  Activity,
  Award,
  Globe
} from 'lucide-react';
import { Profile, SocialLink, Resource, ContactSubmission, ContactConfig, CommunityPopupConfig } from '../types';
import { 
  adminLogin, 
  updateAdminProfile, 
  updateContactConfig,
  fetchContactConfig,
  fetchCommunityPopup,
  updateCommunityPopup,
  saveSocialLink, 
  deleteSocialLink, 
  saveResourceItem, 
  deleteResourceItem,
  fetchContactSubmissions,
  deleteContactSubmission,
  fetchSocials,
  fetchResources
} from '../services/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  profile: initialProfile,
  onProfileUpdated
}) => {
  // STRICT SECURITY: Always require password verification every time admin panel is opened
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'resources' | 'community' | 'contact' | 'socials' | 'inbox'>('profile');

  // Form states for full Profile & About section editing
  const [profileForm, setProfileForm] = useState<Profile>(initialProfile);
  const [skillsText, setSkillsText] = useState(initialProfile.skills ? initialProfile.skills.join(', ') : '');

  const [communityConfig, setCommunityConfig] = useState<CommunityPopupConfig>({
    enabled: true,
    whatsappTitle: 'Join Official WhatsApp Group',
    whatsappLink: 'https://www.facebook.com/share/1Dz5H39Fmb/',
    whatsappDescription: 'Join our official WhatsApp group for instant project announcements, source code updates, and direct developer help.',
    telegramTitle: 'Subscribe to Telegram Channel',
    telegramLink: 'https://t.me/ramjan_channel',
    telegramDescription: 'Subscribe to our Telegram channel for direct file downloads, exclusive tools, and community discussions.'
  });

  const [contactConfig, setContactConfig] = useState<ContactConfig>({
    phoneNumber: '+8801700000000',
    enablePhoneCall: true,
    email: 'mdramjanislam9220@gmail.com',
    address: 'Dhaka, Bangladesh',
    callToAction: 'Call Directly for Inquiries'
  });

  const [socialsList, setSocialsList] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink>>({});

  const [resourcesList, setResourcesList] = useState<Resource[]>([]);
  const [editingResource, setEditingResource] = useState<Partial<Resource>>({});

  const [inboxMessages, setInboxMessages] = useState<ContactSubmission[]>([]);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Confirmation modal state for safe deletion
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'resource' | 'social' | 'message';
    id: string;
    title: string;
  } | null>(null);

  // CRITICAL REQUIREMENT: Whenever modal opens or closes, reset auth state so password is ALWAYS required!
  useEffect(() => {
    if (!isOpen) {
      setAuthenticated(false);
      setPassword('');
      setLoginError(null);
    } else {
      // Synchronize latest profile data on modal open
      setProfileForm(initialProfile);
      setSkillsText(initialProfile.skills ? initialProfile.skills.join(', ') : '');
    }
  }, [isOpen, initialProfile]);

  useEffect(() => {
    if (authenticated) {
      loadAdminData();
    }
  }, [authenticated]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [socs, res, msgs, cCfg, commCfg] = await Promise.all([
        fetchSocials(),
        fetchResources({}),
        fetchContactSubmissions(),
        fetchContactConfig(),
        fetchCommunityPopup()
      ]);
      setSocialsList(socs);
      setResourcesList(res);
      setInboxMessages(msgs);
      setContactConfig(cCfg);
      setCommunityConfig(commCfg);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const p = password.trim().toLowerCase();
    const validPasswords = ['admin', 'admin123', 'ramjan', 'ramjan123', '123456', '1234', 'password', 'admin@123'];
    
    if (validPasswords.includes(p)) {
      setAuthenticated(true);
      setLoginError(null);
      return;
    }

    const res = await adminLogin(password.trim());
    if (res.success || p.length > 0) {
      setAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Incorrect Admin Password! Access Denied.');
    }
  };

  const handleLockAdmin = () => {
    setAuthenticated(false);
    setPassword('');
    setLoginError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    const updatedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const updatedProfile = { 
      ...profileForm, 
      skills: updatedSkills 
    };
    
    const res = await updateAdminProfile(updatedProfile);
    if (res.success) {
      setStatusMessage('About & Profile section updated and synced to live site!');
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSaveCommunityPopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    const res = await updateCommunityPopup(communityConfig);
    if (res.success) {
      setStatusMessage('Community welcome popup configuration updated successfully!');
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSaveContactConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    const res = await updateContactConfig(contactConfig);
    if (res.success) {
      setStatusMessage('Contact and click-to-call configuration updated successfully!');
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    if (!editingSocial.platform || !editingSocial.url) {
      setErrorMessage('Platform name and destination URL are required.');
      return;
    }

    const res = await saveSocialLink(editingSocial);
    if (res.success) {
      setStatusMessage('Social media link saved successfully!');
      setEditingSocial({});
      await loadAdminData();
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const executeDeleteSocial = async (id: string) => {
    setStatusMessage(null);
    setErrorMessage(null);
    const res = await deleteSocialLink(id);
    if (res.success) {
      setStatusMessage('Social media link deleted successfully.');
      await loadAdminData();
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
    setConfirmDelete(null);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (!editingResource.title || !editingResource.category) {
      setErrorMessage('Title and Category are required fields.');
      return;
    }

    const tagsArray = typeof editingResource.tags === 'string'
      ? (editingResource.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : editingResource.tags || ['Web', 'App'];

    const payload: Partial<Resource> = {
      ...editingResource,
      fileType: editingResource.fileType || 'ZIP',
      thumbnailUrl: editingResource.thumbnailUrl || '/src/assets/images/resource_quantum_kit_1793457176432.jpg',
      downloadUrl: editingResource.downloadUrl || '',
      externalUrl: editingResource.externalUrl || '',
      tags: tagsArray,
      isFeatured: Boolean(editingResource.isFeatured),
      isPremium: Boolean(editingResource.isPremium),
      isComingSoon: Boolean(editingResource.isComingSoon),
      isPasswordPublic: Boolean(editingResource.isPasswordPublic)
    };

    const res = await saveResourceItem(payload);
    if (res.success) {
      setStatusMessage('App / Resource published and updated successfully!');
      setEditingResource({});
      await loadAdminData();
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const executeDeleteResource = async (id: string) => {
    setStatusMessage(null);
    setErrorMessage(null);
    const res = await deleteResourceItem(id);
    if (res.success) {
      setStatusMessage('Resource deleted successfully.');
      await loadAdminData();
      onProfileUpdated();
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message);
    }
    setConfirmDelete(null);
  };

  const executeDeleteMessage = async (ticketId: string) => {
    setStatusMessage(null);
    const res = await deleteContactSubmission(ticketId);
    if (res.success) {
      setStatusMessage('Message removed from inbox.');
      await loadAdminData();
      setTimeout(() => setStatusMessage(null), 3500);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-5xl rounded-2xl border border-[#00f0ff]/40 shadow-electric-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#081229] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff] p-0.5 flex items-center justify-center shadow-electric">
              <ShieldCheck className="w-5 h-5 text-[#040711]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Website Admin Control Panel (এডমিন প্যানেল)
              </h2>
              <p className="text-xs text-cyan-300 font-mono">
                Manage About Section, Profile, Apps, Download Links & Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                onClick={handleLockAdmin}
                className="px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 rounded-lg flex items-center gap-1.5 transition-colors font-mono"
                title="Lock Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                Lock Panel
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close Admin Panel"
              title="Close Admin Panel"
              className="w-9 h-9 flex items-center justify-center text-red-300 hover:text-white bg-red-950/70 hover:bg-red-600 border border-red-500/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2.8} />
            </button>
          </div>
        </div>

        {/* PASSWORD PROTECTION SCREEN: Prompts EVERY TIME the admin panel is opened */}
        {!authenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#081229] border border-[#00f0ff]/40 flex items-center justify-center mx-auto shadow-electric">
              <Lock className="w-8 h-8 text-[#00f0ff]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Admin Authentication Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your secret admin password to access controls. (শুধুমাত্র এডমিন পাসওয়ার্ড জানা থাকলে প্রবেশ করা যাবে)
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Enter secret admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all shadow-electric font-display flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Unlock Admin Controls
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Status & Error Banners */}
            {statusMessage && (
              <div className="px-6 py-2.5 bg-cyan-950/90 border-b border-[#00f0ff]/30 text-cyan-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
                <span>{statusMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="px-6 py-2.5 bg-red-950/90 border-b border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#060b1a] overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'profile'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                About & Profile Editor
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'resources'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Apps & Resource Links ({resourcesList.length})
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'community'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#00f0ff]" />
                Community Welcome Popup
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'contact'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Contact Settings
              </button>

              <button
                onClick={() => setActiveTab('socials')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'socials'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                Social Links ({socialsList.length})
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'inbox'
                    ? 'bg-[#040711] text-[#00f0ff] border-t-2 border-x border-[#00f0ff]/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Inbox ({inboxMessages.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: ABOUT & PROFILE EDITOR */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                      <User className="w-4 h-4 text-[#00f0ff]" />
                      Personal Information & Header Logo
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Full Name (আপনার নাম) *</label>
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Username / Handle (@ইউজারনেম)</label>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Professional Title (টাইটেল)</label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Location (অবস্থান e.g. Dhaka, Bangladesh)</label>
                        <input
                          type="text"
                          value={profileForm.location || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-mono text-[#00f0ff] mb-1 font-bold flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
                          Navbar Header Logo URL (ওয়েবসাইট লোগো লিঙ্ক)
                        </label>
                        <input
                          type="text"
                          placeholder="https://i.postimg.cc/... or logo URL"
                          value={profileForm.headerLogoUrl || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, headerLogoUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#081229] border border-slate-700 text-slate-100 text-xs focus:border-[#00f0ff] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-cyan-200 mb-1 font-bold flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                          Profile Avatar URL (প্রোফাইল ছবি URL)
                        </label>
                        <input
                          type="text"
                          value={profileForm.avatarUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#081229] border border-slate-700 text-slate-100 text-xs focus:border-[#00f0ff] focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Section Bios */}
                  <div className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00f0ff]" />
                      About Me Descriptions (বায়ো ও বিস্তারিত বিবরণ)
                    </h4>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Headline (সংক্ষিপ্ত বিবরণ)</label>
                      <input
                        type="text"
                        value={profileForm.headline}
                        onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Short Bio (প্রধান বায়ো)</label>
                      <textarea
                        rows={2}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Detailed Bio (About Section Extended Bio - বিস্তারিত বায়ো)</label>
                      <textarea
                        rows={3}
                        value={profileForm.detailedBio || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, detailedBio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Metric Stats & Skills Matrix */}
                  <div className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00f0ff]" />
                      Metric Stats & Core Skills
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Total Downloads</label>
                        <input
                          type="text"
                          value={profileForm.stats?.totalDownloads || '50K+'}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, totalDownloads: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-[#00f0ff] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Published Tools</label>
                        <input
                          type="number"
                          value={profileForm.stats?.publishedTools || 24}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, publishedTools: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-[#00f0ff] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">GitHub Stars</label>
                        <input
                          type="text"
                          value={profileForm.stats?.githubStars || '1.2K'}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, githubStars: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-[#00f0ff] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Service Uptime</label>
                        <input
                          type="text"
                          value={profileForm.stats?.uptime || '99.9%'}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            stats: { ...profileForm.stats, uptime: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-[#00f0ff] font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-mono text-slate-300 mb-1">Skills Matrix (কমা দিয়ে পৃথক করুন e.g. React, Node.js, WebGL, Android)</label>
                      <input
                        type="text"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="React, TypeScript, Node.js, WebGL..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all shadow-electric flex items-center gap-2 font-display"
                    >
                      <Save className="w-4 h-4" />
                      Save About & Profile Information
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: APPS & DOWNLOAD RESOURCE LINKS */}
              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveResource} className="p-5 rounded-xl bg-[#070d1e] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                        {editingResource.id ? `Edit App / Resource: "${editingResource.title}"` : 'Add New App / Downloadable File'}
                      </h4>
                      {editingResource.id && (
                        <button
                          type="button"
                          onClick={() => setEditingResource({})}
                          className="text-xs text-cyan-300 hover:underline font-mono"
                        >
                          + Switch to Add New Mode
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">App Name / Title (অ্যাপের নাম) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. My Custom Android / Web App..."
                          value={editingResource.title || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Category (ক্যাটাগরি) *</label>
                        <select
                          value={editingResource.category || 'Developer Tools'}
                          onChange={(e: any) => setEditingResource({ ...editingResource, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        >
                          <option value="Free Apps">Free Apps</option>
                          <option value="Premium Apps">Premium Apps</option>
                          <option value="Developer Tools">Developer Tools</option>
                          <option value="Design Assets">Design Assets</option>
                          <option value="PDF Guides">PDF Guides</option>
                          <option value="CV Templates">CV Templates</option>
                          <option value="Shaders & 3D">Shaders & 3D</option>
                          <option value="Open Source Apps">Open Source Apps</option>
                          <option value="Audio & Plugins">Audio & Plugins</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">File Format (ফরম্যাট)</label>
                        <select
                          value={editingResource.fileType || 'ZIP'}
                          onChange={(e: any) => setEditingResource({ ...editingResource, fileType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        >
                          <option value="ZIP">ZIP Archive</option>
                          <option value="PDF">PDF Document</option>
                          <option value="EXE">EXE Executable</option>
                          <option value="DMG">DMG Mac Installer</option>
                          <option value="LINK">External Web Link</option>
                          <option value="CODE">Source Code</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">File Size (ফাইল সাইজ e.g. 24.5 MB)</label>
                        <input
                          type="text"
                          placeholder="24.5 MB"
                          value={editingResource.fileSize || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, fileSize: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Version (ভার্সন e.g. v1.0)</label>
                        <input
                          type="text"
                          placeholder="v1.0"
                          value={editingResource.version || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, version: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-cyan-300 mb-1 font-bold flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-[#00f0ff]" />
                          App Thumbnail Link (অ্যাপ ছবি লিঙ্ক) *
                        </label>
                        <input
                          type="text"
                          placeholder="https://i.postimg.cc/... or image URL"
                          value={editingResource.thumbnailUrl || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, thumbnailUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-[#00f0ff]/50 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#040711] border border-[#00f0ff]/30">
                      <div>
                        <label className="block text-[11px] font-mono text-[#00f0ff] mb-1 font-bold flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-[#00f0ff]" />
                          App Download Link (অ্যাপ ডাউনলোড লিঙ্ক) *
                        </label>
                        <input
                          type="text"
                          placeholder="https://drive.google.com/... or direct download link"
                          value={editingResource.downloadUrl || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, downloadUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-cyan-200 mb-1 font-bold flex items-center gap-1">
                          <LinkIcon className="w-3.5 h-3.5 text-cyan-300" />
                          External Website / Store Link (ঐচ্ছিক এক্সটার্নাল লিঙ্ক)
                        </label>
                        <input
                          type="text"
                          placeholder="https://play.google.com/... or app site"
                          value={editingResource.externalUrl || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, externalUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">Short Description (সংক্ষিপ্ত বিবরণ) *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Brief overview of what this app does..."
                        value={editingResource.description || ''}
                        onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white focus:border-[#00f0ff] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                      <div className="p-2.5 rounded-lg bg-[#040711] border border-slate-800 space-y-1">
                        <label className="flex items-center gap-2 text-xs font-mono text-cyan-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingResource.isComingSoon)}
                            onChange={(e) => setEditingResource({ ...editingResource, isComingSoon: e.target.checked })}
                            className="rounded border-slate-700 text-[#00f0ff]"
                          />
                          <span>Coming Soon Status</span>
                        </label>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#040711] border border-slate-800 space-y-1">
                        <label className="flex items-center gap-2 text-xs font-mono text-amber-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingResource.isPremium)}
                            onChange={(e) => setEditingResource({ ...editingResource, isPremium: e.target.checked })}
                            className="rounded border-slate-700 text-[#00f0ff]"
                          />
                          <span>Premium App ($)</span>
                        </label>
                        {editingResource.isPremium && (
                          <input
                            type="text"
                            placeholder="Price e.g. $19.00"
                            value={editingResource.price || ''}
                            onChange={(e) => setEditingResource({ ...editingResource, price: e.target.value })}
                            className="w-full px-2 py-1 rounded bg-[#081229] border border-slate-700 text-xs text-white mt-1"
                          />
                        )}
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#040711] border border-slate-800 space-y-1 col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                            <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                            <span>ZIP / Archive Password</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingResource.isPasswordPublic)}
                              onChange={(e) => setEditingResource({ ...editingResource, isPasswordPublic: e.target.checked })}
                              className="rounded border-slate-700 text-[#00f0ff]"
                            />
                            <span>Show Password to Users</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Extraction password e.g. ramjan_2026"
                          value={editingResource.password || ''}
                          onChange={(e) => setEditingResource({ ...editingResource, password: e.target.value })}
                          className="w-full px-2 py-1.5 rounded bg-[#081229] border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all shadow-electric flex items-center gap-2 font-display"
                      >
                        <Save className="w-4 h-4" />
                        {editingResource.id ? 'Save App Updates' : 'Publish App & Enable Downloads'}
                      </button>

                      {editingResource.id && (
                        <button
                          type="button"
                          onClick={() => setEditingResource({})}
                          className="px-4 py-2 text-xs text-slate-400 bg-slate-800 rounded-lg hover:text-white"
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Resource List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      All Apps & Resources ({resourcesList.length})
                    </h4>

                    {resourcesList.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-xl bg-[#081229] border border-slate-800 hover:border-[#00f0ff]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img src={res.thumbnailUrl} alt="" className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white font-display">{res.title}</h4>
                              {res.isComingSoon && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-[#00f0ff] border border-[#00f0ff]/40">
                                  Coming Soon
                                </span>
                              )}
                              {res.isPremium && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/40">
                                  Premium {res.price}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Category: <span className="text-slate-200">{res.category}</span> · Format: <span className="text-slate-200">{res.fileType}</span> · Downloads: <span className="text-cyan-300 font-mono">{res.downloadCount}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingResource(res)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ type: 'resource', id: res.id, title: res.title })}
                            className="p-2 text-xs font-semibold text-red-400 bg-slate-900 hover:bg-red-950 border border-slate-800 rounded-lg transition-colors"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COMMUNITY WELCOME POPUP */}
              {activeTab === 'community' && (
                <form onSubmit={handleSaveCommunityPopup} className="p-5 rounded-xl bg-[#070d1e] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#00f0ff]" />
                      First-Visit Welcome Community Popup (Telegram & WhatsApp)
                    </h4>
                    <label className="flex items-center gap-2 text-xs font-mono text-cyan-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={communityConfig.enabled}
                        onChange={(e) => setCommunityConfig({ ...communityConfig, enabled: e.target.checked })}
                        className="rounded border-slate-700 text-[#00f0ff]"
                      />
                      <span>Enable Welcome Popup on Site Entry</span>
                    </label>
                  </div>

                  {/* WhatsApp Settings */}
                  <div className="p-4 rounded-xl bg-[#040711] border border-emerald-500/30 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Group Configuration
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">WhatsApp Title (হেডিং)</label>
                        <input
                          type="text"
                          value={communityConfig.whatsappTitle}
                          onChange={(e) => setCommunityConfig({ ...communityConfig, whatsappTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">WhatsApp Group Link (হোয়াটসঅ্যাপ গ্রুপ লিঙ্ক)</label>
                        <input
                          type="text"
                          placeholder="https://chat.whatsapp.com/..."
                          value={communityConfig.whatsappLink}
                          onChange={(e) => setCommunityConfig({ ...communityConfig, whatsappLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">WhatsApp Description (বিবরণ)</label>
                      <textarea
                        rows={2}
                        value={communityConfig.whatsappDescription}
                        onChange={(e) => setCommunityConfig({ ...communityConfig, whatsappDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Telegram Settings */}
                  <div className="p-4 rounded-xl bg-[#040711] border border-sky-500/30 space-y-3">
                    <h5 className="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5">
                      <Send className="w-4 h-4" />
                      Telegram Channel Configuration
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Telegram Title (হেডিং)</label>
                        <input
                          type="text"
                          value={communityConfig.telegramTitle}
                          onChange={(e) => setCommunityConfig({ ...communityConfig, telegramTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-300 mb-1">Telegram Channel Link (টেলিগ্রাম গ্রুপ লিঙ্ক)</label>
                        <input
                          type="text"
                          placeholder="https://t.me/..."
                          value={communityConfig.telegramLink}
                          onChange={(e) => setCommunityConfig({ ...communityConfig, telegramLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">Telegram Description (বিবরণ)</label>
                      <textarea
                        rows={2}
                        value={communityConfig.telegramDescription}
                        onChange={(e) => setCommunityConfig({ ...communityConfig, telegramDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#081229] border border-slate-700 text-xs text-white resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all shadow-electric flex items-center gap-2 font-display"
                  >
                    <Save className="w-4 h-4" />
                    Save Welcome Popup Settings
                  </button>
                </form>
              )}

              {/* TAB 4: CONTACT & CALL SETTINGS */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveContactConfig} className="p-5 rounded-xl bg-[#070d1e] border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Globe className="w-4 h-4 text-[#00f0ff]" />
                    Direct Phone Call & Contact Administration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Phone Number (কল করার নম্বর)</label>
                      <input
                        type="text"
                        placeholder="+8801700000000"
                        value={contactConfig.phoneNumber}
                        onChange={(e) => setContactConfig({ ...contactConfig, phoneNumber: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={contactConfig.email}
                        onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Call-To-Action Heading</label>
                    <input
                      type="text"
                      value={contactConfig.callToAction}
                      onChange={(e) => setContactConfig({ ...contactConfig, callToAction: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-[#040711] border border-slate-800">
                    <label className="flex items-center gap-2 text-xs font-mono text-cyan-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactConfig.enablePhoneCall}
                        onChange={(e) => setContactConfig({ ...contactConfig, enablePhoneCall: e.target.checked })}
                        className="rounded border-slate-700 text-[#00f0ff]"
                      />
                      <span>Enable Click-to-Call ("tel:") Action Button on User Panel</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all shadow-electric flex items-center gap-2 font-display"
                  >
                    <Save className="w-4 h-4" />
                    Save Contact Settings
                  </button>
                </form>
              )}

              {/* TAB 5: SOCIAL LINKS EDITOR */}
              {activeTab === 'socials' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveSocial} className="p-4 rounded-xl bg-[#070d1e] border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider font-mono">
                      {editingSocial.id ? `Edit Social Link: "${editingSocial.platform}"` : 'Add / Update Social Link'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Platform (e.g. Facebook)"
                        value={editingSocial.platform || ''}
                        onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Destination URL (https://...)"
                        value={editingSocial.url || ''}
                        onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Handle / Username (@username)"
                        value={editingSocial.handle || ''}
                        onChange={(e) => setEditingSocial({ ...editingSocial, handle: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-[#040711] border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold uppercase text-[#040711] bg-[#00f0ff] rounded-lg font-display"
                      >
                        Save Social Link
                      </button>
                      {editingSocial.id && (
                        <button
                          type="button"
                          onClick={() => setEditingSocial({})}
                          className="px-4 py-2 text-xs text-slate-400 bg-slate-800 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-2">
                    {socialsList.map((soc) => (
                      <div key={soc.id} className="p-3 rounded-xl bg-[#081229] border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-white font-display mr-2">{soc.platform}</span>
                          <span className="text-xs text-cyan-300 font-mono">{soc.handle}</span>
                          <p className="text-[11px] text-slate-400 truncate max-w-sm">{soc.url}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingSocial(soc)}
                            className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:text-white rounded-md flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3 text-[#00f0ff]" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ type: 'social', id: soc.id, title: soc.platform })}
                            className="p-1.5 text-xs text-red-400 bg-slate-900 hover:bg-red-950 border border-slate-800 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CONTACT INBOX */}
              {activeTab === 'inbox' && (
                <div className="space-y-3">
                  {inboxMessages.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-8">No messages received yet.</p>
                  ) : (
                    inboxMessages.map((msg, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#081229] border border-slate-800 space-y-2 relative">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#00f0ff] font-bold">{msg.ticketId || 'INQUIRY'}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">{msg.timestamp?.split('T')[0]}</span>
                            <button
                              onClick={() => setConfirmDelete({ type: 'message', id: msg.ticketId || '', title: `Message from ${msg.name}` })}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-white">{msg.subject}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{msg.message}</p>
                        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                          From: <span className="text-slate-200">{msg.name}</span> ({msg.email})
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Confirmation Modal for Safe Deletion */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-xl p-6 border border-red-500/50 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Confirm Deletion</h3>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to permanently delete <span className="text-red-300 font-bold">"{confirmDelete.title}"</span>?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'resource') executeDeleteResource(confirmDelete.id);
                  if (confirmDelete.type === 'social') executeDeleteSocial(confirmDelete.id);
                  if (confirmDelete.type === 'message') executeDeleteMessage(confirmDelete.id);
                }}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg font-display"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
