/**
 * Error detail object
 * @description Contains error message, code, and optional validation errors
 */
export interface ErrorDetail {
  /** @example 400 */
  readonly code?: number;
  /**
   * @example {
   *   "file": "File path is required"
   * }
   */
  readonly errors?: Record<string, string>;
  /** @example Error message */
  readonly message?: string;
}

/**
 * Error response from API
 * @description Standard error response format for API errors
 */
export interface ErrorResponse {
  readonly error?: ErrorDetail;
  /** @example false */
  readonly success?: boolean;
  /**
   * Format: date-time
   * @example 2024-01-01T12:00:00+00:00
   */
  readonly timestamp?: string;
}
