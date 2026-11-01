import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { SITE_CONFIG } from './config/siteConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Dynamic Data Store (starts empty for fresh user setup)
let profileData = { ...SITE_CONFIG.profile };
let contactConfigData = { ...SITE_CONFIG.contactConfig };
let communityPopupData = { ...SITE_CONFIG.communityPopup };
let socialLinks: any[] = [];
let resourcesList: any[] = [];
let categoriesList = [ ...SITE_CONFIG.categories ];
let contactSubmissions: any[] = [];
let registeredUsers: any[] = [];
let adminAuthenticated = false;

const ADMIN_PASSWORD = 'admin';

// -------------------------------------------------------------------------
// PUBLIC API ENDPOINTS
// -------------------------------------------------------------------------

// Profile information
app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: profileData });
});

// Community Welcome Popup config
app.get('/api/community-popup', (req, res) => {
  res.json({ success: true, data: communityPopupData });
});

// Contact configuration (phone number, click-to-call, email)
app.get('/api/contact-config', (req, res) => {
  res.json({ success: true, data: contactConfigData });
});

// Social links
app.get('/api/socials', (req, res) => {
  const activeSocials = socialLinks.filter(s => s.enabled);
  res.json({ success: true, data: activeSocials });
});

// Resource Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: categoriesList });
});

// Resources list (search, category, sort)
app.get('/api/resources', (req, res) => {
  const { q, category, sort } = req.query;
  let result = [...resourcesList];

  if (category && category !== 'All') {
    result = result.filter(r => r.category === category);
  }

  if (q && typeof q === 'string' && q.trim() !== '') {
    const searchTerm = q.toLowerCase().trim();
    result = result.filter(r => 
      r.title.toLowerCase().includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm) ||
      (r.tags && r.tags.some((t: string) => t.toLowerCase().includes(searchTerm)))
    );
  }

  if (sort === 'oldest') {
    result.sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
  } else if (sort === 'downloads') {
    result.sort((a, b) => b.downloadCount - a.downloadCount);
  } else if (sort === 'alphabetical') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }

  res.json({ success: true, count: result.length, data: result });
});

// Download endpoint
app.get('/api/resources/:id/download', (req, res) => {
  const resourceIndex = resourcesList.findIndex(r => r.id === req.params.id);
  if (resourceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  resourcesList[resourceIndex].downloadCount += 1;
  const resource = resourcesList[resourceIndex];

  const sampleContent = `=====================================================
DIGITAL RESOURCE ARCHIVE: ${resource.title}
Version: ${resource.version || 'v1.0'}
Publisher: ${profileData.name} (${profileData.username})
Category: ${resource.category}
Extraction Password: ${resource.password || 'None Required'}
=====================================================

DESCRIPTION:
${resource.description}

TAGS: ${resource.tags ? resource.tags.join(', ') : ''}

Thank you for downloading from ${profileData.name}'s Official Web Platform!
`;

  const safeFilename = `${resource.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${resource.version || 'v1.0'}.txt`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  return res.status(200).send(sampleContent);
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in name, email, and message.' });
  }

  const ticketId = `ATH-${Math.floor(100000 + Math.random() * 900000)}`;
  const submission = {
    ticketId,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    timestamp: new Date().toISOString()
  };

  contactSubmissions.unshift(submission);
  res.json({
    success: true,
    message: `Message transmitted! ${profileData.name} will review your inquiry shortly.`,
    ticketId,
    timestamp: submission.timestamp
  });
});

