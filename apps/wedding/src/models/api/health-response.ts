/**
 * Health check response
 * @description Response from the health check endpoint
 */
export interface HealthResponse {
  /** @example true */
  readonly success?: boolean;
  /**
   * Format: date-time
   * @example 2024-01-01T12:00:00+00:00
   */
  readonly timestamp?: string;
  readonly data?: HealthData;
}

/**
 * Health data object
 * @description Contains health status, version, and timestamp information
 */
export interface HealthData {
  /** @example ok */
  readonly status?: string;
  /** @example 1.0.0 */
  readonly version?: string;
  /**
   * Format: date-time
   * @example 2024-01-01T12:00:00+00:00
   */
  readonly timestamp?: string;
}
