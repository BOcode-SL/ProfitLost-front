/**
 * Common API Types Module
 * 
 * Contains shared type definitions used across the API layer.
 */

/**
 * Represents an ISO 8601 date string format
 * Example: "2024-03-18T15:30:00.000Z"
 */
export type ISODateString = string;

/**
 * HTTP Status Codes used in the application
 * Each code represents a specific response status from the server
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
 * @template T - The type of data returned in the response
 */
export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
    statusCode: HttpStatusCode;
}

/**
 * Base interface for error API responses
 * @template E - The type of error returned in the response
 */
export interface ApiErrorResponse<E = string> {
    success: false;
    message: string;
    error: E;
    statusCode: HttpStatusCode;
}

/**
 * Generic API response type
 * Represents either a successful or error response
 * 
 * @template T - The type of data returned in a successful response
 * @template E - The type of error returned in an error response
 */
export type ApiResponse<T = unknown, E = string> = ApiSuccessResponse<T> | ApiErrorResponse<E>;