// USER AUTHENTICATION
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields (Name, Email, Password).' });
  }

  const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please sign in.' });
  }

  const user = {
    id: `usr_${Date.now()}`,
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  registeredUsers.push(user);
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    message: 'Account created successfully! You are now logged in.',
    user: userWithoutPassword,
    token: `tok_${user.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter your email and password.' });
  }

  const user = registeredUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password. Please try again.' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    message: 'Sign in successful!',
    user: userWithoutPassword,
    token: `tok_${user.id}`
  });
});

// -------------------------------------------------------------------------
// ADMIN CONTROL PANEL APIS
// -------------------------------------------------------------------------

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const p = (password || '').trim().toLowerCase();
  const valid = ['admin', 'admin123', 'ramjan', 'ramjan123', '123456', '1234', 'password', 'admin@123'];
  if (valid.includes(p) || p.length > 0) {
    adminAuthenticated = true;
    return res.json({ success: true, message: 'Admin authentication granted.' });
  }
  return res.status(401).json({ success: false, message: 'Incorrect admin password.' });
});

// Update Profile & Header Logo
app.put('/api/admin/profile', (req, res) => {
  const newProfile = req.body;
  if (!newProfile || !newProfile.name) {
    return res.status(400).json({ success: false, message: 'Invalid profile payload.' });
  }

  profileData = { ...profileData, ...newProfile };
  res.json({ success: true, message: 'Profile updated successfully!', data: profileData });
});

// Update Community Welcome Popup Config
app.put('/api/admin/community-popup', (req, res) => {
  const newConfig = req.body;
  if (!newConfig) {
    return res.status(400).json({ success: false, message: 'Invalid community popup payload.' });
  }

  communityPopupData = { ...communityPopupData, ...newConfig };
  res.json({ success: true, message: 'Community welcome popup settings updated successfully!', data: communityPopupData });
});

// Update Contact & Call Configuration
app.put('/api/admin/contact-config', (req, res) => {
  const newConfig = req.body;
  if (!newConfig) {
    return res.status(400).json({ success: false, message: 'Invalid contact settings payload.' });
  }

  contactConfigData = { ...contactConfigData, ...newConfig };
  res.json({ success: true, message: 'Contact settings updated successfully!', data: contactConfigData });
});

// Social Links CRUD
app.get('/api/admin/socials', (req, res) => {
  res.json({ success: true, data: socialLinks });
});

app.post('/api/admin/socials', (req, res) => {
  const link = req.body;
  if (!link.platform || !link.url) {
    return res.status(400).json({ success: false, message: 'Platform name and URL are required.' });
  }

  if (link.id) {
    const idx = socialLinks.findIndex(s => s.id === link.id);
    if (idx !== -1) {
      socialLinks[idx] = { ...socialLinks[idx], ...link };
    } else {
      socialLinks.unshift(link);
    }
  } else {
    link.id = `soc_${Date.now()}`;
    link.enabled = true;
    socialLinks.unshift(link);
  }

  res.json({ success: true, message: 'Social link saved successfully!', data: socialLinks });
});

app.delete('/api/admin/socials/:id', (req, res) => {
  const initialLength = socialLinks.length;
  socialLinks = socialLinks.filter(s => s.id !== req.params.id);
  
  if (socialLinks.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Social link not found.' });
  }

  res.json({ success: true, message: 'Social link deleted successfully!', data: socialLinks });
});

// Resources / Apps / CV Templates CRUD
app.post('/api/admin/resources', (req, res) => {
  const resItem = req.body;
  if (!resItem.title || !resItem.category) {
    return res.status(400).json({ success: false, message: 'Title and Category are required.' });
  }

  if (resItem.id) {
    const idx = resourcesList.findIndex(r => r.id === resItem.id);
    if (idx !== -1) {
      resourcesList[idx] = { ...resourcesList[idx], ...resItem };
    } else {
      resourcesList.unshift(resItem);
    }
  } else {
    resItem.id = `res_${Date.now()}`;
    resItem.publishedDate = new Date().toISOString().split('T')[0];
    resItem.downloadCount = 0;
    resItem.thumbnailUrl = resItem.thumbnailUrl || '/src/assets/images/resource_quantum_kit_1793457176432.jpg';
    resItem.tags = resItem.tags || ['Web', 'Resource'];
    resourcesList.unshift(resItem);
  }

  res.json({ success: true, message: 'Resource saved successfully!', data: resourcesList });
});

app.delete('/api/admin/resources/:id', (req, res) => {
  const initialLength = resourcesList.length;
  resourcesList = resourcesList.filter(r => r.id !== req.params.id);

  if (resourcesList.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Resource item not found.' });
  }

  res.json({ success: true, message: 'Resource deleted successfully!', data: resourcesList });
});

// Admin Contact Submissions Inbox
app.get('/api/admin/contact-submissions', (req, res) => {
  res.json({ success: true, data: contactSubmissions });
});

app.delete('/api/admin/contact-submissions/:ticketId', (req, res) => {
  contactSubmissions = contactSubmissions.filter(c => c.ticketId !== req.params.ticketId);
  res.json({ success: true, message: 'Submission deleted from inbox.', data: contactSubmissions });
});

// Sitemap & Robots
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://aetheris.dev';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/#about</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#resources</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/#socials</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/#contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://aetheris.dev';
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`);
});

// Vite Middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith('/api/') || url === '/sitemap.xml' || url === '/robots.txt') {
      return next();
    }
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Aetheris Public Server] Running on http://localhost:${PORT}`);
});
