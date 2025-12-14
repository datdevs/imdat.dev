/**
 * Signed URL data object
 * @description Contains the signed URL and expiration information
 */
export interface SignedUrlData {
  /**
   * @description Unix timestamp when the URL expires
   * @example 1704067200
   */
  readonly expires_at?: number;
  /**
   * @description Number of seconds until expiration
   * @example 3600
   */
  readonly expires_in?: number;
  /**
   * Format: uri
   * @description Signed URL for accessing the file
   * @example https://storage.imdat.dev/api/media/serve?file=images/photo.jpg&expires=1704067200&signature=abc123...
   */
  readonly url?: string;
}

/**
 * Signed URL response for media file access
 * @description Response from the media signing API endpoint
 */
export interface SignedUrlResponse {
  readonly data?: SignedUrlData;
  /** @example true */
  readonly success?: boolean;
  /**
   * Format: date-time
   * @example 2024-01-01T12:00:00+00:00
   */
  readonly timestamp?: string;
}
