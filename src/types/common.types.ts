export type ISODateString = string; // YYYY-MM-DDTHH:mm:ss.sssZ 

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

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
    statusCode: HttpStatusCode;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error: string;
    statusCode: HttpStatusCode;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;