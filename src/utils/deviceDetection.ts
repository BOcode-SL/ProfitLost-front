// Function that determines if the device is running iOS
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