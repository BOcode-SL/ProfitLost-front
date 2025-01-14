/**
 * Represents an ISO 8601 date string format
 * Example: "2024-03-18T15:30:00.000Z"
 */
export type ISODateString = string;

/**
 * HTTP Status Codes used in the application
 */
export type HttpStatusCode =
    | 0    // Connection Error
    | 200  // OK
    | 201  // Created
    | 400  // Bad Request
    | 401  // Unauthorized
    | 403  // Forbidden
    | 404  // Not Found
    | 409  // Conflict
    | 429  // Too Many Requests
    | 500; // Internal Server Error

/**
 * Base interface for successful API responses
 */
export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
    statusCode: HttpStatusCode;
}

/**
 * Base interface for error API responses
 */
export interface ApiErrorResponse<E = string> {
    success: false;
    message: string;
    error: E;
    statusCode: HttpStatusCode;
}

/**
 * Generic API response type
 */
export type ApiResponse<T = unknown, E = string> = ApiSuccessResponse<T> | ApiErrorResponse<E>;