import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, AlertTriangle, MessageSquare, ShieldCheck, Clock, UserCheck, PhoneCall } from 'lucide-react';
import { submitContact, fetchContactConfig } from '../services/api';
import { ContactConfig } from '../types';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [contactConfig, setContactConfig] = useState<ContactConfig>({
    phoneNumber: '+8801700000000',
    enablePhoneCall: true,
    email: 'mdramjanislam9220@gmail.com',
    address: 'Dhaka, Bangladesh',
    callToAction: 'Call Directly for Urgent Inquiries'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    message: string;
    ticketId?: string;
  } | null>(null);

  useEffect(() => {
    async function loadConfig() {
      const cfg = await fetchContactConfig();
      setContactConfig(cfg);
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }

    setLoading(true);
    const res = await submitContact(formData);
    setLoading(false);

    if (res.success) {
      setSuccessResult({
        message: res.message,
        ticketId: res.ticketId
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setError(res.message);
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10 border-t border-slate-900/60 bg-[#040711]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081229] border border-[#00f0ff]/25 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Transmission & Support</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Get in Touch
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Have a project inquiry, technical collaboration proposal, or feedback regarding a published app? Transmit your message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-[#00f0ff]/20 space-y-6">
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00f0ff]" />
              Transmission Guidelines
            </h3>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Messages submitted through this endpoint are routed directly to RAMJAN AHMED. Response times generally range between 12 to 24 hours.
            </p>

            {/* Click-To-Call Button */}
            {contactConfig.enablePhoneCall && contactConfig.phoneNumber && (
              <div className="p-4 rounded-xl bg-[#081229] border border-[#00f0ff]/40 space-y-2">
                <div className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#00f0ff]" />
                  <span>{contactConfig.callToAction || 'Direct Phone Call'}</span>
                </div>
                <p className="text-xs text-slate-300">Tap below to initiate a phone call directly:</p>
                <a
                  href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-lg transition-all shadow-electric flex items-center justify-center gap-2 font-display"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call {contactConfig.phoneNumber}
                </a>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Response Latency</h4>
                  <p className="text-xs text-slate-400">Average response within 1 business day</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Encrypted Transmission</h4>
                  <p className="text-xs text-slate-400">All submissions are processed securely on backend servers</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <UserCheck className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Technical Advisory</h4>
                  <p className="text-xs text-slate-400">Available for web development & full-stack API consulting</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#081229] border border-[#00f0ff]/20 text-xs font-mono text-cyan-300 truncate">
              Direct Email: {contactConfig.email}
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-[#00f0ff]/20">
            
            {successResult ? (
              <div className="p-8 text-center bg-[#091b38]/80 border border-[#00f0ff]/50 rounded-xl space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#00f0ff] mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-white font-display">Transmission Received</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {successResult.message}
                </p>
                {successResult.ticketId && (
                  <div className="inline-block px-4 py-2 rounded-lg bg-[#040711] border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
                    Reference Ticket ID: <span className="font-bold">{successResult.ticketId}</span>
                  </div>
                )}
                <div className="pt-4">
                  <button
                    onClick={() => setSuccessResult(null)}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-lg transition-all font-display"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {error && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                      Your Full Name <span className="text-[#00f0ff]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                      Email Address <span className="text-[#00f0ff]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack Web Collaboration Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-2">
                    Message Content <span className="text-[#00f0ff]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Type your transmission details here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-100 text-sm focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-xl transition-all duration-200 shadow-electric hover:shadow-electric-lg flex items-center justify-center gap-2 font-display disabled:opacity-50"
                >
                  {loading ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Transmit Message
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
