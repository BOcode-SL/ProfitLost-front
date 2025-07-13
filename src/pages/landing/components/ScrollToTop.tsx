/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when navigating between routes
 * Designed to be used in route-based components that should start at the top
 * 
 * @module ScrollToTop
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that resets window scroll position on route change
 * 
 * @returns {null} No visual rendering, just performs scrolling behavior
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
