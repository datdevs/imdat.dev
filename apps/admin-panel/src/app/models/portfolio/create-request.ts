import { StatusEnum } from '../../core/constants/status';
import { PortfolioImage } from './image';

export interface CreatePortfolioRequest {
  description: string;
  featured: boolean;
  features: string[];
  githubUrl?: string;
  images: Omit<PortfolioImage, 'id'>[];
  liveUrl?: string;
  publishedAt?: Date;
  shortDescription: string;
  status: StatusEnum;
  technologies: string[];
  title: string;
}
