export interface CompanyInfo {
  id: string;
  name: string;
  description: string;
  vision: string;
  mission: string;
  founded_year: number;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  sector_id: string;
  name: string;
  description: string;
  status: 'active' | 'planned' | 'development';
  vision: string;
  target_market: string;
  launch_date: string;
  planUrl?: string;
}

export interface ProductFeature {
  id: string;
  product_id: string;
  feature: string;
  status: 'completed' | 'in_progress' | 'planned';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  sector_id: string | null;
  email: string;
  joined_date: string;
  bio: string;
}

export interface FinancialProjection {
  id: string;
  product_id: string;
  year: number;
  quarter: number;
  revenue_projection: number;
  user_projection: number;
}

export interface SectorContent {
  id: string;
  sector_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  image?: string;
  video_url?: string;
  category_id: number;
  created_at: string;
  updated_at?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  pinned: boolean;
  template?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  username?: string;
  email: string;
  role?: string;
}

