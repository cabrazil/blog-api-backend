import { Request } from 'express';

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters
export interface PaginationQuery {
  page?: string;
  limit?: string;
  offset?: string;
}

export interface ArticleQuery extends PaginationQuery {
  category?: string;
  tag?: string;
  search?: string;
  featured?: string;
  published?: string;
}

// Database types (from Prisma)
export interface Blog {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  themeSettingsJson?: any; // Campo legado (JSON)
  themeSettings?: any; // Nova relação estruturada
  status: string;
  ownerId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  description: string;
  date: Date;
  imageUrl: string;
  imageAlt?: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  authorId: number;
  userId?: number;
  slug: string;
  published: boolean;
  viewCount: number;
  likeCount: number;
  metadata?: any;
  keywords: string[];
  aiConfidence?: number;
  aiGenerated: boolean;
  aiModel?: string;
  aiPrompt?: string;
  blogId: number;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  aiKeywords: string[];
  aiPrompt?: string;
  blogId: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  aiRelated: boolean;
  blogId: number;
}

export interface Author {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  website?: string;
  social?: any;
  skills: string[];
  aiModel?: string;
  isAi: boolean;
  blogId: number;
}
