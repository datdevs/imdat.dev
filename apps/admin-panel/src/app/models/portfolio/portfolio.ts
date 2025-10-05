import { StatusEnum } from '../../core/constants/status';
import { PortfolioImage } from './image';

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
  status: StatusEnum;
  technologies: string[];
  title: string;
  updatedAt: Date;
}
