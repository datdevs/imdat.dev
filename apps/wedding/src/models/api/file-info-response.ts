/**
 * File information response
 * @description Response containing metadata about a media file
 */
export interface FileInfoResponse {
  /** @example true */
  readonly success?: boolean;
  /**
   * Format: date-time
   * @example 2024-01-01T12:00:00+00:00
   */
  readonly timestamp?: string;
  readonly data?: FileInfo;
}

/**
 * File information data object
 * @description Contains file metadata including path, size, MIME type, and modification time
 */
export interface FileInfo {
  /**
   * @description Relative file path
   * @example images/photo.jpg
   */
  readonly path?: string;
  /**
   * @description File name
   * @example photo.jpg
   */
  readonly name?: string;
  /**
   * @description File size in bytes
   * @example 123456
   */
  readonly size?: number;
  /**
   * @description MIME type of the file
   * @example image/jpeg
   */
  readonly mime_type?: null | string;
  /**
   * @description Unix timestamp of last modification
   * @example 1704067200
   */
  readonly modified?: number;
}
