import { Timestamp } from '@angular/fire/firestore';

import { StatusEnum } from '../../core/constants/status';
import { PortfolioImage } from './image';

export interface Portfolio {
  createdAt: Timestamp;
  description: string;
  featured: boolean;
  features: string[];
  githubUrl?: string;
  id: string;
  images: PortfolioImage[];
  liveUrl?: string;
  order: number;
  publishedAt?: Timestamp;
  shortDescription: string;
  status: StatusEnum;
  technologies: string[];
  title: string;
  updatedAt: Timestamp;
}
