export const isIOS = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) || 
           /safari/.test(userAgent) && /apple/.test(userAgent) ||
           /crios/.test(userAgent) || 
           /fxios/.test(userAgent) || 
           /brave/.test(userAgent);    
};