import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.byteswifts.com'),
  title: {
    default: "Byteswift Digital",
    template: "%s | Byteswift Digital"
  },
  description: "Tech analysis, Windows performance optimization, AI tools, and cybersecurity insights by A. Bayern.",
  openGraph: {
    title: "Byteswift Digital",
    description: "Tech analysis, Windows performance optimization, AI tools, and cybersecurity insights by A. Bayern.",
    url: "/",
    siteName: "Byteswift Digital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Byteswift Digital",
    description: "Tech analysis, Windows performance optimization, AI tools, and cybersecurity insights by A. Bayern.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Header />
        <main className="flex-grow pt-28">
          {children}
        </main>
        <Footer />
        
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
