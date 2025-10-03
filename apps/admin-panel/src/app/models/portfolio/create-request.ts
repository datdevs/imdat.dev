import { PortfolioImage } from './image';

export interface CreatePortfolioRequest {
  description: string;
  featured: boolean;
  features: string[];
  githubUrl?: string;
  images: Omit<PortfolioImage, 'id'>[];
  liveUrl?: string;
  order: number;
  publishedAt?: Date;
  shortDescription: string;
  status: 'archived' | 'draft' | 'published';
  technologies: string[];
  title: string;
}
