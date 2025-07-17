'use client';
import "./globals.css";
import { Roboto } from "next/font/google";
import { Layout, FixedPlugin } from "@/components";
import { SessionProvider } from 'next-auth/react';
import MusicPlayer from '@/components/MusicPlayer';
import { Providers } from './providers';
import AuthProvider from '@/providers/SessionProvider';


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${roboto.className} bg-black text-orange-50`}>
        <SessionProvider>
          <Providers>
            <AuthProvider>
        <Layout>
          {children}
          {/* <FixedPlugin /> */}
        </Layout>
        </AuthProvider>
        </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
