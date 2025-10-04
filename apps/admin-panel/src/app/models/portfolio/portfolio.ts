import { PortfolioImage } from './image';

export const enum PortfolioStatus {
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface Portfolio {
  createdAt: Date;
  description: string;
  featured: boolean;
  features: string[];
  githubUrl?: string;
  id: string;
  images: PortfolioImage[];
  liveUrl?: string;
  order: number;
  publishedAt?: Date;
  shortDescription: string;
  status: PortfolioStatus;
  technologies: string[];
  title: string;
  updatedAt: Date;
}
