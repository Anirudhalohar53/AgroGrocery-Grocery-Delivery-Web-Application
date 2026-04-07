import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Apply scroll-to-top to all pages for consistent behavior
        const shouldScrollToTop = pathname === '/' || 
                                pathname.startsWith('/product/') || 
                                pathname === '/cart' ||
                                pathname === '/Fruits' ||
                                pathname === '/Vegetables' ||
                                pathname === '/about' ||
                                pathname === '/contact' ||
                                pathname === '/login' ||
                                pathname === '/order' ||
                                pathname === '/verify' ||
                                pathname === '/myorders' ||
                                pathname === '/profile' ||
                                pathname === '/search';
        
        if (!shouldScrollToTop) {
            return;
        }

        // Immediately prevent any default scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Force scroll to top using multiple methods
        const forceScrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Immediate execution
        forceScrollToTop();
        
        // Single fallback with requestAnimationFrame
        const rafId = requestAnimationFrame(() => {
            forceScrollToTop();
        });

        // Additional fallback after content loads
        const timeoutId = setTimeout(forceScrollToTop, 100);

        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
