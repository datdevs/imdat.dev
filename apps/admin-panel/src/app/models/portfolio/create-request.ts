import { PortfolioImage } from './image';
import { PortfolioStatus } from './portfolio';

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
  status: PortfolioStatus;
  technologies: string[];
  title: string;
}
