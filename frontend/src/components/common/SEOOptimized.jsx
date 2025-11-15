import React, { useEffect } from 'react';

/**
 * SEO Component optimized for React 19
 * Uses both react-helmet-async (for compatibility) and direct DOM manipulation
 * to ensure meta tags are always properly set
 */
const SEOOptimized = ({
  title = 'Kawesh - Building Tomorrow\'s Software Today',
  description = 'Professional software development agency specializing in custom development, cloud architecture, and digital transformation. Build scalable solutions with our expert team.',
  keywords = 'software development, web development, mobile apps, cloud architecture, digital transformation, custom software, Kawesh',
  ogImage = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Kawesh',
  twitterHandle = '@kawesh',
}) => {
  const siteName = 'Kawesh';
  const fullTitle = title.includes('Kawesh') ? title : `${title} | ${siteName}`;

  useEffect(() => {
    // Direct DOM manipulation to ensure meta tags are set
    // This works reliably with React 19's concurrent features
    
    // Update document title
    document.title = fullTitle;
    
    // Helper function to set or update meta tag
    const setMetaTag = (attribute, attributeValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Primary Meta Tags
    setMetaTag('name', 'title', fullTitle);
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', author);
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('name', 'language', 'English');
    setMetaTag('name', 'revisit-after', '7 days');

    // Open Graph / Facebook
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', siteName);

    // Twitter Card
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:url', url);
    setMetaTag('property', 'twitter:title', fullTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:image', ogImage);
    if (twitterHandle) {
      setMetaTag('property', 'twitter:site', twitterHandle);
      setMetaTag('property', 'twitter:creator', twitterHandle);
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }

  }, [fullTitle, description, keywords, ogImage, url, type, author, twitterHandle, siteName]);

  // Return null as this component only manages meta tags
  return null;
};

export default SEOOptimized;
