import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/site';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'job' | 'course';
  image?: string;
  jsonLd?: Record<string, any>;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Codex Tech-IT connects skilled IT professionals with companies ready to hire through sharp profile positioning, interview coaching, and direct employer access.',
  canonical,
  type = 'website',
  image = '/assets/logo.png',
  jsonLd,
  schema,
}) => {
  const structuredData = jsonLd || schema;
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | We Deliver Jobs Faster | IT Recruitment, Staffing & Training`;
  const url = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type === 'job' || type === 'course' ? 'website' : type} />
      <meta property="og:image" content={`${siteConfig.url}${image}`} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteConfig.url}${image}`} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
