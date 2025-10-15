import { StatusEnum } from '../../core/constants/status';
import { PortfolioImage } from './image';

export interface PortfolioRequestBody {
  description: string;
  featured: boolean;
  features: string[];
  githubUrl?: string;
  id?: string;
  images: PortfolioImage[];
  liveUrl?: string;
  publishedAt?: Date;
  shortDescription: string;
  status: StatusEnum;
  technologies: string[];
  title: string;
}
