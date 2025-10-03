import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { PortfolioImage } from './image';

export enum PortfolioStatus {
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class Portfolio {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  shortDescription!: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  technologies!: string[];

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value ?? [])
  features!: string[];

  @Expose()
  @IsArray()
  @Transform(({ value }) => value ?? [])
  @Type(() => PortfolioImage)
  @ValidateNested({ each: true })
  images!: PortfolioImage[];

  @Expose()
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @Expose()
  @IsEnum(PortfolioStatus)
  status!: PortfolioStatus;

  @Expose()
  @IsBoolean()
  featured!: boolean;

  @Expose()
  @IsNumber()
  order!: number;

  @Expose()
  @IsDate()
  @Transform(({ value }) => (value?.toDate ? value.toDate() : new Date(value)))
  createdAt!: Date;

  @Expose()
  @IsDate()
  @Transform(({ value }) => (value?.toDate ? value.toDate() : new Date(value)))
  updatedAt!: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value?.toDate ? value.toDate() : value ? new Date(value) : undefined))
  publishedAt?: Date;

  // Business logic methods
  get isPublished(): boolean {
    return this.status === PortfolioStatus.PUBLISHED;
  }

  get isDraft(): boolean {
    return this.status === PortfolioStatus.DRAFT;
  }

  get isArchived(): boolean {
    return this.status === PortfolioStatus.ARCHIVED;
  }

  get mainImage(): PortfolioImage | undefined {
    return this.images.find((img) => img.isMain) ?? this.images[0];
  }

  get technologyTags(): string[] {
    return this.technologies.map((tech) => tech.toLowerCase());
  }

  // Validation method
  validate(): boolean {
    return this.title.length > 0 && this.description.length > 0 && this.technologies.length > 0;
  }

  // Transform to plain object for Firestore
  toFirestore(): Record<string, any> {
    return {
      title: this.title,
      description: this.description,
      shortDescription: this.shortDescription,
      technologies: this.technologies,
      features: this.features,
      images: this.images.map((img) => img.toFirestore()),
      liveUrl: this.liveUrl,
      githubUrl: this.githubUrl,
      status: this.status,
      featured: this.featured,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      publishedAt: this.publishedAt,
    };
  }
}
