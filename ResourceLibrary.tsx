import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  FileText, 
  Box, 
  Sparkles, 
  CheckCircle, 
  SlidersHorizontal,
  FileCode,
  Layers,
  ArrowUpDown,
  X,
  AlertCircle,
  Lock,
  Key,
  Copy,
  Clock,
  DollarSign
} from 'lucide-react';
import { Resource, ResourceCategory, User } from '../types';
import { fetchResources, getDownloadUrl } from '../services/api';

interface ResourceLibraryProps {
  categories: ResourceCategory[];
  user: User | null;
  onRequireAuth: (pendingAction: string) => void;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ categories, user, onRequireAuth }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'downloads' | 'alphabetical'>('newest');
  
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPasswordId, setCopiedPasswordId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchResources({
      search: searchQuery,
      category: selectedCategory,
      sort: sortOption
    });
    setResources(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, sortOption]);

  const handleCopyPassword = (resourceId: string, passwordStr: string) => {
    navigator.clipboard.writeText(passwordStr);
    setCopiedPasswordId(resourceId);
    setToastMessage(`Archive password "${passwordStr}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedPasswordId(null);
      setToastMessage(null);
    }, 3000);
  };

  const handleDownload = async (resource: Resource) => {
    if (resource.isComingSoon) {
      setToastMessage(`"${resource.title}" is coming soon! Stay tuned.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (!user) {
      onRequireAuth(`download "${resource.title}"`);
      return;
    }

    setDownloadingId(resource.id);

    try {
      const targetUrl = resource.downloadUrl || resource.externalUrl;

      if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
        // Direct download link or external URL provided by Admin
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        setToastMessage(`Redirecting to download link for "${resource.title}"...`);
      } else {
        // Default server download file stream
        const url = getDownloadUrl(resource.id);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setToastMessage(`Downloading "${resource.title}"... Check your downloads folder.`);
      }

      setResources(prev => 
        prev.map(r => r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r)
      );

      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setToastMessage('Download request failed. Please check network connection.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  return (
    <section id="resources" className="py-24 relative z-10 border-t border-slate-900/60 bg-[#040711]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081229] border border-[#00f0ff]/25 text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-4">
            <Box className="w-3.5 h-3.5" />
            <span>Digital Assets & Applications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Public Resource & App Library
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Access developer toolkits, premium apps, CV templates, WebGL shaders, and security manuals.
          </p>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-[#00f0ff]/20 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tools, apps, CV templates, ZIP files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#070d1e] border border-slate-800 focus:border-[#00f0ff] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-[#00f0ff]" />
                <span>Sort By:</span>
              </div>
              <select
                value={sortOption}
                onChange={(e: any) => setSortOption(e.target.value)}
                className="py-3 px-4 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-200 text-sm focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="newest">Newest Releases</option>
                <option value="downloads">Most Downloaded</option>
                <option value="alphabetical">Title A-Z</option>
                <option value="oldest">Oldest Releases</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
              Filter:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                    active
                      ? 'bg-[#00f0ff] text-[#040711] font-bold shadow-electric'
                      : 'bg-[#091227] text-slate-300 hover:bg-[#101f44] border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Downloading Feedback Toast Banner */}
        {toastMessage && (
          <div className="mb-8 p-4 rounded-xl bg-[#091833] border border-[#00f0ff]/50 text-cyan-200 text-sm flex items-center justify-between shadow-electric animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#00f0ff] shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Resources Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-panel rounded-2xl h-80 animate-pulse p-6 border border-slate-800" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-display">No Resources Found</h3>
            <p className="text-sm text-slate-400 mb-6">
              No published files match your search query "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] rounded-lg font-display"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="glass-panel glass-panel-hover rounded-2xl flex flex-col justify-between overflow-hidden border border-[#00f0ff]/15 group"
              >
                {/* Thumbnail Image Header */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status & File Type Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <div className="px-2.5 py-1 rounded-md bg-[#040711]/80 backdrop-blur-md border border-[#00f0ff]/30 text-[11px] font-mono font-bold text-[#00f0ff]">
                      {resource.fileType}
                    </div>
                    {resource.isComingSoon && (
                      <div className="px-2.5 py-1 rounded-md bg-cyan-950/90 border border-[#00f0ff]/50 text-[10px] font-mono font-bold text-[#00f0ff]">
                        Coming Soon
                      </div>
                    )}
                    {resource.isPremium && (
                      <div className="px-2.5 py-1 rounded-md bg-amber-950/90 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300">
                        Premium {resource.price || ''}
                      </div>
                    )}
                  </div>

                  {resource.version && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-300">
                      {resource.version}
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                      <span>{resource.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{resource.publishedDate}</span>
                      {resource.fileSize && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{resource.fileSize}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors font-display">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {resource.description}
                    </p>

                    {/* ZIP Password Display Card */}
                    {resource.password && resource.isPasswordPublic && (
                      <div className="mb-4 p-2.5 rounded-lg bg-[#081229] border border-[#00f0ff]/30 flex items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <Key className="w-3.5 h-3.5 text-[#00f0ff]" />
                          <span>ZIP Password: <strong className="text-white font-bold">{resource.password}</strong></span>
                        </div>
                        <button
                          onClick={() => handleCopyPassword(resource.id, resource.password || '')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 text-[11px] transition-colors"
                          title="Copy Password"
                        >
                          <Copy className="w-3 h-3 text-[#00f0ff]" />
                          {copiedPasswordId === resource.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {resource.tags && resource.tags.map((tag, i) => (
                      <span key={i} className="text-[11px] text-slate-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Action Bar */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {resource.downloadCount.toLocaleString()} Downloads
                    </span>

                    <button
                      onClick={() => handleDownload(resource)}
                      disabled={downloadingId === resource.id || resource.isComingSoon}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#040711] bg-[#00f0ff] hover:bg-cyan-300 rounded-lg transition-all shadow-electric flex items-center gap-2 font-display disabled:opacity-50"
                    >
                      {downloadingId === resource.id ? (
                        <span className="animate-spin text-sm">⚡</span>
                      ) : resource.isComingSoon ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Coming Soon
                        </>
                      ) : !user ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Sign In to Download
                        </>
                      ) : resource.downloadUrl || resource.externalUrl ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Download App
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Download File
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
