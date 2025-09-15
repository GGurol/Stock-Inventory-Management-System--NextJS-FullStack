import React, { Suspense } from "react";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";

import GlobalLoading from "@/components/GlobalLoading";
import { Toaster } from "@/components/ui/toaster"; // Using the shadcn toaster
import { AuthProvider } from "./authContext";
import { ThemeProvider } from "./ThemeProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// CORRECTED: Converted to a dynamic metadata function
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    title: "Stockly - Inventory Management System",
    description:
      "Stockly is a modern Next.js web application for efficient product inventory management.",
    authors: [
      { name: "Guney", url: "" },
    ],
    keywords: [
      "Stockly", "Inventory Management", "Next.js", "React", "Prisma", "MongoDB",
    ],
    icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
    openGraph: {
      title: "Stockly - Inventory Management System",
      description: "Efficiently manage your product inventory with Stockly.",
      url: siteUrl, // Uses the environment variable
      images: [
        {
          url: "https://github.com/user-attachments/assets/7495dcfb-c7cb-44e6-a1ef-d82930a8ada7",
          width: 1200,
          height: 630,
          alt: "Stockly Screenshot",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Stockly - Inventory Management System",
      description: "Efficiently manage your product inventory with Stockly.",
      images: [
        "https://github.com/user-attachments/assets/7495dcfb-c7cb-44e6-a1ef-d82930a8ada7",
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<GlobalLoading />}>
              {children}
            </Suspense>
            {/* CLEANED UP: Only one Toaster is needed */}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}