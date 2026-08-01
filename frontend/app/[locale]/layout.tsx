import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "sonner";
import DynamicFavicon from '@/components/DynamicFavicon';
import "../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const title = "Superman Transport | Smart Global Freight & Consolidation";
  const description = locale === 'vi' 
    ? "Superman Transport giúp bạn vận chuyển thông minh hơn với các dịch vụ chuyên nghiệp — bao gồm đường hàng không, đường biển, kho bãi, đường bộ, hải quan & gom hàng toàn cầu."
    : "Superman Transport helps you move smarter with expert freight services — including air, sea, warehousing, trucking, customs clearance & global consolidation.";

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | Superman Transport`
    },
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: 'Superman Transport',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: '/',
      languages: {
        'en': `/en`,
        'vi': `/vi`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <DynamicFavicon />
          {children}
        </NextIntlClientProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
