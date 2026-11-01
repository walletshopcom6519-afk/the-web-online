export interface Profile {
  name: string;
  username: string;
  title: string;
  headline: string;
  bio: string;
  detailedBio: string;
  avatarUrl: string;
  headerLogoUrl?: string;
  location: string;
  status: string;
  stats: {
    totalDownloads: string;
    publishedTools: number;
    githubStars: string;
    uptime: string;
  };
  skills: string[];
}

export interface ContactConfig {
  phoneNumber: string;
  enablePhoneCall: boolean;
  email: string;
  address: string;
  callToAction: string;
}

export interface CommunityPopupConfig {
  enabled: boolean;
  whatsappTitle: string;
  whatsappLink: string;
  whatsappDescription: string;
  telegramTitle: string;
  telegramLink: string;
  telegramDescription: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  handle: string;
  url: string;
  icon: string;
  enabled: boolean;
  followerCount?: string;
}

export type ResourceCategory = 
  | 'All'
  | 'Developer Tools'
  | 'Premium Apps'
  | 'Free Apps'
  | 'Design Assets'
  | 'PDF Guides'
  | 'CV Templates'
  | 'Shaders & 3D'
  | 'Open Source Apps'
  | 'Audio & Plugins';

export type ResourceFileType = 'PDF' | 'ZIP' | 'EXE' | 'DMG' | 'GLTF' | 'LINK' | 'MP4' | 'WAV' | 'CODE';

export interface Resource {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ResourceCategory;
  subCategory?: string;
  fileType: ResourceFileType;
  fileSize?: string;
  publishedDate: string;
  version?: string;
  downloadCount: number;
  thumbnailUrl: string;
  downloadUrl?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  isComingSoon?: boolean;
  password?: string;
  isPasswordPublic?: boolean;
  price?: string;
  displayOrder?: number;
  tags: string[];
}

export interface ContactSubmission {
  ticketId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
  timestamp?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}
