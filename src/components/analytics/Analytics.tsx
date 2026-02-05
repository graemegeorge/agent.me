'use client'

import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Script from 'next/script'

/**
 * Analytics component that provides:
 * 1. Vercel Analytics - Visitor tracking (automatic when deployed on Vercel)
 * 2. Vercel Speed Insights - Web Vitals performance metrics
 * 3. Google Analytics 4 - Detailed visitor demographics (optional, requires GA_MEASUREMENT_ID)
 */
export function Analytics() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <>
      {/* Vercel Analytics - tracks page views and visitors */}
      <VercelAnalytics />

      {/* Vercel Speed Insights - tracks Web Vitals (LCP, FID, CLS, etc.) */}
      <SpeedInsights />

      {/* Google Analytics 4 - optional, only loads if GA_MEASUREMENT_ID is set */}
      {gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}
    </>
  )
}
