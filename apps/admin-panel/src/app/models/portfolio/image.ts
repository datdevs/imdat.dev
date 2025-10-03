import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class PortfolioImage {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @Expose()
  @IsNotEmpty()
  @IsUrl()
  url!: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  alt!: string;

  @Expose()
  @IsBoolean()
  isMain!: boolean;

  @Expose()
  @IsNumber()
  order!: number;

  // Business logic methods
  get isExternal(): boolean {
    return this.url.startsWith('http');
  }

  get thumbnailUrl(): string {
    // Add thumbnail logic if needed
    return this.url;
  }

  // Transform to plain object for Firestore
  toFirestore(): Record<string, any> {
    return {
      id: this.id,
      url: this.url,
      alt: this.alt,
      isMain: this.isMain,
      order: this.order,
    };
  }
}
