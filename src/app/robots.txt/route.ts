import { PUBLIC_ROUTES } from '@/configs/pagesroute';
import {  BaseClientUrl } from '@/configs/settings';
import { NextResponse } from 'next/server';

// Route handler for /robots.txt
export async function GET() {
  // Define environment-specific settings
  const isProduction = process.env.NODE_ENV === 'production';
  const siteUrl =isProduction ? `${BaseClientUrl}` : 'http://localhost:3000';




  // Generate robots.txt content
  const robotsContent = `
User-agent: *
${isProduction ? 'Allow: /' : 'Disallow: /'}  # Allow all in production, disallow all in development

# Public routes
${PUBLIC_ROUTES.map((route) => `Allow: ${route}`).join('\n')}

# Dynamic test pages (e.g., /test?test_id=...)

Disallow: /forgetpassword
allow: /signup
allow:/signin
# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Disallow sensitive or admin routes
Disallow: /dashboard
Disallow: /tests
Disallow: /users
Disallow: /account
Disallow: /laboratory


# Prevent crawling of API routes
Disallow: /api/*
`;

  // Return robots.txt as plain text
  return new NextResponse(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}