import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/content";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const site = getSiteConfig();

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description: site.description,
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoSlab.variable} h-full`}>
      <body className="min-h-full">
        <div className="min-h-full bg-surface">
          <div className="mx-auto min-h-full max-w-6xl bg-white shadow-lg">
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </div>
        {site.analyticsId && <GoogleAnalytics gaId={site.analyticsId} />}
      </body>
    </html>
  );
}