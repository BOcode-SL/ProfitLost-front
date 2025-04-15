/**
 * Device Detection Utility
 * 
 * Provides functionality for detecting device types and operating systems.
 * Currently focuses on iOS detection for platform-specific behavior.
 * 
 * @module DeviceDetection
 */

/**
 * Determines if the current device is running iOS or using an iOS-based browser
 * 
 * This function checks the user agent string for various iOS identifiers including:
 * - Native iOS devices (iPhone, iPad, iPod)
 * - Safari on Apple devices
 * - Alternative browsers on iOS (Chrome, Firefox, Brave)
 * 
 * iOS detection is important for handling platform-specific features like:
 * - Authentication token storage (localStorage vs cookies)
 * - Touch-based interactions
 * - WebKit-specific behaviors
 * - PWA (Progressive Web App) capabilities
 * 
 * @returns {boolean} True if the device is running iOS, false otherwise
 */
export const isIOS = (): boolean => {
    // Get the userAgent from the browser and convert it to lowercase
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Check if the userAgent corresponds to an iOS device
    return /iphone|ipad|ipod/.test(userAgent) || 
           // Check if the browser is Safari on an Apple device
           (/safari/.test(userAgent) && /apple/.test(userAgent)) ||
           // Check if the browser is Chrome on iOS
           /crios/.test(userAgent) || 
           // Check if the browser is Firefox on iOS
           /fxios/.test(userAgent) || 
           // Check if the browser is Brave on iOS
           /brave/.test(userAgent);    
};