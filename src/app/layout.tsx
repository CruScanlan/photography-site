import type { Metadata } from 'next';
import Script from 'next/script';
import { GA_TRACKING_ID } from 'utils/analytics';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import 'styles/global.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Cru Scanlan Photography',
  description: 'Cru Scanlan is a landscape photographer based in South East Queensland, Australia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {GA_TRACKING_ID && (
            <>
              <Script 
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="afterInteractive"
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
              >
                {`
                  try {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', { 
                        page_path: window.location.pathname,
                    });
                  } catch(e) {
                    console.error('GA initialization error:', e);
                  }
                `}
              </Script>
            </>
          )}
          <Analytics />
          <SpeedInsights />
          {children}
        </Providers>
      </body>
    </html>
  );
}

