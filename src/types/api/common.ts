/**
 * Common API Types Module
 * 
 * Contains shared type definitions used across the API layer.
 * Defines the standard response formats, HTTP status codes, and date types
 * used for all API interactions.
 * 
 * @module ApiCommon
 */

/**
 * Represents an ISO 8601 date string format
 * Example: "2024-03-18T15:30:00.000Z"
 * 
 * @typedef {string} ISODateString
 */
export type ISODateString = string;

/**
 * HTTP Status Codes used in the application
 * Each code represents a specific response status from the server
 * 
 * @typedef {number} HttpStatusCode
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
 * Standardizes the format of all successful responses from the API
 * 
 * @interface ApiSuccessResponse
 * @template T - The type of data returned in the response
 * @property {true} success - Always true for successful responses
 * @property {string} message - Human-readable success message
 * @property {T} [data] - Optional response data payload
 * @property {HttpStatusCode} statusCode - HTTP status code (typically 200 or 201)
 */
export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
    statusCode: HttpStatusCode;
}

/**
 * Base interface for error API responses
 * Standardizes the format of all error responses from the API
 * 
 * @interface ApiErrorResponse
 * @template E - The type of error returned in the response
 * @property {false} success - Always false for error responses
 * @property {string} message - Human-readable error message
 * @property {E} error - Error code or identifier
 * @property {HttpStatusCode} statusCode - HTTP status code (typically 4xx or 5xx)
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
 * Used as the return type for all API methods
 * 
 * @typedef {ApiSuccessResponse<T> | ApiErrorResponse<E>} ApiResponse
 * @template T - The type of data returned in a successful response
 * @template E - The type of error returned in an error response
 */
export type ApiResponse<T = unknown, E = string> = ApiSuccessResponse<T> | ApiErrorResponse<E>;