import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Kawesh - Building Tomorrow\'s Software Today',
  description = 'Professional software development agency specializing in custom development, cloud architecture, and digital transformation. Build scalable solutions with our expert team.',
  keywords = 'software development, web development, mobile apps, cloud architecture, digital transformation, custom software, Kawesh',
  ogImage = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop',
  url = window.location.href,
  type = 'website',
}) => {
  const siteName = 'Kawesh';
  const fullTitle = title.includes('Kawesh') ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Kawesh" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
